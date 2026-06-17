// Высокоуровневые dispatch-функции для отправки в TG из бизнес-логики.
// Знают про БД (tg_mod_messages), используются из API-роутов.

import { query } from "@/lib/db";
import { getTgModeratorChatIds } from "@/lib/admin/moderators";
import {
  deleteModMessage,
  formatBookingCardForMod,
  modCardButtons,
  modChatIds,
  sendModMessage,
} from "@/lib/telegram";

async function effectiveModChats(): Promise<number[]> {
  const fromEnv = modChatIds();
  let fromDb: number[] = [];
  try {
    fromDb = await getTgModeratorChatIds();
  } catch (e) {
    console.error("[tg-dispatch] failed to load moderators from DB", e);
  }
  return Array.from(new Set([...fromEnv, ...fromDb]));
}

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
  const chats = await effectiveModChats();
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
// удаляем карточки во всех модерских чатах, чтобы не копилась переписка.
export async function dispatchModCardClose(
  lessonId: string,
  _outcome: "confirmed" | "cancelled",
  _by: string,
): Promise<void> {
  const rows = await query<{ chat_id: string; message_id: string }>(
    `SELECT chat_id::text, message_id::text FROM tg_mod_messages WHERE lesson_id = $1::bigint`,
    [lessonId],
  );
  if (rows.length === 0) return;
  for (const r of rows) {
    try {
      await deleteModMessage(Number(r.chat_id), Number(r.message_id));
    } catch (e) {
      console.error(`[tg-dispatch] close delete failed for ${r.chat_id}/${r.message_id}`, e);
    }
  }
  await query(`DELETE FROM tg_mod_messages WHERE lesson_id = $1::bigint`, [lessonId]);
}
