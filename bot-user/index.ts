// Jedi Drive — Telegram bot for students.
// Запуск: pm2 start "tsx bot-user/index.ts" --name jedi-bot-user
// Требует env: TELEGRAM_USER_BOT_TOKEN, INTERNAL_API_TOKEN, INTERNAL_API_BASE

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
    disable_web_page_preview: true,
  });
}

async function callStatus(chatId: number): Promise<{ linked: boolean; firstName?: string | null }> {
  try {
    const r = await fetch(`${BASE}/api/internal/tg-status`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${INTERNAL}`,
      },
      body: JSON.stringify({ chatId }),
    });
    return (await r.json()) as { linked: boolean; firstName?: string | null };
  } catch (e) {
    console.error("callStatus failed", e);
    return { linked: false };
  }
}

async function callLink(token: string, chatId: number, username: string | null) {
  try {
    const r = await fetch(`${BASE}/api/internal/tg-link`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${INTERNAL}`,
      },
      body: JSON.stringify({ token, chatId, username }),
    });
    return (await r.json()) as {
      ok: boolean;
      firstName?: string | null;
      message?: string;
      error?: string;
    };
  } catch (e) {
    console.error("callLink failed", e);
    return { ok: false, error: "network" };
  }
}

async function handleUpdate(u: Update) {
  const msg = u.message;
  if (!msg || !msg.text) return;
  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (text === "/start") {
    const status = await callStatus(chatId);
    if (status.linked) {
      const hi = status.firstName ? `, ${status.firstName}` : "";
      await sendMessage(
        chatId,
        `Привет${hi}! 👋\n\nЭтот бот отправляет уведомления о твоих заявках в <b>Jedi Drive</b> — подтверждения, отказы, переносы.\n\nВсё остальное — в личном кабинете на сайте.`,
      );
    } else {
      await sendMessage(
        chatId,
        "Привет! Я бот <b>Jedi Drive</b>. Чтобы привязать меня к своему аккаунту, открой кабинет на сайте и нажми «Привязать Telegram».",
      );
    }
    return;
  }
  const m = text.match(/^\/start\s+(\S+)$/);
  if (m) {
    const token = m[1];
    const username = msg.from?.username ?? null;
    const r = await callLink(token, chatId, username);
    if (r.ok) {
      const hi = r.firstName ? `, ${r.firstName}` : "";
      await sendMessage(
        chatId,
        `Готово${hi}! ✅\n\nТеперь сюда будут приходить уведомления о твоих заявках.`,
      );
    } else {
      await sendMessage(
        chatId,
        r.message ?? "Не получилось привязать. Запроси новый токен в кабинете.",
      );
    }
    return;
  }
  if (text === "/help") {
    await sendMessage(
      chatId,
      "Я отправляю уведомления о твоих заявках на занятия. Привязка — через кабинет на сайте.",
    );
    return;
  }
}

async function loop() {
  let offset = 0;
  console.log(`[jedi-bot-user] long-polling started, base=${BASE}`);
  while (true) {
    try {
      const r = await fetch(`${TG}/getUpdates?timeout=30&offset=${offset}`);
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
