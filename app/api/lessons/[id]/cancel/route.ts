import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { cancelLessonByUser, findLessonById } from "@/lib/lessons";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";

const MIN_HOURS_BEFORE = 24;

export async function POST(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const lesson = await findLessonById(id);
  if (!lesson || lesson.user_id !== session.userId) {
    return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  }
  if (lesson.status !== "pending" && lesson.status !== "confirmed") {
    return NextResponse.json({ error: "Эту заявку уже нельзя отменить" }, { status: 400 });
  }

  const hoursLeft = (new Date(lesson.scheduled_at).getTime() - Date.now()) / 36e5;
  if (hoursLeft < MIN_HOURS_BEFORE) {
    return NextResponse.json(
      { error: `Отменить можно не позднее чем за ${MIN_HOURS_BEFORE}ч до начала` },
      { status: 400 },
    );
  }

  const updated = await cancelLessonByUser(id, session.userId);
  if (!updated) return NextResponse.json({ error: "Не удалось отменить" }, { status: 400 });

  await createNotification(
    session.userId,
    "Заявка отменена",
    `${lesson.kind === "theory" ? "Теория" : "Практика"} · ${new Date(lesson.scheduled_at).toLocaleDateString("ru-RU")} — отменена тобой.`,
    "system",
  );

  return NextResponse.json({ ok: true });
}
