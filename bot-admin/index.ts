// Jedi Drive — Telegram bot for moderators (inline-buttons over booking cards).

import {
  botT,
  isBotLang,
  langKeyboard,
  persistentLangReplyMarkup,
  LANG_BTN_RU,
  LANG_BTN_GE,
  type BotLang,
} from "../lib/bot-i18n";

const TOKEN = process.env.TELEGRAM_ADMIN_BOT_TOKEN;
const INTERNAL = process.env.INTERNAL_API_TOKEN;
const BASE = process.env.INTERNAL_API_BASE || "http://localhost:3000";

if (!TOKEN) {
  console.error("TELEGRAM_ADMIN_BOT_TOKEN is not set");
  process.exit(1);
}
if (!INTERNAL) {
  console.error("INTERNAL_API_TOKEN is not set");
  process.exit(1);
}

const TG = `https://api.telegram.org/bot${TOKEN}`;

type Update = {
  update_id: number;
  message?: {
    message_id: number;
    chat: { id: number };
    from?: { id: number; first_name?: string; username?: string };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: { id: number; first_name?: string; username?: string };
    message?: {
      message_id: number;
      chat: { id: number };
      text?: string;
    };
    data?: string;
  };
};

async function tg(method: string, payload: Record<string, unknown>) {
  try {
    const r = await fetch(`${TG}/${method}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await r.json();
  } catch (e) {
    console.error(`tg.${method} failed`, e);
    return null;
  }
}

async function sendMessage(chatId: number, text: string, replyMarkup?: unknown) {
  return tg("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    reply_markup: replyMarkup,
  });
}

async function deleteMessage(chatId: number, messageId: number) {
  return tg("deleteMessage", { chat_id: chatId, message_id: messageId });
}

async function answerCallback(id: string, text?: string) {
  return tg("answerCallbackQuery", { callback_query_id: id, text: text ?? "" });
}

async function internalGet(path: string): Promise<any> {
  try {
    const r = await fetch(`${BASE}${path}`, {
      headers: { authorization: `Bearer ${INTERNAL}` },
    });
    return await r.json();
  } catch (e) {
    console.error(`internalGet ${path} failed`, e);
    return null;
  }
}

async function internalPost(path: string, body: unknown): Promise<any> {
  try {
    const r = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${INTERNAL}` },
      body: JSON.stringify(body),
    });
    return await r.json();
  } catch (e) {
    console.error(`internalPost ${path} failed`, e);
    return null;
  }
}

async function getLang(chatId: number): Promise<BotLang> {
  const r = await internalGet(`/api/internal/tg-lang?kind=mod&chatId=${chatId}`);
  return isBotLang(r?.lang) ? r.lang : "ru";
}

async function callDecision(lessonId: string, action: "confirm" | "reject", modName: string | null) {
  return internalPost(`/api/internal/mod-decision`, { lessonId, action, modName });
}

async function handleUpdate(u: Update) {
  if (u.callback_query) {
    const cq = u.callback_query;
    const data = cq.data ?? "";

    const langMatch = data.match(/^lang:(ru|ge)$/);
    if (langMatch && cq.message) {
      const newLang = langMatch[1] as BotLang;
      const chatId = cq.message.chat.id;
      const setRes = await internalPost(`/api/internal/tg-lang`, {
        kind: "mod",
        chatId,
        lang: newLang,
      });
      if (!setRes?.ok) {
        await answerCallback(cq.id, "Сначала добавь себя через /start");
        return;
      }
      await sendMessage(chatId, botT(newLang, `lang.set.${newLang}`));
      await answerCallback(cq.id);
      return;
    }

    const attMatch = data.match(/^att-(handled|cancel):(.+)$/);
    if (attMatch && cq.message) {
      const action = attMatch[1] === "cancel" ? "cancel" : "handled";
      const lessonId = attMatch[2];
      const lang = await getLang(cq.message.chat.id);
      const r = await internalPost(`/api/internal/attendance-action`, { lessonId, action });
      if (!r?.ok) {
        await answerCallback(cq.id, botT(lang, "mod.cb.error"));
        return;
      }
      await deleteMessage(cq.message.chat.id, cq.message.message_id);
      const tKey = action === "cancel" ? "att.cb.cancelled" : "att.cb.handled";
      await answerCallback(cq.id, botT(lang, tKey));
      return;
    }

    const decisionMatch = data.match(/^(confirm|reject):(.+)$/);
    if (!decisionMatch || !cq.message) {
      const lang = cq.message ? await getLang(cq.message.chat.id) : "ru";
      await answerCallback(cq.id, botT(lang, "mod.cb.unknown"));
      return;
    }
    const action = decisionMatch[1] as "confirm" | "reject";
    const lessonId = decisionMatch[2];
    const modName =
      cq.from.username ? `@${cq.from.username}` : cq.from.first_name ?? `id${cq.from.id}`;
    const lang = await getLang(cq.message.chat.id);

    const res = await callDecision(lessonId, action, modName);
    if (!res?.ok) {
      const key =
        res?.error === "already_closed"
          ? "mod.cb.alreadyClosed"
          : res?.error === "not_found"
            ? "mod.cb.notFound"
            : "mod.cb.error";
      await answerCallback(cq.id, botT(lang, key));
      return;
    }

    const verb = botT(lang, action === "confirm" ? "mod.cb.confirmed" : "mod.cb.rejected");
    await deleteMessage(cq.message.chat.id, cq.message.message_id);
    await answerCallback(cq.id, verb);
    return;
  }

  if (u.message?.text) {
    const text = u.message.text.trim();
    const chatId = u.message.chat.id;

    if (text === "/start") {
      const lang = await getLang(chatId);
      await sendMessage(chatId, botT(lang, "mod.start", { chatId }), persistentLangReplyMarkup());
      return;
    }

    if (text === LANG_BTN_RU || text === LANG_BTN_GE) {
      const newLang: BotLang = text === LANG_BTN_GE ? "ge" : "ru";
      const setRes = await internalPost(`/api/internal/tg-lang`, {
        kind: "mod",
        chatId,
        lang: newLang,
      });
      if (!setRes?.ok) {
        await sendMessage(chatId, "Сначала добавь себя через /start");
        return;
      }
      await sendMessage(chatId, botT(newLang, `lang.set.${newLang}`), persistentLangReplyMarkup());
      return;
    }

    if (text === "/lang") {
      const lang = await getLang(chatId);
      await sendMessage(chatId, botT(lang, "lang.choose"), {
        inline_keyboard: langKeyboard(),
      });
      return;
    }
  }
}

async function loop() {
  let offset = 0;
  console.log(`[jedi-bot-admin] long-polling started, base=${BASE}`);
  while (true) {
    try {
      const r = await fetch(
        `${TG}/getUpdates?timeout=30&offset=${offset}&allowed_updates=${encodeURIComponent(
          JSON.stringify(["message", "callback_query"]),
        )}`,
      );
      const data = (await r.json()) as { ok: boolean; result?: Update[] };
      if (!data.ok || !data.result) {
        await new Promise((res) => setTimeout(res, 3000));
        continue;
      }
      for (const u of data.result) {
        offset = u.update_id + 1;
        handleUpdate(u).catch((e) => console.error("handleUpdate", e));
      }
    } catch (e) {
      console.error("loop error", e);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

loop();
