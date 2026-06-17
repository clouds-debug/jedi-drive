// Jedi Drive — Telegram bot for students.
// Запуск: pm2 start "npx tsx --env-file=.env.local bot-user/index.ts" --name jedi-bot-user

import {
  botT,
  isBotLang,
  langKeyboard,
  persistentLangReplyMarkup,
  LANG_BTN_RU,
  LANG_BTN_GE,
  type BotLang,
} from "../lib/bot-i18n";

const TOKEN = process.env.TELEGRAM_USER_BOT_TOKEN;
const INTERNAL = process.env.INTERNAL_API_TOKEN;
const BASE = process.env.INTERNAL_API_BASE || "http://localhost:3000";

if (!TOKEN) {
  console.error("TELEGRAM_USER_BOT_TOKEN is not set");
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
    from?: { id: number; username?: string; first_name?: string };
    text?: string;
  };
  callback_query?: {
    id: string;
    from: { id: number };
    message?: { message_id: number; chat: { id: number } };
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
    disable_web_page_preview: true,
    reply_markup: replyMarkup,
  });
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
  const r = await internalGet(`/api/internal/tg-lang?kind=user&chatId=${chatId}`);
  return isBotLang(r?.lang) ? r.lang : "ru";
}

async function getStatus(chatId: number): Promise<{ linked: boolean; firstName?: string | null }> {
  const r = await internalPost(`/api/internal/tg-status`, { chatId });
  return r ?? { linked: false };
}

async function callLink(token: string, chatId: number, username: string | null) {
  return internalPost(`/api/internal/tg-link`, { token, chatId, username });
}

async function handleUpdate(u: Update) {
  if (u.callback_query) {
    const cq = u.callback_query;
    const data = cq.data ?? "";

    // язык
    const langMatch = data.match(/^lang:(ru|ge)$/);
    if (langMatch && cq.message) {
      const newLang = langMatch[1] as BotLang;
      const chatId = cq.message.chat.id;
      const setRes = await internalPost(`/api/internal/tg-lang`, {
        kind: "user",
        chatId,
        lang: newLang,
      });
      if (!setRes?.ok) {
        await answerCallback(cq.id, botT(newLang, "user.start.unlinked").replace(/<[^>]+>/g, ""));
        return;
      }
      await sendMessage(chatId, botT(newLang, `lang.set.${newLang}`));
      await answerCallback(cq.id);
      return;
    }

    // подтверждение посещения
    const attendMatch = data.match(/^attend:(yes|no):(.+)$/);
    if (attendMatch && cq.message) {
      const response = attendMatch[1] === "yes" ? "coming" : "not_coming";
      const lessonId = attendMatch[2];
      const chatId = cq.message.chat.id;
      const lang = await getLang(chatId);
      const r = await internalPost(`/api/internal/attendance`, {
        lessonId,
        response,
        chatId,
      });
      if (r?.ok) {
        // убираем кнопки и пишем ack
        await tg("editMessageReplyMarkup", {
          chat_id: chatId,
          message_id: cq.message.message_id,
          reply_markup: { inline_keyboard: [] },
        });
        const ackKey = response === "coming" ? "remind.ack.coming" : "remind.ack.notComing";
        await sendMessage(chatId, botT(lang, ackKey));
      }
      await answerCallback(cq.id, botT(lang, `remind.btn.${response === "coming" ? "coming" : "notComing"}`));
      return;
    }

    await answerCallback(cq.id);
    return;
  }

  const msg = u.message;
  if (!msg || !msg.text) return;
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (text === "/start") {
    const status = await getStatus(chatId);
    if (status.linked) {
      const lang = await getLang(chatId);
      const hi = status.firstName ? `, ${status.firstName}` : "";
      await sendMessage(chatId, botT(lang, "user.start.linked", { hi }), persistentLangReplyMarkup());
    } else {
      await sendMessage(chatId, botT("ru", "user.start.unlinked"));
    }
    return;
  }

  // постоянные кнопки внизу чата
  if (text === LANG_BTN_RU || text === LANG_BTN_GE) {
    const newLang: BotLang = text === LANG_BTN_GE ? "ge" : "ru";
    const setRes = await internalPost(`/api/internal/tg-lang`, {
      kind: "user",
      chatId,
      lang: newLang,
    });
    if (!setRes?.ok) {
      await sendMessage(chatId, botT(newLang, "user.start.unlinked"));
      return;
    }
    await sendMessage(chatId, botT(newLang, `lang.set.${newLang}`), persistentLangReplyMarkup());
    return;
  }

  const m = text.match(/^\/start\s+(\S+)$/);
  if (m) {
    const token = m[1];
    const username = msg.from?.username ?? null;
    const r = await callLink(token, chatId, username);
    const lang = await getLang(chatId);
    if (r?.ok) {
      const hi = r.firstName ? `, ${r.firstName}` : "";
      await sendMessage(chatId, botT(lang, "user.bound.ok", { hi }), persistentLangReplyMarkup());
    } else {
      await sendMessage(chatId, r?.message ?? botT(lang, "user.bound.fail"));
    }
    return;
  }

  if (text === "/lang") {
    const lang = await getLang(chatId);
    await sendMessage(chatId, botT(lang, "lang.choose"), {
      inline_keyboard: langKeyboard(),
    });
    return;
  }

  if (text === "/help") {
    const lang = await getLang(chatId);
    await sendMessage(chatId, botT(lang, "user.help"));
    return;
  }
}

// Тик напоминаний: раз в 10 минут дёргаем endpoint, который сам решит кого уведомить.
const REMINDER_TICK_MS = 10 * 60 * 1000;
setInterval(() => {
  internalPost("/api/internal/tick-reminders", {})
    .then((r) => {
      if (r?.sent) console.log(`[reminders] sent=${r.sent} skipped=${r.skipped}`);
    })
    .catch((e) => console.error("[reminders] tick failed", e));
}, REMINDER_TICK_MS);

async function loop() {
  let offset = 0;
  console.log(`[jedi-bot-user] long-polling started, base=${BASE}`);
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
