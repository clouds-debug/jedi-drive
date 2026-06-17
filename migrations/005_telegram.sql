-- 005_telegram.sql — Telegram bot integration
-- Run on VPS: psql $DATABASE_URL -f migrations/005_telegram.sql

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS telegram_chat_id BIGINT,
  ADD COLUMN IF NOT EXISTS telegram_link_token TEXT,
  ADD COLUMN IF NOT EXISTS telegram_link_token_at TIMESTAMPTZ;

CREATE UNIQUE INDEX IF NOT EXISTS idx_users_tg_chat_id
  ON users(telegram_chat_id)
  WHERE telegram_chat_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_users_tg_token
  ON users(telegram_link_token)
  WHERE telegram_link_token IS NOT NULL;

-- chat_ids ассоциированные с забаненными аккаунтами: не дать им привязаться к новому
CREATE TABLE IF NOT EXISTS blocked_chat_ids (
  chat_id BIGINT PRIMARY KEY,
  blocked_user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
  blocked_at TIMESTAMPTZ DEFAULT now()
);

-- сообщения в чаты модераторов: чтобы можно было редактировать после решения
CREATE TABLE IF NOT EXISTS tg_mod_messages (
  id BIGSERIAL PRIMARY KEY,
  lesson_id BIGINT NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  chat_id BIGINT NOT NULL,
  message_id BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_tg_mod_messages_lesson ON tg_mod_messages(lesson_id);
