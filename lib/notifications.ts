import { query } from "@/lib/db";

export type NotificationRow = {
  id: string;
  user_id: string;
  title: string;
  body: string | null;
  kind: string;
  read_at: string | null;
  created_at: string;
};

export async function listNotifications(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<NotificationRow[]> {
  return query<NotificationRow>(
    `SELECT id::text, user_id::text, title, body, kind, read_at, created_at
     FROM notifications WHERE user_id = $1
     ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );
}

export async function countTotal(userId: string): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM notifications WHERE user_id = $1`,
    [userId],
  );
  return Number(rows[0].c);
}

export async function countUnread(userId: string): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM notifications WHERE user_id = $1 AND read_at IS NULL`,
    [userId],
  );
  return Number(rows[0].c);
}

export async function markRead(
  userId: string,
  ids: string[],
): Promise<void> {
  if (ids.length === 0) return;
  await query(
    `UPDATE notifications SET read_at = now()
     WHERE user_id = $1 AND id = ANY($2::bigint[]) AND read_at IS NULL`,
    [userId, ids],
  );
}

export async function markAllRead(userId: string): Promise<void> {
  await query(
    `UPDATE notifications SET read_at = now()
     WHERE user_id = $1 AND read_at IS NULL`,
    [userId],
  );
}

export async function createNotification(
  userId: string,
  title: string,
  body: string | null,
  kind = "system",
): Promise<void> {
  await query(
    `INSERT INTO notifications (user_id, title, body, kind) VALUES ($1, $2, $3, $4)`,
    [userId, title, body, kind],
  );
}
