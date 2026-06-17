import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import {
  findLessonById,
  getTakenTimesForDay,
  rescheduleLesson,
} from "@/lib/lessons";
import { createNotification } from "@/lib/notifications";
import { instructors } from "@/lib/instructors/data";

export const runtime = "nodejs";

const MIN_HOURS_BEFORE = 24;

export async function POST(
  req: NextRequest,
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
    return NextResponse.json({ error: "Эту заявку уже нельзя перенести" }, { status: 400 });
  }

  const currentHoursLeft = (new Date(lesson.scheduled_at).getTime() - Date.now()) / 36e5;
  if (currentHoursLeft < MIN_HOURS_BEFORE) {
    return NextResponse.json(
      { error: `Перенести можно не позднее чем за ${MIN_HOURS_BEFORE}ч до начала` },
      { status: 400 },
    );
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

  const newHoursAhead = (newDate.getTime() - Date.now()) / 36e5;
  if (newHoursAhead < MIN_HOURS_BEFORE) {
    return NextResponse.json(
      { error: `Новое время должно быть не раньше чем через ${MIN_HOURS_BEFORE}ч` },
      { status: 400 },
    );
  }

  let newInstructor: { id: string; name: string } | null = null;
  if (lesson.kind === "practice" && body.instructorId) {
    const inst = instructors.find((i) => i.id === body.instructorId);
    if (!inst) {
      return NextResponse.json({ error: "Инструктор не найден" }, { status: 400 });
    }
    newInstructor = { id: inst.id, name: inst.name };
  }

  const effectiveInstructorId = newInstructor?.id ?? lesson.instructor_id;
  if (lesson.kind === "practice" && effectiveInstructorId) {
    const dayOffset = Math.floor((newDate.getTime() - startOfTodayUTC()) / 86400000);
    const taken = await getTakenTimesForDay(effectiveInstructorId, dayOffset, lesson.id);
    const hhmm = newDate
      .toISOString()
      .slice(11, 16); // "HH:MM"
    if (taken.includes(hhmm)) {
      return NextResponse.json(
        { error: "В это время у инструктора уже есть запись" },
        { status: 409 },
      );
    }
  }

  const updated = await rescheduleLesson(
    id,
    session.userId,
    newDate.toISOString(),
    newInstructor,
  );
  if (!updated) return NextResponse.json({ error: "Не удалось перенести" }, { status: 400 });

  await createNotification(
    session.userId,
    "Заявка перенесена",
    `${lesson.kind === "theory" ? "Теория" : "Практика"} перенесена на ${newDate.toLocaleString("ru-RU", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" })}. Ждём подтверждения.`,
    "booking",
  );

  return NextResponse.json({ ok: true });
}

function startOfTodayUTC(): number {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d.getTime();
}
