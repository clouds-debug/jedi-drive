CREATE TABLE IF NOT EXISTS instructor_frozen_slots (
  id BIGSERIAL PRIMARY KEY,
  instructor_id TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_min INT NOT NULL DEFAULT 45,
  reason TEXT,
  created_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (instructor_id, scheduled_at)
);

CREATE INDEX IF NOT EXISTS idx_frozen_slots_instructor_time
  ON instructor_frozen_slots (instructor_id, scheduled_at);
