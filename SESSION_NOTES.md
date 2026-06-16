# Jedi Drive — состояние проекта на конец сессии 2026-06-14

Этот файл — снимок для следующей Claude-сессии. Читай его сразу после `CLAUDE.md` и `AGENTS.md`.

## Что уже работает

### Auth + кабинет ученика
- Регистрация (логин/пароль/DOB), вход, сброс по DOB
- httpOnly JWT-cookie + сессии в БД (можно отзывать сменой роли или баном)
- bcrypt cost 12 для паролей, AES-256-GCM для DOB
- Rate-limit, lockout, honeypot, generic-errors (см. `lib/rate-limit.ts`)
- Кабинет: Профиль · Мои занятия · История · Билеты · Уведомления
- Пагинация 20/стр на уведомлениях, истории, предстоящих
- Лимит 3 pending на юзера (раздельно для теории и практики)
- При записи требуется заполненный `users.phone` или `users.telegram_username`

### Запись на занятия
- Календарь по тбилисскому времени (UTC+4), `lib/tz.ts` — единая точка
- Фиксированная сетка слотов **08:45 — 19:15 шагом 45 минут** (15 окон)
- Длительность: pad = 45 мин, city = 45 мин, theory = 90 мин
- Тарифы практики: только два — «Только площадка» (₾500/10) и «Только город» (₾650/10). Комбо убрано.
- Слоты на «сегодня» отсекаются если время уже прошло по Tbilisi
- Auth-гейт: гостям показывается CTA «Войди чтобы записаться»

### Перенос/отмена (для ученика)
- Минимум 24 часа до начала
- В модалке переноса можно выбрать **другого инструктора** (`/api/lessons/:id/reschedule` и `/api/admin/lessons/:id/reschedule` принимают `instructorId`)
- Подтверждённое занятие после переноса возвращается в `pending`

### Авто-перевод в completed
- `markStaleConfirmedCompleted()` — если `scheduled_at + duration + 1h < now()`, статус становится `completed`
- Запускается на каждой странице кабинета/админки

### Админка (`/admin/*`)
- `/admin` — дашборд с статистикой, donut-чартами по статусу/типу, bar-чартом по месяцам
- `/admin/bookings` — модерация заявок (Подтвердить/Отклонить/Перенести/Отменить + Заблокировать юзера)
- `/admin/users` — 4 таба (Пользователи/Модераторы/Инструкторы/Администраторы), поиск по логину, смена роли, бан, для инструкторов — Скрыть/Удалить
- `/admin/reviews` — модерация отзывов
- `/admin/schedule` — **только для инструкторов**, переделан в сетку дней + слотов
- `/admin/bio` — **только для инструкторов**, форма биографии с предпросмотром карточки

### Роли
- `student` (default) → `/cabinet/profile`
- `moderator` → `/admin/bookings`
- `instructor` → `/admin/bio` (раньше был `/admin/schedule`)
- `admin` → `/admin` (полный доступ кроме `/admin/schedule` — это для инструкторов)

`instructor_ref` для новых инструкторов автоматически = `u-${user_id}`. Старые инструкторы (data.ts) имеют ref типа `giorgi`, `david`. Оба формата работают.

### Отзывы
- Только после `completed`-занятия с этим инструктором
- Один активный (`pending` + `approved`) на пару (юзер, инструктор)
- Модерация: pending → approved/rejected с причиной отказа
- Рейтинг считается live из одобренных
- Лента отображается на `/instructors` в модалке инструктора

### Блокировка
- `users.is_blocked` + таблица `blocked_ips`
- При блокировке: статус is_blocked=true, активные сессии убиты, `last_ip` уходит в `blocked_ips`
- `/api/auth/login|register|reset|enroll/*` проверяют bot+user блок

### Инструкторы (новая модель)
- Промоция: admin → `/admin/users` → «Сменить роль» → Инструктор (без выбора карточки — `instructor_ref` сам становится `u-{user_id}`)
- Инструктор сам заполняет био в `/admin/bio`: имя, фамилия, о себе, машина, стаж, языки, цвет аватара, чекбокс «Опубликовать»
- Опубликованные карточки появляются на `/instructors` **перед** seed-карточками из `data.ts`
- Инструктор-пикер на `/services/practice` тоже показывает их
- В `/admin/schedule` инструктор видит свою сетку дней + слотов, может **сам занять слот** для гостя без аккаунта (имя + контакт, auto-confirmed)

### VPS (AlexHost, IP `85.121.176.124`)
- Ubuntu 24.04, Postgres 16, БД `jedidrive`, юзер `jedidrive_app`
- SSH **только по ключам** (пароль отключён), fail2ban, unattended-upgrades
- Postgres SSL (самоподписанный), порт 5432 открыт через ufw

## БД схема (всё что мигрировано)

