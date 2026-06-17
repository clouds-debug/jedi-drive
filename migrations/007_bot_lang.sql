-- 007_bot_lang.sql — Язык интерфейса бота на пользователя/модератора
-- sudo -u postgres psql jedidrive -f migrations/007_bot_lang.sql

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS telegram_lang TEXT DEFAULT 'ru';

ALTER TABLE tg_moderators
  ADD COLUMN IF NOT EXISTS lang TEXT DEFAULT 'ru';
