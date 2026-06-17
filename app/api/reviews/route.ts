import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import {
  createReview,
  findActiveReview,
  hasCompletedLessonWith,
} from "@/lib/reviews";
import { instructors } from "@/lib/instructors/data";

export const runtime = "nodejs";

const MAX_BODY = 800;

export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.is_blocked) {
    return NextResponse.json({ error: "Недоступно" }, { status: 403 });
  }

  let body: { instructorId?: string; rating?: number; body?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const instructorId = typeof body.instructorId === "string" ? body.instructorId : "";
  if (!instructorId || !instructors.find((i) => i.id === instructorId)) {
    return NextResponse.json({ error: "Инструктор не найден" }, { status: 400 });
  }

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Оценка от 1 до 5" }, { status: 400 });
  }

  const text = typeof body.body === "string" ? body.body.trim() : "";
  if (text.length > MAX_BODY) {
    return NextResponse.json(
      { error: `Комментарий не длиннее ${MAX_BODY} символов` },
      { status: 400 },
    );
  }

  const eligible = await hasCompletedLessonWith(me.id, instructorId);
  if (!eligible) {
    return NextResponse.json(
      { error: "Оставить отзыв можно только после проведённого занятия" },
      { status: 403 },
    );
  }

  const existing = await findActiveReview(me.id, instructorId);
  if (existing) {
    return NextResponse.json(
      { error: "Ты уже оставлял отзыв этому инструктору" },
      { status: 409 },
    );
  }

  await createReview(me.id, instructorId, rating, text || null);
  return NextResponse.json({ ok: true });
}
