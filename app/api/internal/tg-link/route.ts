import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const expected = process.env.INTERNAL_API_TOKEN;
  if (!expected) return false;
  const got = req.headers.get("authorization") ?? "";
  return got === `Bearer ${expected}`;
}

// POST /api/internal/tg-link
// Body: { token: "ABC123", chatId: 12345 }
// Бот вызывает при /start <token>. Если токен валидный и chat_id не заблокирован —
// привязывает users.telegram_chat_id, чистит токен.
export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: { token?: string; chatId?: number };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const token = (body.token ?? "").trim();
  const chatId = Number(body.chatId);
  if (!token || !Number.isFinite(chatId)) {
    return NextResponse.json({ ok: false, error: "missing token or chatId" }, { status: 400 });
  }

  // забанен ли chat_id?
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

  // токен жив максимум 30 минут
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

  // chat_id уже привязан к другому юзеру?
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
         telegram_link_token = NULL,
         telegram_link_token_at = NULL
     WHERE id = $2::bigint`,
    [chatId, u.id],
  );

  return NextResponse.json({
    ok: true,
    firstName: u.first_name ?? null,
  });
}
