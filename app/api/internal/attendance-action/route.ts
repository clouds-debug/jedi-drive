import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { setLessonStatus, findAdminLessonById } from "@/lib/admin/bookings";
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

// POST /api/internal/attendance-action
// Body: { lessonId, action: 'handled' | 'cancel' }
// Вызывается из bot-admin при тапе кнопки на карточке ответа ученика.
export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let body: { lessonId?: string; action?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const lessonId = (body.lessonId ?? "").trim();
  const action = body.action;
  if (!lessonId || (action !== "handled" && action !== "cancel")) {
    return NextResponse.json({ ok: false, error: "bad params" }, { status: 400 });
  }

  if (action === "handled") {
    await query(
      `UPDATE lessons SET attendance_handled_at = now() WHERE id = $1::bigint`,
      [lessonId],
    );
    return NextResponse.json({ ok: true });
  }

  // cancel
  const lesson = await findAdminLessonById(lessonId);
  if (!lesson) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  await setLessonStatus(lesson.id, "cancelled");
  await query(
    `UPDATE lessons SET attendance_handled_at = now() WHERE id = $1::bigint`,
    [lessonId],
  );
  if (lesson.user_id) {
    await createNotification(
      lesson.user_id,
      "Занятие отменено",
      `Практика на ${ruDate(lesson.scheduled_at)} отменена.`,
      "warning",
    );
  }
  return NextResponse.json({ ok: true });
}
