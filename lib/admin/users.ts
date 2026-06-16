import { query } from "@/lib/db";
import type { UserRole } from "@/lib/auth/roles";

export type AdminUserRow = {
  id: string;
  login: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  telegram_username: string | null;
  role: UserRole;
  instructor_ref: string | null;
  is_blocked: boolean;
  last_ip: string | null;
  created_at: string;
};

const SELECT = `id::text, login, first_name, last_name, phone, telegram_username,
  role, instructor_ref, is_blocked, last_ip::text AS last_ip, created_at`;

type ListOpts = {
  role: UserRole;
  search?: string;
  limit?: number;
  offset?: number;
};

export async function listAdminUsers({
  role,
  search,
  limit = 30,
  offset = 0,
}: ListOpts): Promise<AdminUserRow[]> {
  const params: unknown[] = [role];
  let where = `role = $1`;
  if (search && search.trim()) {
    params.push(`%${search.trim()}%`);
    where += ` AND login ILIKE $${params.length}`;
  }
  params.push(limit);
  params.push(offset);
  return query<AdminUserRow>(
    `SELECT ${SELECT} FROM users WHERE ${where}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
}

export async function countAdminUsers({
  role,
  search,
}: Pick<ListOpts, "role" | "search">): Promise<number> {
  const params: unknown[] = [role];
  let where = `role = $1`;
  if (search && search.trim()) {
    params.push(`%${search.trim()}%`);
    where += ` AND login ILIKE $${params.length}`;
  }
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM users WHERE ${where}`,
    params,
  );
  return Number(rows[0].c);
}

export async function countByRole(): Promise<Record<UserRole, number>> {
  const rows = await query<{ role: string; c: string }>(
    `SELECT role, count(*)::text AS c FROM users GROUP BY role`,
  );
  const out: Record<UserRole, number> = {
    student: 0,
    moderator: 0,
    instructor: 0,
    admin: 0,
  };
  for (const r of rows) {
    if (r.role in out) out[r.role as UserRole] = Number(r.c);
  }
  return out;
}

export type UserLessonStats = {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
};

export async function getUserLessonStats(userId: string): Promise<UserLessonStats> {
  const rows = await query<{ status: string; c: string }>(
    `SELECT status, count(*)::text AS c FROM lessons WHERE user_id = $1 GROUP BY status`,
    [userId],
  );
  const out: UserLessonStats = { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };
  for (const r of rows) {
    if (r.status in out) out[r.status as keyof UserLessonStats] = Number(r.c);
  }
  return out;
}
