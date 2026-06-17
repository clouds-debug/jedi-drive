import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { checkInternalAuth } from "@/lib/internal-auth";

export const dynamic = "force-dynamic";


// POST /api/internal/tg-status
// Body: { chatId: 12345 }
// Бот вызывает при простом /start (без токена) чтобы понять — это новый юзер или уже привязанный.
export async function POST(req: Request) {
  if (!checkInternalAuth(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let body: { chatId?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const chatId = Number(body.chatId);
  if (!Number.isFinite(chatId)) {
    return NextResponse.json({ ok: false, error: "bad chatId" }, { status: 400 });
  }
  const rows = await query<{ first_name: string | null }>(
    `SELECT first_name FROM users WHERE telegram_chat_id = $1 LIMIT 1`,
    [chatId],
  );
  if (rows.length === 0) {
    return NextResponse.json({ ok: true, linked: false });
  }
  return NextResponse.json({
    ok: true,
    linked: true,
    firstName: rows[0].first_name,
  });
}
