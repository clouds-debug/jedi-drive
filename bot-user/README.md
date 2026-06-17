# Jedi Drive — Telegram bots

Два независимых long-polling процесса. Делят `.env.local` с Next.js.

## Файлы

- `bot-user/index.ts` — бот для учеников (`@jedidrive_bot`)
- `bot-admin/index.ts` — бот для модераторов (`@jedidrive_admin_bot`)
- `migrations/005_telegram.sql` — расширения схемы под TG

## .env переменные

Добавить в `/opt/jedi-drive/.env.local`:

```
TELEGRAM_USER_BOT_TOKEN=...        # от BotFather для @jedidrive_bot
TELEGRAM_USER_BOT_USERNAME=jedidrive_bot
TELEGRAM_ADMIN_BOT_TOKEN=...       # от BotFather для @jedidrive_admin_bot
TELEGRAM_MOD_CHAT_IDS=             # chat_id модераторов через запятую
INTERNAL_API_TOKEN=                # любая длинная случайная строка (общий секрет бот↔web)
INTERNAL_API_BASE=http://localhost:3000  # на VPS обычно так
```

`TELEGRAM_MOD_CHAT_IDS` — каждый модер пишет `/start` админ-боту, тот отвечает его chat_id, вставляешь сюда через запятую.

`INTERNAL_API_TOKEN` сгенерировать: `openssl rand -hex 32`.

## Деплой на VPS

```bash
cd /opt/jedi-drive
git pull

# миграция
psql $DATABASE_URL -f migrations/005_telegram.sql

# Next.js обновить
npm install
npm run build
pm2 restart jedi-drive

# боты
pm2 start "npx tsx bot-user/index.ts" --name jedi-bot-user
pm2 start "npx tsx bot-admin/index.ts" --name jedi-bot-admin
pm2 save
```

После того как вписал `TELEGRAM_MOD_CHAT_IDS` — `pm2 restart jedi-drive` чтобы Next.js перечитал.

## Что работает

- Привязка ученика через кабинет → /admin/profile кнопка «Привязать Telegram»
- Уведомления о заявках (статус подтверждён/отклонён) уходят в TG если привязан
- Новые заявки на практику со статусом pending → карточка модерам с кнопками ✅/❌
- Решение из веб-админки → в карточке модеров кнопки снимаются

## Что НЕ работает (явно)

- Заявки на теорию в TG не уходят модерам (только в /admin/bookings)
- «Перенести» из TG нет — модер тапает «В админку» (планируется как кнопка-ссылка позже)
- Бан-флоу (`blocked_chat_ids` записи) пишет таблица, но автоматически забаненный TG туда не вставляется — TODO
