import { query } from "@/lib/db";

/** Проверяет забанен ли IP. */
export async function isIpBlocked(ip: string | null): Promise<boolean> {
  if (!ip || ip === "unknown") return false;
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM blocked_ips WHERE ip = $1::inet`,
    [ip],
  );
  return Number(rows[0].c) > 0;
}

/** Обновляет last_ip юзера (best-effort, без ошибок). */
export async function touchUserIp(userId: string, ip: string | null): Promise<void> {
  if (!ip || ip === "unknown") return;
  try {
    await query(
      `UPDATE users SET last_ip = $1::inet WHERE id = $2`,
      [ip, userId],
    );
  } catch {
    /* ignore */
  }
}

/** Возвращает is_blocked + last_ip для юзера. */
export async function getUserBlockState(
  userId: string,
): Promise<{ isBlocked: boolean; lastIp: string | null } | null> {
  const rows = await query<{ is_blocked: boolean; last_ip: string | null }>(
    `SELECT is_blocked, last_ip::text AS last_ip FROM users WHERE id = $1`,
    [userId],
  );
  if (rows.length === 0) return null;
  return { isBlocked: rows[0].is_blocked, lastIp: rows[0].last_ip };
}

/** Блокирует пользователя и опционально его last_ip. */
export async function blockUser(
  userId: string,
  blockedBy: string,
  reason: string,
): Promise<{ ipAdded: string | null }> {
  await query(`UPDATE users SET is_blocked = true WHERE id = $1`, [userId]);
  // Сразу убиваем активные сессии — он не сможет продолжить тыкать.
  await query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);

  const state = await getUserBlockState(userId);
  if (!state?.lastIp) return { ipAdded: null };

  await query(
    `INSERT INTO blocked_ips (ip, reason, blocked_by, user_id)
     VALUES ($1::inet, $2, $3, $4)
     ON CONFLICT (ip) DO UPDATE SET reason = EXCLUDED.reason,
                                    blocked_by = EXCLUDED.blocked_by,
                                    user_id    = EXCLUDED.user_id`,
    [state.lastIp, reason, blockedBy, userId],
  );
  return { ipAdded: state.lastIp };
}

/** Разблокирует юзера и (если есть) его IP. */
export async function unblockUser(userId: string): Promise<void> {
  await query(`UPDATE users SET is_blocked = false WHERE id = $1`, [userId]);
  await query(
    `DELETE FROM blocked_ips WHERE user_id = $1`,
    [userId],
  );
}
