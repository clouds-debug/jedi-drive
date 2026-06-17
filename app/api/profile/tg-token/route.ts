import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { query } from "@/lib/db";
import { rateLimit, tooManyResponse } from "@/lib/rate-limit";
import { randomBytes } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function makeToken(): string {
  return randomBytes(5).toString("base64url").slice(0, 8).toUpperCase();
}

export async function POST() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findUserById(session.userId);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (me.is_blocked) return NextResponse.json({ error: "Blocked" }, { status: 403 });

  const rate = rateLimit({
    key: `tg-token:${me.id}`,
    max: 5,
    windowMs: 60 * 60 * 1000,
  });
  if (!rate.ok) {
    return tooManyResponse(rate, "Слишком часто. Попробуй через час.");
  }

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

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findUserById(session.userId);
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ linked: me.telegram_chat_id !== null });
}

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
