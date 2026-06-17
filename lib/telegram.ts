// Telegram bot integration — server-side helpers.
// Используется и Next.js, и оба bot-процесса.

import { botT, type BotLang } from "@/lib/bot-i18n";

const TG_API = "https://api.telegram.org";

function userToken(): string | null {
  return process.env.TELEGRAM_USER_BOT_TOKEN || null;
}
function adminToken(): string | null {
  return process.env.TELEGRAM_ADMIN_BOT_TOKEN || null;
}

export function modChatIds(): number[] {
  const raw = process.env.TELEGRAM_MOD_CHAT_IDS || "";
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => Number.isFinite(n));
}

type SendResult = { ok: true; messageId: number } | { ok: false; error: string };

async function callBot(
  token: string,
  method: string,
  payload: Record<string, unknown>,
): Promise<SendResult> {
  try {
    const res = await fetch(`${TG_API}/bot${token}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await res.json()) as { ok: boolean; result?: { message_id: number }; description?: string };
    if (!data.ok) return { ok: false, error: data.description ?? "tg api error" };
    return { ok: true, messageId: data.result?.message_id ?? 0 };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "fetch failed" };
  }
}

export async function sendUserMessage(chatId: number, text: string): Promise<SendResult> {
  const token = userToken();
  if (!token) return { ok: false, error: "no user bot token" };
  return callBot(token, "sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

export type ModInlineButton =
  | { text: string; callback_data: string }
  | { text: string; url: string };

export async function sendModMessage(
  chatId: number,
  text: string,
  buttons?: ModInlineButton[][],
): Promise<SendResult> {
  const token = adminToken();
  if (!token) return { ok: false, error: "no admin bot token" };
  return callBot(token, "sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: buttons ? { inline_keyboard: buttons } : undefined,
  });
}

export async function editModMessage(
  chatId: number,
  messageId: number,
  text: string,
): Promise<SendResult> {
  const token = adminToken();
  if (!token) return { ok: false, error: "no admin bot token" };
  return callBot(token, "editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    reply_markup: { inline_keyboard: [] },
  });
}

export async function deleteModMessage(
  chatId: number,
  messageId: number,
): Promise<SendResult> {
  const token = adminToken();
  if (!token) return { ok: false, error: "no admin bot token" };
  return callBot(token, "deleteMessage", {
    chat_id: chatId,
    message_id: messageId,
  });
}

export async function answerCallback(
  token: string,
  callbackQueryId: string,
  text?: string,
): Promise<void> {
  try {
    await fetch(`${TG_API}/bot${token}/answerCallbackQuery`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text: text ?? "" }),
    });
  } catch {}
}

// HTML-escape для безопасной подстановки имён/телефонов в сообщения
export function esc(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Карточка заявки на практику для модераторов
export function formatBookingCardForMod(b: {
  fullName: string;
  login: string | null;
  phone: string | null;
  telegramUsername: string | null;
  scheduledAt: Date;
  instructorName: string | null;
  format: string | null;
  notes: string | null;
}, lang: BotLang = "ru"): string {
  const intlLocale = lang === "ge" ? "ka-GE" : "ru-RU";
  const date = b.scheduledAt.toLocaleString(intlLocale, {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tbilisi",
  });
  const fmtLabel = b.format === "pad" ? botT(lang, "card.format.pad")
    : b.format === "city" ? botT(lang, "card.format.city")
      : b.format === "pad+city" ? botT(lang, "card.format.padCity")
        : (b.format ?? "—");
  const contactBits: string[] = [];
  if (b.phone) contactBits.push(esc(b.phone));
  if (b.telegramUsername) contactBits.push(`<a href="https://t.me/${esc(b.telegramUsername)}">tg @${esc(b.telegramUsername)}</a>`);
  const contact = contactBits.length ? ` · ${contactBits.join(" · ")}` : "";
  const lines = [
    botT(lang, "card.title"),
    ``,
    `👤 ${esc(b.fullName)}` + (b.login ? ` (@${esc(b.login)})` : "") + contact,
    `📅 ${esc(date)}`,
    `🚗 ${esc(b.instructorName ?? "—")} · ${esc(fmtLabel)}`,
  ];
  if (b.notes) lines.push(`💬 ${esc(b.notes)}`);
  return lines.join("\n");
}

export function modCardButtons(lessonId: string, lang: BotLang = "ru"): ModInlineButton[][] {
  const base = (process.env.PUBLIC_BASE_URL || "").replace(/\/$/, "");
  const rows: ModInlineButton[][] = [
    [
      { text: botT(lang, "card.btn.confirm"), callback_data: `confirm:${lessonId}` },
      { text: botT(lang, "card.btn.reject"), callback_data: `reject:${lessonId}` },
    ],
  ];
  if (base) {
    rows.push([
      { text: botT(lang, "card.btn.admin"), url: `${base}/admin/bookings?status=pending#lesson-${lessonId}` },
    ]);
  }
  return rows;
}
