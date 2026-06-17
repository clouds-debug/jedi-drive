import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/lib/auth/users";
import { readSession } from "@/lib/auth/session";
import { canModerate } from "@/lib/auth/require";
import {
  findAdminLessonById,
  setLessonStatus,
} from "@/lib/admin/bookings";
import { createNotification } from "@/lib/notifications";
import { dispatchModCardClose } from "@/lib/telegram-dispatch";

export const runtime = "nodejs";

function ruDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const lesson = await findAdminLessonById(id);
  if (!lesson) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  // Право принимать решение: модератор/админ — любые; инструктор — только свои.
  const isInstructorOwn =
    me.role === "instructor" &&
    me.instructor_ref !== null &&
    lesson.instructor_id === me.instructor_ref;
  if (!canModerate(me.role) && !isInstructorOwn) {
    return NextResponse.json({ error: "Нет прав" }, { status: 403 });
  }

  let body: { action?: "confirm" | "reject"; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (lesson.status !== "pending" && lesson.status !== "confirmed") {
    return NextResponse.json({ error: "Заявка уже закрыта" }, { status: 400 });
  }

  const modName = `@${me.login}`;

  if (body.action === "confirm") {
    await setLessonStatus(lesson.id, "confirmed");
    if (lesson.user_id) {
      await createNotification(
        lesson.user_id,
        "Заявка подтверждена",
        `${lesson.kind === "theory" ? "Теория" : "Практика"} на ${ruDate(lesson.scheduled_at)} подтверждена.`,
        "booking",
      );
    }
    void dispatchModCardClose(lesson.id, "confirmed", modName).catch(() => {});
    return NextResponse.json({ ok: true });
  }

  if (body.action === "reject") {
    await setLessonStatus(lesson.id, "cancelled");
    const reason = (body.reason ?? "").trim();
    if (lesson.user_id) {
      await createNotification(
        lesson.user_id,
        "Заявка отклонена",
        reason
          ? `${lesson.kind === "theory" ? "Теория" : "Практика"} на ${ruDate(lesson.scheduled_at)}: ${reason}`
          : `${lesson.kind === "theory" ? "Теория" : "Практика"} на ${ruDate(lesson.scheduled_at)} отклонена. Запишись на другое время.`,
        "warning",
      );
    }
    void dispatchModCardClose(lesson.id, "cancelled", modName).catch(() => {});
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
}
