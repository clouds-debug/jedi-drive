import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/lib/auth/users";
import { readSession } from "@/lib/auth/session";
import { canModerate } from "@/lib/auth/require";
import { findAdminLessonById, setLessonStatus } from "@/lib/admin/bookings";
import { createNotification } from "@/lib/notifications";
import { dispatchModCardClose } from "@/lib/telegram-dispatch";
import { query } from "@/lib/db";

export const runtime = "nodejs";

function ruDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tbilisi",
  });
}

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findUserById(session.userId);
  if (!me || !canModerate(me.role)) {
    return NextResponse.json({ error: "Нет прав" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const lesson = await findAdminLessonById(id);
  if (!lesson) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  let body: { action?: "handled" | "cancel" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  if (body.action === "handled") {
    await query(
      `UPDATE lessons SET attendance_handled_at = now() WHERE id = $1::bigint`,
      [lesson.id],
    );
    void dispatchModCardClose(lesson.id, "confirmed", `@${me.login}`).catch(() => {});
    return NextResponse.json({ ok: true });
  }
  if (body.action === "cancel") {
    await setLessonStatus(lesson.id, "cancelled");
    await query(
      `UPDATE lessons SET attendance_handled_at = now() WHERE id = $1::bigint`,
      [lesson.id],
    );
    if (lesson.user_id) {
      await createNotification(
        lesson.user_id,
        "Занятие отменено",
        `Практика на ${ruDate(lesson.scheduled_at)} отменена.`,
        "warning",
      );
    }
    void dispatchModCardClose(lesson.id, "cancelled", `@${me.login}`).catch(() => {});
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "bad action" }, { status: 400 });
}
