import { NextResponse } from "next/server";
import {
  findAdminLessonById,
  setLessonStatus,
} from "@/lib/admin/bookings";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const expected = process.env.INTERNAL_API_TOKEN;
  if (!expected) return false;
  const got = req.headers.get("authorization") ?? "";
  return got === `Bearer ${expected}`;
}

function ruDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tbilisi",
  });
}

// POST /api/internal/mod-decision
// Body: { lessonId: "123", action: "confirm" | "reject", modName?: string }
// Бот-админ вызывает при клике на inline-кнопку модератором.
export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { lessonId?: string; action?: "confirm" | "reject"; modName?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }

  const lessonId = (body.lessonId ?? "").trim();
  const action = body.action;
  if (!lessonId || (action !== "confirm" && action !== "reject")) {
    return NextResponse.json({ ok: false, error: "bad params" }, { status: 400 });
  }

  const lesson = await findAdminLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }

  if (lesson.status !== "pending" && lesson.status !== "confirmed") {
    return NextResponse.json(
      { ok: false, error: "already_closed", status: lesson.status },
      { status: 400 },
    );
  }

  if (action === "confirm") {
    await setLessonStatus(lesson.id, "confirmed");
    if (lesson.user_id) {
      await createNotification(
        lesson.user_id,
        "Заявка подтверждена",
        `${lesson.kind === "theory" ? "Теория" : "Практика"} на ${ruDate(lesson.scheduled_at)} подтверждена.`,
        "booking",
      );
    }
  } else {
    await setLessonStatus(lesson.id, "cancelled");
    if (lesson.user_id) {
      await createNotification(
        lesson.user_id,
        "Заявка отклонена",
        `${lesson.kind === "theory" ? "Теория" : "Практика"} на ${ruDate(lesson.scheduled_at)} отклонена. Запишись на другое время.`,
        "warning",
      );
    }
  }

  return NextResponse.json({
    ok: true,
    newStatus: action === "confirm" ? "confirmed" : "cancelled",
    modName: body.modName ?? null,
  });
}
