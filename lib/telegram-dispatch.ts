// Высокоуровневые dispatch-функции для отправки в TG из бизнес-логики.
// Знают про БД (tg_mod_messages), используются из API-роутов.

import { query } from "@/lib/db";
import {
  editModMessage,
  formatBookingCardForMod,
  modCardButtons,
  modChatIds,
  sendModMessage,
} from "@/lib/telegram";

type ModCardData = {
  lessonId: string;
  fullName: string;
  login: string | null;
  phone: string | null;
  telegramUsername: string | null;
  scheduledAt: Date;
  instructorName: string | null;
  format: string | null;
  notes: string | null;
};

export async function dispatchModBookingCard(d: ModCardData): Promise<void> {
  const chats = modChatIds();
  if (chats.length === 0) return;
  const text = formatBookingCardForMod(d);
  const buttons = modCardButtons(d.lessonId);

  for (const chatId of chats) {
    try {
      const res = await sendModMessage(chatId, text, buttons);
      if (res.ok && res.messageId) {
        await query(
          `INSERT INTO tg_mod_messages (lesson_id, chat_id, message_id) VALUES ($1::bigint, $2, $3)`,
          [d.lessonId, chatId, res.messageId],
        );
      }
    } catch (e) {
      console.error(`[tg-dispatch] mod card to ${chatId} failed`, e);
    }
  }
}

// Когда заявка закрыта вне TG (через веб-админку или инструктором) —
// дописываем в карточки модераторов финальный статус и снимаем кнопки.
export async function dispatchModCardClose(
  lessonId: string,
  outcome: "confirmed" | "cancelled",
  by: string,
): Promise<void> {
  const rows = await query<{ chat_id: string; message_id: string }>(
    `SELECT chat_id::text, message_id::text FROM tg_mod_messages WHERE lesson_id = $1::bigint`,
    [lessonId],
  );
  if (rows.length === 0) return;
  const verb = outcome === "confirmed" ? "✅ Подтверждено" : "❌ Отклонено";
  const ts = new Date().toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tbilisi",
  });
  const suffix = `\n\n— ${verb} · ${by} · ${ts}`;
  for (const r of rows) {
    // Текст карточки не сохраняем — просто пишем короткое финальное состояние.
    // editMessageText без знания старого текста перезапишет всё, поэтому используем
    // editMessageReplyMarkup чтобы снять кнопки + sendMessage с финалом не нужен.
    try {
      await editModMessage(Number(r.chat_id), Number(r.message_id), `Заявка закрыта.${suffix}`);
    } catch (e) {
      console.error(`[tg-dispatch] close edit failed for ${r.chat_id}/${r.message_id}`, e);
    }
  }
  await query(`DELETE FROM tg_mod_messages WHERE lesson_id = $1::bigint`, [lessonId]);
}
