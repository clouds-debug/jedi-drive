import { query } from "@/lib/db";
import { getTgModeratorChatIds } from "@/lib/admin/moderators";
import { isBotLang, type BotLang } from "@/lib/bot-i18n";
import {
  attendanceCardButtons,
  deleteModMessage,
  formatAttendanceCardForMod,
  formatBookingCardForMod,
  modCardButtons,
  modChatIds,
  sendModMessage,
} from "@/lib/telegram";

async function effectiveModChats(): Promise<number[]> {
  let fromDb: number[] = [];
  try {
    fromDb = await getTgModeratorChatIds();
  } catch (e) {
    console.error("[tg-dispatch] failed to load moderators from DB", e);
  }
  if (fromDb.length > 0) return fromDb;
  return modChatIds();
}

async function getModLang(chatId: number): Promise<BotLang> {
  try {
    const rows = await query<{ lang: string | null }>(
      `SELECT lang FROM tg_moderators WHERE chat_id = $1 LIMIT 1`,
      [chatId],
    );
    const l = rows[0]?.lang;
    return isBotLang(l) ? l : "ru";
  } catch {
    return "ru";
  }
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

  for (const chatId of chats) {
    try {
      const lang = await getModLang(chatId);
      const text = formatBookingCardForMod(d, lang);
      const buttons = modCardButtons(d.lessonId, lang);
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

type AttendanceCardData = {
  lessonId: string;
  fullName: string;
  login: string | null;
  phone: string | null;
  telegramUsername: string | null;
  scheduledAt: Date;
  instructorName: string | null;
  format: string | null;
  response: "coming" | "not_coming";
};

export async function dispatchAttendanceCard(d: AttendanceCardData): Promise<void> {
  const chats = await effectiveModChats();
  if (chats.length === 0) return;
  for (const chatId of chats) {
    try {
      const lang = await getModLang(chatId);
      const text = formatAttendanceCardForMod(d, lang);
      const buttons = attendanceCardButtons(d.lessonId, d.response, lang);
      const res = await sendModMessage(chatId, text, buttons);
      if (res.ok && res.messageId) {
        await query(
          `INSERT INTO tg_mod_messages (lesson_id, chat_id, message_id) VALUES ($1::bigint, $2, $3)`,
          [d.lessonId, chatId, res.messageId],
        );
      }
    } catch (e) {
      console.error(`[tg-dispatch] attendance card to ${chatId} failed`, e);
    }
  }
}

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
