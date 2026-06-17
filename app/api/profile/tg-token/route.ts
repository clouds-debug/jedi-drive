import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { query } from "@/lib/db";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeToken(): string {
  // 6 байт → base32-like короткая строка
  return randomBytes(5).toString("base64url").slice(0, 8).toUpperCase();
}

// POST /api/profile/tg-token — генерим короткий токен для привязки TG.
// Возвращаем токен + username бота, чтобы фронт открыл deep-link.
export async function POST() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findUserById(session.userId);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (me.is_blocked) return NextResponse.json({ error: "Blocked" }, { status: 403 });

  const token = makeToken();
  await query(
    `UPDATE users SET telegram_link_token = $1, telegram_link_token_at = now() WHERE id = $2::bigint`,
    [token, me.id],
  );

  const botUsername = process.env.TELEGRAM_USER_BOT_USERNAME || "jedidrive_bot";
  return NextResponse.json({
    ok: true,
    token,
    botUsername,
    deepLink: `https://t.me/${botUsername}?start=${token}`,
  });
}

// GET /api/profile/tg-token — статус привязки (для poll после открытия TG).
export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findUserById(session.userId);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ linked: me.telegram_chat_id !== null });
}

// DELETE /api/profile/tg-token — отвязать (с подтверждением во фронте).
export async function DELETE() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findUserById(session.userId);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await query(
    `UPDATE users SET telegram_chat_id = NULL, telegram_link_token = NULL, telegram_link_token_at = NULL WHERE id = $1::bigint`,
    [me.id],
  );
  return NextResponse.json({ ok: true });
}
