// Jedi Drive — Telegram bot for moderators (inline-buttons over booking cards).
// Запуск: pm2 start "tsx bot-admin/index.ts" --name jedi-bot-admin
// Требует env: TELEGRAM_ADMIN_BOT_TOKEN, INTERNAL_API_TOKEN, INTERNAL_API_BASE

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

async function sendMessage(chatId: number, text: string) {
  return tg("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
  });
}

async function editMessage(chatId: number, messageId: number, text: string) {
  return tg("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    reply_markup: { inline_keyboard: [] },
  });
}

async function answerCallback(id: string, text?: string) {
  return tg("answerCallbackQuery", { callback_query_id: id, text: text ?? "" });
}

async function callDecision(lessonId: string, action: "confirm" | "reject", modName: string | null) {
  try {
    const r = await fetch(`${BASE}/api/internal/mod-decision`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${INTERNAL}`,
      },
      body: JSON.stringify({ lessonId, action, modName }),
    });
    return (await r.json()) as { ok: boolean; error?: string; newStatus?: string };
  } catch (e) {
    console.error("callDecision failed", e);
    return { ok: false, error: "network" };
  }
}

async function handleUpdate(u: Update) {
  if (u.message?.text === "/start") {
    const chatId = u.message.chat.id;
    await sendMessage(
      chatId,
      [
        "Привет! Это <b>модераторский бот Jedi Drive</b>.",
        "",
        `Твой chat_id: <code>${chatId}</code>`,
        "Передай его админу — он добавит тебя в рассылку заявок.",
      ].join("\n"),
    );
    return;
  }

  if (u.callback_query) {
    const cq = u.callback_query;
    const data = cq.data ?? "";
    const m = data.match(/^(confirm|reject):(.+)$/);
    if (!m || !cq.message) {
      await answerCallback(cq.id, "Неизвестное действие");
      return;
    }
    const action = m[1] as "confirm" | "reject";
    const lessonId = m[2];
    const modName =
      cq.from.username ? `@${cq.from.username}` : cq.from.first_name ?? `id${cq.from.id}`;

    const res = await callDecision(lessonId, action, modName);
    if (!res.ok) {
      const human =
        res.error === "already_closed"
          ? "Заявка уже закрыта другим модератором."
          : res.error === "not_found"
            ? "Заявка не найдена."
            : "Ошибка. Попробуй ещё раз.";
      await answerCallback(cq.id, human);
      return;
    }

    const verb = action === "confirm" ? "✅ Подтверждено" : "❌ Отклонено";
    const ts = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tbilisi",
    });
    const newText = `${cq.message.text ?? ""}\n\n— ${verb} · ${modName} · ${ts}`;
    await editMessage(cq.message.chat.id, cq.message.message_id, newText);
    await answerCallback(cq.id, verb);
    return;
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
