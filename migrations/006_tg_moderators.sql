-- 006_tg_moderators.sql — Динамический список модераторов для TG-карточек
-- Запуск: sudo -u postgres psql jedidrive -f migrations/006_tg_moderators.sql

CREATE TABLE IF NOT EXISTS tg_moderators (
  chat_id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  added_at TIMESTAMPTZ DEFAULT now(),
  added_by TEXT
);
