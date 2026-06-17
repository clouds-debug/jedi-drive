-- 008_reminders_attendance.sql — Напоминания + ответы учеников
-- sudo -u postgres psql jedidrive -f migrations/008_reminders_attendance.sql

ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS reminder_24h_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_12h_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS reminder_2h_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS user_attendance TEXT,
  ADD COLUMN IF NOT EXISTS attendance_handled_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_lessons_reminder_window
  ON lessons (scheduled_at)
  WHERE status = 'confirmed' AND kind = 'practice' AND user_attendance IS NULL;

CREATE INDEX IF NOT EXISTS idx_lessons_attendance_pending
  ON lessons (user_attendance)
  WHERE attendance_handled_at IS NULL AND user_attendance IS NOT NULL;
