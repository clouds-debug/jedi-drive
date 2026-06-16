import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { canModerate } from "@/lib/auth/require";
import {
  findLessonById,
  getTakenTimesForDay,
  rescheduleLesson,
} from "@/lib/lessons";
import { createNotification } from "@/lib/notifications";
import { dayOffsetFromUtc } from "@/lib/tz";
import { instructors } from "@/lib/instructors/data";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const lesson = await findLessonById(id);
  if (!lesson) return NextResponse.json({ error: "Не найдено" }, { status: 404 });

  const isInstructorOwn =
    me.role === "instructor" &&
    me.instructor_ref !== null &&
    lesson.instructor_id === me.instructor_ref;
  if (!canModerate(me.role) && !isInstructorOwn) {
    return NextResponse.json({ error: "Нет прав" }, { status: 403 });
  }

  if (lesson.status !== "pending" && lesson.status !== "confirmed") {
    return NextResponse.json({ error: "Заявка уже закрыта" }, { status: 400 });
  }

  let body: { scheduledAt?: string; instructorId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (!body.scheduledAt || typeof body.scheduledAt !== "string") {
    return NextResponse.json({ error: "Укажи дату и время" }, { status: 400 });
  }

  const newDate = new Date(body.scheduledAt);
  if (Number.isNaN(newDate.getTime())) {
    return NextResponse.json({ error: "Неверная дата" }, { status: 400 });
  }

  // Опционально — смена инструктора.
  let newInstructor: { id: string; name: string } | null = null;
  if (lesson.kind === "practice" && body.instructorId) {
    const inst = instructors.find((i) => i.id === body.instructorId);
    if (!inst) {
      return NextResponse.json({ error: "Инструктор не найден" }, { status: 400 });
    }
    newInstructor = { id: inst.id, name: inst.name };
  }

  // Для практики — проверка свободного слота у инструктора (нового или текущего).
  const effectiveInstructorId = newInstructor?.id ?? lesson.instructor_id;
  if (lesson.kind === "practice" && effectiveInstructorId) {
    const dayOffset = dayOffsetFromUtc(newDate);
    const taken = await getTakenTimesForDay(effectiveInstructorId, dayOffset, lesson.id);
    const hhmm = new Date(newDate.getTime() + 4 * 60 * 60 * 1000)
      .toISOString()
      .slice(11, 16);
    if (taken.includes(hhmm)) {
      return NextResponse.json(
        { error: "В это время у инструктора уже есть запись" },
        { status: 409 },
      );
    }
  }

  const updated = await rescheduleLesson(
    id,
    lesson.user_id,
    newDate.toISOString(),
    newInstructor,
  );
  if (!updated) return NextResponse.json({ error: "Не удалось перенести" }, { status: 400 });

  await createNotification(
    lesson.user_id,
    "Занятие перенесено",
    `${lesson.kind === "theory" ? "Теория" : "Практика"} перенесена на ${newDate.toLocaleString("ru-RU", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })} по решению ${me.role === "instructor" ? "инструктора" : "администрации"}.`,
    "booking",
  );

  return NextResponse.json({ ok: true });
}
