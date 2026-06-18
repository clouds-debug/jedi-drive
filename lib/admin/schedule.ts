import { query } from "@/lib/db";
import { tbilisiDayBoundsUtc } from "@/lib/tz";

export type ScheduleLesson = {
  id: string;
  user_id: string | null;
  user_login: string | null;
  user_first_name: string | null;
  user_last_name: string | null;
  user_phone: string | null;
  user_telegram_username: string | null;
  guest_name: string | null;
  guest_contact: string | null;
  kind: "theory" | "practice";
  format: string | null;
  scheduled_at: string; // ISO
  hhmm: string; // "HH:MM" in Asia/Tbilisi
  duration_min: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
};

const SELECT = `l.id::text, l.user_id::text,
  u.login AS user_login, u.first_name AS user_first_name, u.last_name AS user_last_name,
  u.phone AS user_phone, u.telegram_username AS user_telegram_username,
  l.guest_name, l.guest_contact,
  l.kind, l.format,
  l.scheduled_at,
  to_char(l.scheduled_at AT TIME ZONE 'Asia/Tbilisi', 'HH24:MI') AS hhmm,
  l.duration_min, l.status, l.notes`;

export async function getInstructorDay(
  instructorRef: string,
  dayOffset: number,
): Promise<ScheduleLesson[]> {
  const { start, end } = tbilisiDayBoundsUtc(dayOffset);
  return query<ScheduleLesson>(
    `SELECT ${SELECT}
     FROM lessons l LEFT JOIN users u ON u.id = l.user_id
     WHERE l.instructor_id = $1
       AND l.scheduled_at >= $2 AND l.scheduled_at < $3
       AND l.status IN ('pending','confirmed','completed','cancelled')
     ORDER BY l.scheduled_at ASC`,
    [instructorRef, start.toISOString(), end.toISOString()],
  );
}

export async function getInstructorFrozenDay(
  instructorRef: string,
  dayOffset: number,
): Promise<string[]> {
  const { start, end } = tbilisiDayBoundsUtc(dayOffset);
  const rows = await query<{ hhmm: string }>(
    `SELECT to_char(scheduled_at AT TIME ZONE 'Asia/Tbilisi', 'HH24:MI') AS hhmm
     FROM instructor_frozen_slots
     WHERE instructor_id = $1
       AND scheduled_at >= $2 AND scheduled_at < $3`,
    [instructorRef, start.toISOString(), end.toISOString()],
  ).catch(() => [] as { hhmm: string }[]);
  return rows.map((r) => r.hhmm);
}

export async function freezeSlot(
  instructorRef: string,
  scheduledAt: string,
  createdBy: string,
): Promise<void> {
  await query(
    `INSERT INTO instructor_frozen_slots (instructor_id, scheduled_at, created_by)
     VALUES ($1, $2, $3)
     ON CONFLICT (instructor_id, scheduled_at) DO NOTHING`,
    [instructorRef, scheduledAt, createdBy],
  );
}

export async function unfreezeSlot(
  instructorRef: string,
  scheduledAt: string,
): Promise<void> {
  await query(
    `DELETE FROM instructor_frozen_slots
     WHERE instructor_id = $1 AND scheduled_at = $2`,
    [instructorRef, scheduledAt],
  );
}
