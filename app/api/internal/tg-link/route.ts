import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { checkInternalAuth } from "@/lib/internal-auth";

export const dynamic = "force-dynamic";


// POST /api/internal/tg-link
// Body: { token: "ABC123", chatId: 12345 }
export async function POST(req: Request) {
  if (!checkInternalAuth(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { token?: string; chatId?: number; username?: string | null };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const token = (body.token ?? "").trim();
  const chatId = Number(body.chatId);
  const username = (body.username ?? "").trim() || null;
  if (!token || !Number.isFinite(chatId)) {
    return NextResponse.json({ ok: false, error: "missing token or chatId" }, { status: 400 });
  }

  const blocked = await query<{ chat_id: string }>(
    `SELECT chat_id::text AS chat_id FROM blocked_chat_ids WHERE chat_id = $1`,
    [chatId],
  );
  if (blocked.length > 0) {
    return NextResponse.json(
      { ok: false, error: "blocked", message: "Этот Telegram заблокирован." },
      { status: 403 },
    );
  }

  const rows = await query<{ id: string; first_name: string | null; is_blocked: boolean }>(
    `SELECT id::text, first_name, is_blocked
     FROM users
     WHERE telegram_link_token = $1
       AND telegram_link_token_at > now() - interval '30 minutes'
     LIMIT 1`,
    [token],
  );
  if (rows.length === 0) {
    return NextResponse.json(
      { ok: false, error: "bad_token", message: "Токен не найден или истёк. Запроси новый в кабинете." },
      { status: 404 },
    );
  }
  const u = rows[0];
  if (u.is_blocked) {
    return NextResponse.json(
      { ok: false, error: "user_blocked", message: "Аккаунт заблокирован." },
      { status: 403 },
    );
  }

  const exists = await query<{ id: string }>(
    `SELECT id::text FROM users WHERE telegram_chat_id = $1 AND id::text <> $2 LIMIT 1`,
    [chatId, u.id],
  );
  if (exists.length > 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "chat_taken",
        message: "Этот Telegram уже привязан к другому аккаунту.",
      },
      { status: 409 },
    );
  }

  await query(
    `UPDATE users
     SET telegram_chat_id = $1,
         telegram_username = COALESCE($2, telegram_username),
         telegram_link_token = NULL,
         telegram_link_token_at = NULL
     WHERE id = $3::bigint`,
    [chatId, username, u.id],
  );

  return NextResponse.json({
    ok: true,
    firstName: u.first_name ?? null,
  });
}
