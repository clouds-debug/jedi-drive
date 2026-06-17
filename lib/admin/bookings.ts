import { query } from "@/lib/db";

export type AdminLessonRow = {
  id: string;
  user_id: string | null;
  user_login: string | null;
  user_first_name: string | null;
  user_last_name: string | null;
  user_phone: string | null;
  user_telegram_username: string | null;
  user_is_blocked: boolean;
  guest_name: string | null;
  guest_contact: string | null;
  kind: "theory" | "practice";
  format: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  scheduled_at: string;
  duration_min: number;
  location: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
};

const SELECT = `l.id::text, l.user_id::text,
  u.login AS user_login, u.first_name AS user_first_name, u.last_name AS user_last_name, u.phone AS user_phone,
  u.telegram_username AS user_telegram_username,
  COALESCE(u.is_blocked, false) AS user_is_blocked,
  l.guest_name, l.guest_contact,
  l.kind, l.format, l.instructor_id, l.instructor_name,
  l.scheduled_at, l.duration_min, l.location, l.status, l.notes, l.created_at`;

type ListOpts = {
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  kind?: "theory" | "practice";
  instructorRef?: string;
  limit?: number;
  offset?: number;
};

function buildWhere(opts: Pick<ListOpts, "status" | "kind" | "instructorRef">) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (opts.status) {
    params.push(opts.status);
    where.push(`l.status = $${params.length}`);
  }
  if (opts.kind) {
    params.push(opts.kind);
    where.push(`l.kind = $${params.length}`);
  }
  if (opts.instructorRef) {
    params.push(opts.instructorRef);
    where.push(`l.instructor_id = $${params.length}`);
  }
  return { where, params };
}

export async function listAdminBookings({
  status,
  kind,
  instructorRef,
  limit = 30,
  offset = 0,
}: ListOpts): Promise<AdminLessonRow[]> {
  const { where, params } = buildWhere({ status, kind, instructorRef });
  params.push(limit);
  params.push(offset);
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  // Для теории scheduled_at не несёт смысла (у заявок нет конкретной даты занятия),
  // сортируем по дате подачи. Для практики оставляем по scheduled_at.
  const orderSql =
    kind === "theory"
      ? "ORDER BY l.created_at DESC"
      : "ORDER BY CASE WHEN l.status = 'pending' THEN 0 ELSE 1 END, l.scheduled_at ASC";
  return query<AdminLessonRow>(
    `SELECT ${SELECT}
     FROM lessons l LEFT JOIN users u ON u.id = l.user_id
     ${whereSql}
     ${orderSql}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
}

export async function countAdminBookings({
  status,
  kind,
  instructorRef,
}: Pick<ListOpts, "status" | "kind" | "instructorRef">): Promise<number> {
  const { where, params } = buildWhere({ status, kind, instructorRef });
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM lessons l ${whereSql}`,
    params,
  );
  return Number(rows[0].c);
}

export async function findAdminLessonById(id: string): Promise<AdminLessonRow | null> {
  const rows = await query<AdminLessonRow>(
    `SELECT ${SELECT} FROM lessons l LEFT JOIN users u ON u.id = l.user_id
     WHERE l.id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function setLessonStatus(
  id: string,
  status: "confirmed" | "cancelled" | "completed",
): Promise<void> {
  await query(`UPDATE lessons SET status = $1 WHERE id = $2`, [status, id]);
}
