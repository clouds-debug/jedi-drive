import { query } from "@/lib/db";

export type UserGrowth = {
  day: number;
  week: number;
  month: number;
  total: number;
};

export async function getUserGrowth(): Promise<UserGrowth> {
  const rows = await query<{
    day: string;
    week: string;
    month: string;
    total: string;
  }>(
    `SELECT
       count(*) FILTER (WHERE created_at >= now() - interval '1 day')::text  AS day,
       count(*) FILTER (WHERE created_at >= now() - interval '7 days')::text AS week,
       count(*) FILTER (WHERE created_at >= now() - interval '30 days')::text AS month,
       count(*)::text AS total
     FROM users WHERE role = 'student'`,
  );
  const r = rows[0];
  return {
    day: Number(r.day),
    week: Number(r.week),
    month: Number(r.month),
    total: Number(r.total),
  };
}

export type StatusBreakdown = {
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  total: number;
};

export async function getStatusBreakdown(): Promise<StatusBreakdown> {
  const rows = await query<{ status: string; c: string }>(
    `SELECT status, count(*)::text AS c FROM lessons GROUP BY status`,
  );
  const out: StatusBreakdown = {
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    total: 0,
  };
  for (const r of rows) {
    const k = r.status as keyof StatusBreakdown;
    if (k in out) out[k] = Number(r.c);
  }
  out.total = out.pending + out.confirmed + out.completed + out.cancelled;
  return out;
}

export type KindBreakdown = { theory: number; practice: number };

export async function getKindBreakdown(): Promise<KindBreakdown> {
  const rows = await query<{ kind: string; c: string }>(
    `SELECT kind, count(*)::text AS c FROM lessons GROUP BY kind`,
  );
  const out: KindBreakdown = { theory: 0, practice: 0 };
  for (const r of rows) {
    if (r.kind === "theory") out.theory = Number(r.c);
    if (r.kind === "practice") out.practice = Number(r.c);
  }
  return out;
}

export type MonthlyRow = {
  month: string; // ISO date "2026-06-01"
  bookings: number;
  completed: number;
  cancelled: number;
};

export async function getMonthly(opts: {
  months?: number;
  year?: number;
}): Promise<MonthlyRow[]> {
  const months = opts.months ?? 6;
  if (opts.year) {
    const rows = await query<{
      month: string;
      bookings: string;
      completed: string;
      cancelled: string;
    }>(
      `WITH series AS (
         SELECT generate_series(
           make_date($1::int, 1, 1),
           make_date($1::int, 12, 1),
           interval '1 month'
         )::date AS m
       )
       SELECT
         to_char(s.m, 'YYYY-MM-DD') AS month,
         count(l.id) FILTER (WHERE l.status IN ('pending','confirmed','completed','cancelled'))::text AS bookings,
         count(l.id) FILTER (WHERE l.status = 'completed')::text AS completed,
         count(l.id) FILTER (WHERE l.status = 'cancelled')::text AS cancelled
       FROM series s
       LEFT JOIN lessons l ON date_trunc('month', l.created_at) = s.m
       GROUP BY s.m ORDER BY s.m`,
      [opts.year],
    );
    return rows.map((r) => ({
      month: r.month,
      bookings: Number(r.bookings),
      completed: Number(r.completed),
      cancelled: Number(r.cancelled),
    }));
  }

  const rows = await query<{
    month: string;
    bookings: string;
    completed: string;
    cancelled: string;
  }>(
    `WITH series AS (
       SELECT generate_series(
         date_trunc('month', now()) - ($1::int - 1) * interval '1 month',
         date_trunc('month', now()),
         interval '1 month'
       )::date AS m
     )
     SELECT
       to_char(s.m, 'YYYY-MM-DD') AS month,
       count(l.id) FILTER (WHERE l.status IN ('pending','confirmed','completed','cancelled'))::text AS bookings,
       count(l.id) FILTER (WHERE l.status = 'completed')::text AS completed,
       count(l.id) FILTER (WHERE l.status = 'cancelled')::text AS cancelled
     FROM series s
     LEFT JOIN lessons l ON date_trunc('month', l.created_at) = s.m
     GROUP BY s.m ORDER BY s.m`,
    [months],
  );
  return rows.map((r) => ({
    month: r.month,
    bookings: Number(r.bookings),
    completed: Number(r.completed),
    cancelled: Number(r.cancelled),
  }));
}