```
users (id, login citext UNIQUE, password_hash, dob_encrypted,
       first_name, last_name, phone, telegram_username,
       role, instructor_ref, is_blocked, last_ip inet, created_at, updated_at)

sessions (id uuid, user_id, expires_at, user_agent, ip inet)

lessons (id, user_id NULLABLE, kind theory|practice, format,
         instructor_id, instructor_name,
         scheduled_at timestamptz, duration_min, location,
         status pending|confirmed|completed|cancelled,
         notes, created_at,
         guest_name, guest_contact)   -- последние две для гостевых от инструктора

notifications (id, user_id, title, body, kind, read_at, created_at)

reviews (id, user_id, instructor_id, rating 1..5, body, status, reject_reason,
         created_at, decided_at, decided_by)
   -- уникальный частичный индекс на (user_id, instructor_id) WHERE status IN ('pending','approved')

instructor_overrides (instructor_id PK, is_hidden, is_deleted, updated_at, updated_by)

instructor_profiles (user_id PK, bio, car, experience_years, languages text[],
                     is_published, avatar_color, updated_at)

blocked_ips (ip inet PK, reason, blocked_at, blocked_by, user_id)
```

## Ключевые соглашения

- **TZ**: всё расписание трактуется в `Asia/Tbilisi`. Утилиты в `lib/tz.ts`. Сервер хранит ISO UTC, но конвертация через `tbilisiSlotStringToUtcDate`.
- **Сетка слотов**: `getStandardSlotTimes()` возвращает `["08:45", "09:30", ..., "19:15"]`. Любые новые бронирования снапятся на грид.
- **Display**: `toLocaleString` для дат/времени всегда с `timeZone: 'Asia/Tbilisi'`.
- **Next.js 16**: middleware называется `proxy.ts`. `cookies()` async. Менять cookies нельзя в server-component layout — только в route handler / server action. Если надо разлогинить из layout — редирект на `/cabinet/logout-stale`.
- **БД пул**: `lib/db.ts`, кеш в `global.__pgPool`. При смене env нужен полный рестарт dev-сервера.

## Тестовые данные

- **testuser / newpass456** — это **admin**, заполнен профиль («Анри Тестов», `+995 555 123 456`, `@jedidrive`). У него много старых тестовых заявок и 1 одобренный отзыв на giorgi.
- **DarkFade** — обычный student. Я несколько раз менял ему роль; сейчас точно посмотри через `/admin/users` или psql.
- Несколько test-instructors могли быть созданы в процессе — проверь.

## Env-переменные

`web/.env.local` содержит (значения у тебя в блокноте):
- `DATABASE_URL=postgresql://jedidrive_app:<URL-encoded password>@85.121.176.124:5432/jedidrive`
- `JWT_SECRET`
- `DOB_ENCRYPTION_KEY`

**Перед публичным запуском все три обязательно ротируем** — они засветились в моём контексте в течение разработки.

## Бэклог (что осталось)

1. **Telegram-бот** — главное. Уведомления через бота + верификация при регистрации (закрывает дыру с возвратом забаненных)
2. **Деплой на VPS** — переезд с Vercel: Node, nginx, pm2, домен, Let's Encrypt
3. **Ротация секретов** (DB password, JWT_SECRET, DOB_ENCRYPTION_KEY) — обязательно перед публикацией
4. **Cloudflare Free** — после привязки домена. DDoS-щит + WAF + Bot Fight Mode
5. **i18n ru/ge** — отложено
6. **Реальная база билетов** — ждём лицензию teoria.on.ge
7. **Inline-edit карандашиком** — обсуждали для смены текстов без кода
8. **Адаптив на мобильный** — не проверял тщательно
9. **Пагинация на Предстоящих** уже есть, но не проверена под нагрузкой
10. **Гостевые записи в `/admin/bookings`** — сейчас отображаются без user-info (фолбэк к guest_contact). Может надо подкрутить.

## Что НЕ ломать

- Static instructors в `lib/instructors/data.ts` теперь пустой массив (Анри попросил убрать 19 фейковых seed-карточек). На сайте отображаются только опубликованные через `/admin/bio` (live карточки из `instructor_profiles.is_published=true`).
- `markStaleConfirmedCompleted()` запускается на каждой странице — это намеренно (нет cron'а).
- `instructor_ref` нового инструктора всегда `u-{userId}`. Если меняешь схему — учитывай.
- Tbilisi TZ зашита в `lib/tz.ts` константой `TBILISI_OFFSET_MS = 4*3600*1000` (без DST).

## Стиль общения

Пользователь — Анри, основатель школы. По-русски. Короткие сообщения, без лишних вступлений. Auto-mode: делать разумный вывод и продолжать. На VPS он работает сам через SSH под мою диктовку — миграции и любые серверные действия я НЕ выполняю напрямую (sandbox блокирует SSH).
