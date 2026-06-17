import { query } from "@/lib/db";

export type TgModerator = {
  chat_id: string;
  name: string;
  added_at: string;
  added_by: string | null;
};

export async function listTgModerators(): Promise<TgModerator[]> {
  return query<TgModerator>(
    `SELECT chat_id::text, name, added_at, added_by
     FROM tg_moderators
     ORDER BY added_at DESC`,
  );
}

export async function addTgModerator(
  chatId: number,
  name: string,
  by: string,
): Promise<void> {
  await query(
    `INSERT INTO tg_moderators (chat_id, name, added_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (chat_id) DO UPDATE SET name = EXCLUDED.name`,
    [chatId, name, by],
  );
}

export async function removeTgModerator(chatId: number): Promise<void> {
  await query(`DELETE FROM tg_moderators WHERE chat_id = $1`, [chatId]);
}

export async function getTgModeratorChatIds(): Promise<number[]> {
  const rows = await query<{ chat_id: string }>(
    `SELECT chat_id::text FROM tg_moderators`,
  );
  return rows.map((r) => Number(r.chat_id)).filter((n) => Number.isFinite(n));
}
