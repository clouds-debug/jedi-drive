import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { isBotLang } from "@/lib/bot-i18n";
import { checkInternalAuth } from "@/lib/internal-auth";

export const dynamic = "force-dynamic";


// GET /api/internal/tg-lang?kind=user|mod&chatId=12345
export async function GET(req: Request) {
  if (!checkInternalAuth(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const kind = url.searchParams.get("kind");
  const chatId = Number(url.searchParams.get("chatId"));
  if ((kind !== "user" && kind !== "mod") || !Number.isFinite(chatId)) {
    return NextResponse.json({ ok: false, error: "bad params" }, { status: 400 });
  }
  if (kind === "user") {
    const rows = await query<{ lang: string | null }>(
      `SELECT telegram_lang AS lang FROM users WHERE telegram_chat_id = $1 LIMIT 1`,
      [chatId],
    );
    return NextResponse.json({ ok: true, lang: rows[0]?.lang ?? "ru" });
  }
  const rows = await query<{ lang: string | null }>(
    `SELECT lang FROM tg_moderators WHERE chat_id = $1 LIMIT 1`,
    [chatId],
  );
  return NextResponse.json({ ok: true, lang: rows[0]?.lang ?? "ru" });
}

// POST /api/internal/tg-lang
// Body: { kind: 'user'|'mod', chatId, lang }
export async function POST(req: Request) {
  if (!checkInternalAuth(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  let body: { kind?: string; chatId?: number; lang?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, error: "bad json" }, { status: 400 });
  }
  const kind = body.kind;
  const chatId = Number(body.chatId);
  const lang = body.lang;
  if ((kind !== "user" && kind !== "mod") || !Number.isFinite(chatId) || !isBotLang(lang)) {
    return NextResponse.json({ ok: false, error: "bad params" }, { status: 400 });
  }
  if (kind === "user") {
    const r = await query<{ id: string }>(
      `UPDATE users SET telegram_lang = $1 WHERE telegram_chat_id = $2 RETURNING id::text`,
      [lang, chatId],
    );
    if (r.length === 0) {
      return NextResponse.json({ ok: false, error: "not_linked" }, { status: 404 });
    }
  } else {
    const r = await query<{ chat_id: string }>(
      `UPDATE tg_moderators SET lang = $1 WHERE chat_id = $2 RETURNING chat_id::text`,
      [lang, chatId],
    );
    if (r.length === 0) {
      return NextResponse.json({ ok: false, error: "not_mod" }, { status: 404 });
    }
  }
  return NextResponse.json({ ok: true });
}
