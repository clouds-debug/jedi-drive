import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { dispatchAttendanceCard } from "@/lib/telegram-dispatch";
import { checkInternalAuth } from "@/lib/internal-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";


// POST /api/internal/attendance
// Body: { lessonId, response: 'coming'|'not_coming', chatId }
// chatId — для верификации (что это именно владелец занятия)
export async function POST(req: Request) {
  if (!checkInternalAuth(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let body: { lessonId?: string; response?: string; chatId?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const lessonId = (body.lessonId ?? "").trim();
  const response = body.response;
  const chatId = Number(body.chatId);
  if (!lessonId || (response !== "coming" && response !== "not_coming") || !Number.isFinite(chatId)) {
    return NextResponse.json({ ok: false, error: "bad params" }, { status: 400 });
  }

  // Найдём занятие и убедимся что владелец = этот chat_id
  const rows = await query<{
    id: string;
    scheduled_at: string;
    instructor_name: string | null;
    format: string | null;
    user_login: string | null;
    user_first_name: string | null;
    user_last_name: string | null;
    user_phone: string | null;
    user_telegram_username: string | null;
    current_response: string | null;
    status: string;
  }>(
    `SELECT l.id::text, l.scheduled_at, l.instructor_name, l.format,
            u.login AS user_login, u.first_name AS user_first_name,
            u.last_name AS user_last_name, u.phone AS user_phone,
            u.telegram_username AS user_telegram_username,
            l.user_attendance AS current_response,
            l.status
     FROM lessons l
     JOIN users u ON u.id = l.user_id
     WHERE l.id = $1::bigint AND u.telegram_chat_id = $2 LIMIT 1`,
    [lessonId, chatId],
  );
  if (rows.length === 0) {
    return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
  }
  const lesson = rows[0];
  if (lesson.status !== "confirmed") {
    return NextResponse.json(
      { ok: false, error: "not_confirmed", message: "Занятие уже не в статусе «подтверждено»." },
      { status: 400 },
    );
  }
  if (lesson.current_response) {
    // уже отвечал — не пересоздаём карточку модерам, просто подтверждаем
    return NextResponse.json({ ok: true, alreadyResponded: true });
  }

  await query(
    `UPDATE lessons SET user_attendance = $1 WHERE id = $2::bigint`,
    [response, lessonId],
  );

  const fullName =
    [lesson.user_first_name, lesson.user_last_name].filter(Boolean).join(" ") ||
    lesson.user_login ||
    "—";
  void dispatchAttendanceCard({
    lessonId,
    fullName,
    login: lesson.user_login,
    phone: lesson.user_phone,
    telegramUsername: lesson.user_telegram_username,
    scheduledAt: new Date(lesson.scheduled_at),
    instructorName: lesson.instructor_name,
    format: lesson.format,
    response: response as "coming" | "not_coming",
  }).catch((e) => console.error("[attendance] dispatch failed", e));

  return NextResponse.json({ ok: true });
}
