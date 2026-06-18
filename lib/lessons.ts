import { query } from "@/lib/db";
import {
  tbilisiDayBoundsUtc,
  tbilisiSlotStringToUtcDate,
} from "@/lib/tz";

export type LessonKind = "theory" | "practice";
export type LessonStatus = "pending" | "confirmed" | "completed" | "cancelled";

export type LessonRow = {
  id: string;
  user_id: string;
  kind: LessonKind;
  format: string | null;
  instructor_id: string | null;
  instructor_name: string | null;
  scheduled_at: string;
  duration_min: number;
  location: string | null;
  status: LessonStatus;
  notes: string | null;
  created_at: string;
};

export async function listUpcoming(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<LessonRow[]> {
  return query<LessonRow>(
    `SELECT id::text, user_id::text, kind, format, instructor_id, instructor_name,
            scheduled_at, duration_min, location, status, notes, created_at
     FROM lessons
     WHERE user_id = $1
       AND status IN ('pending', 'confirmed')
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );
}

export async function countUpcoming(userId: string): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM lessons
     WHERE user_id = $1
       AND status IN ('pending','confirmed')`,
    [userId],
  );
  return Number(rows[0].c);
}

export async function markStaleConfirmedCompleted(): Promise<void> {
  await query(
    `UPDATE lessons SET status = 'completed'
     WHERE status = 'confirmed'
       AND scheduled_at + (duration_min || ' minutes')::interval + interval '1 hour' < now()`,
  );
}

export async function findLessonById(id: string): Promise<LessonRow | null> {
  const rows = await query<LessonRow>(
    `SELECT id::text, user_id::text, kind, format, instructor_id, instructor_name,
            scheduled_at, duration_min, location, status, notes, created_at
     FROM lessons WHERE id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}


export const DAY_START_MIN = 8 * 60 + 45;
export const DAY_LAST_START_MIN = 19 * 60 + 15;

export const PRACTICE_DURATION_MIN = 45;

function minToHHMM(m: number): string {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
}


export function getStandardSlotTimes(stepMin = PRACTICE_DURATION_MIN): string[] {
  const out: string[] = [];
  for (let m = DAY_START_MIN; m <= DAY_LAST_START_MIN; m += stepMin) {
    out.push(minToHHMM(m));
  }
  return out;
}

function hhmmToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export async function getAvailableStartsForDay(
  instructorId: string,
  dayOffset: number,
  durationMin: number,
  excludeLessonId?: string,
): Promise<string[]> {
  const { start, end } = tbilisiDayBoundsUtc(dayOffset);

  const [busyRows, frozenRows] = await Promise.all([
    query<{ s: string }>(
      `SELECT to_char(scheduled_at AT TIME ZONE 'Asia/Tbilisi', 'HH24:MI') AS s
       FROM lessons
       WHERE instructor_id = $1
         AND scheduled_at >= $2 AND scheduled_at < $3
         AND status IN ('pending','confirmed')
         AND ($4::bigint IS NULL OR id <> $4::bigint)`,
      [instructorId, start.toISOString(), end.toISOString(), excludeLessonId ?? null],
    ),
    query<{ s: string }>(
      `SELECT to_char(scheduled_at AT TIME ZONE 'Asia/Tbilisi', 'HH24:MI') AS s
       FROM instructor_frozen_slots
       WHERE instructor_id = $1
         AND scheduled_at >= $2 AND scheduled_at < $3`,
      [instructorId, start.toISOString(), end.toISOString()],
    ).catch(() => [] as { s: string }[]),
  ]);

  const taken = new Set([...busyRows.map((r) => r.s), ...frozenRows.map((r) => r.s)]);
  const allSlots = getStandardSlotTimes(durationMin).filter((t) => !taken.has(t));

  const nowMs = Date.now();
  return allSlots.filter((t) => {
    return tbilisiSlotStringToUtcDate(dayOffset, t).getTime() > nowMs;
  });
}

export async function getTakenTimesForDay(
  instructorId: string,
  dayOffset: number,
  excludeLessonId?: string,
): Promise<string[]> {
  // Day window in UTC matching how scheduled_at is stored.
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  start.setUTCDate(start.getUTCDate() + dayOffset);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 1);

  const rows = await query<{ t: string }>(
    `SELECT to_char(scheduled_at, 'HH24:MI') AS t
     FROM lessons
     WHERE instructor_id = $1
       AND scheduled_at >= $2 AND scheduled_at < $3
       AND status IN ('pending','confirmed')
       AND ($4::bigint IS NULL OR id <> $4::bigint)`,
    [instructorId, start.toISOString(), end.toISOString(), excludeLessonId ?? null],
  );
  return rows.map((r) => r.t);
}

export async function cancelLessonByUser(id: string, userId: string): Promise<LessonRow | null> {
  const rows = await query<LessonRow>(
    `UPDATE lessons SET status = 'cancelled'
     WHERE id = $1 AND user_id = $2 AND status IN ('pending','confirmed')
     RETURNING id::text, user_id::text, kind, format, instructor_id, instructor_name,
               scheduled_at, duration_min, location, status, notes, created_at`,
    [id, userId],
  );
  return rows[0] ?? null;
}

export async function rescheduleLesson(
  id: string,
  userId: string,
  newScheduledAt: string,
  newInstructor?: { id: string; name: string } | null,
): Promise<LessonRow | null> {
  const rows = await query<LessonRow>(
    `UPDATE lessons
     SET scheduled_at = $3,
         instructor_id   = COALESCE($4, instructor_id),
         instructor_name = COALESCE($5, instructor_name),
         status = CASE WHEN status = 'confirmed' THEN 'pending' ELSE status END
     WHERE id = $1 AND user_id = $2 AND status IN ('pending','confirmed')
     RETURNING id::text, user_id::text, kind, format, instructor_id, instructor_name,
               scheduled_at, duration_min, location, status, notes, created_at`,
    [
      id,
      userId,
      newScheduledAt,
      newInstructor?.id ?? null,
      newInstructor?.name ?? null,
    ],
  );
  return rows[0] ?? null;
}

export async function listHistory(
  userId: string,
  limit = 20,
  offset = 0,
): Promise<LessonRow[]> {
  return query<LessonRow>(
    `SELECT id::text, user_id::text, kind, format, instructor_id, instructor_name,
            scheduled_at, duration_min, location, status, notes, created_at
     FROM lessons
     WHERE user_id = $1
       AND (scheduled_at < now() - interval '1 hour'
            OR status IN ('completed', 'cancelled'))
     ORDER BY scheduled_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );
}

export async function countHistory(userId: string): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM lessons
     WHERE user_id = $1
       AND (scheduled_at < now() - interval '1 hour'
            OR status IN ('completed', 'cancelled'))`,
    [userId],
  );
  return Number(rows[0].c);
}

export async function countPending(userId: string): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM lessons
     WHERE user_id = $1 AND status = 'pending'`,
    [userId],
  );
  return Number(rows[0].c);
}

export async function countPendingByKind(
  userId: string,
  kind: "theory" | "practice",
): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM lessons
     WHERE user_id = $1 AND kind = $2 AND status = 'pending'`,
    [userId, kind],
  );
  return Number(rows[0].c);
}

export async function countCompletedByKind(
  userId: string,
  kind: "theory" | "practice",
): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM lessons
     WHERE user_id = $1 AND kind = $2 AND status = 'completed'`,
    [userId, kind],
  );
  return Number(rows[0].c);
}
