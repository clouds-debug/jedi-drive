// Локализация сообщений для Telegram-ботов (учеников и модераторов).
// Используется и в bot-*/index.ts (через копию), и в lib/telegram.ts на сервере.

export type BotLang = "ru" | "ge";

export function isBotLang(s: string | null | undefined): s is BotLang {
  return s === "ru" || s === "ge";
}

type Dict = Record<string, { ru: string; ge: string }>;

const STRINGS: Dict = {
  // User bot
  "user.start.unlinked": {
    ru: "Привет! Я бот <b>Jedi Drive</b>. Чтобы привязать меня к своему аккаунту, открой кабинет на сайте и нажми «Привязать Telegram».",
    ge: "გამარჯობა! მე ვარ <b>Jedi Drive</b>-ის ბოტი. ჩემს ანგარიშთან მისაბმელად გახსენი კაბინეტი საიტზე და დააჭირე «Telegram-ის მიბმა».",
  },
  "user.start.linked": {
    ru: "Привет{{hi}}! 👋\n\nЭтот бот отправляет уведомления о твоих заявках в <b>Jedi Drive</b> — подтверждения, отказы, переносы.\n\nВсё остальное — в личном кабинете на сайте.",
    ge: "გამარჯობა{{hi}}! 👋\n\nეს ბოტი გიგზავნის შეტყობინებებს <b>Jedi Drive</b>-ში შენი განაცხადების შესახებ — დადასტურება, უარყოფა, გადატანა.\n\nდანარჩენი — საიტის პირად კაბინეტში.",
  },
  "user.bound.ok": {
    ru: "Готово{{hi}}! ✅\n\nТеперь сюда будут приходить уведомления о твоих заявках.",
    ge: "მზადაა{{hi}}! ✅\n\nახლა აქ მოვა შენი განაცხადების შესახებ შეტყობინებები.",
  },
  "user.bound.fail": {
    ru: "Не получилось привязать. Запроси новый токен в кабинете.",
    ge: "ვერ მოხერხდა მიბმა. მოითხოვე ახალი ტოკენი კაბინეტში.",
  },
  "user.help": {
    ru: "Я отправляю уведомления о твоих заявках на занятия. Привязка — через кабинет на сайте.\n\nКоманды:\n/lang — сменить язык",
    ge: "ვაგზავნი შეტყობინებებს შენი გაკვეთილების განაცხადებზე. მიბმა — საიტის კაბინეტიდან.\n\nბრძანებები:\n/lang — ენის შეცვლა",
  },
  "lang.choose": {
    ru: "Выбери язык:",
    ge: "აირჩიე ენა:",
  },
  "lang.set.ru": {
    ru: "Язык переключён на русский.",
    ge: "ენა შეიცვალა რუსულზე.",
  },
  "lang.set.ge": {
    ru: "ენა შეიცვალა ქართულზე.",
    ge: "ენა შეიცვალა ქართულზე.",
  },
  "lang.button.ru": { ru: "🇷🇺 Русский", ge: "🇷🇺 Русский" },
  "lang.button.ge": { ru: "🇬🇪 ქართული", ge: "🇬🇪 ქართული" },

  // Mod bot
  "mod.start": {
    ru: "Привет! Это <b>модераторский бот Jedi Drive</b>.\n\nТвой chat_id: <code>{{chatId}}</code>\nПередай его админу — он добавит тебя в рассылку заявок.\n\nКоманды:\n/lang — сменить язык",
    ge: "გამარჯობა! ეს არის <b>Jedi Drive-ის მოდერატორის ბოტი</b>.\n\nშენი chat_id: <code>{{chatId}}</code>\nგადააწოდე ის ადმინს — ის დაგამატებს განაცხადების მიმღებთა სიაში.\n\nბრძანებები:\n/lang — ენის შეცვლა",
  },
  "mod.cb.confirmed": { ru: "✅ Подтверждено", ge: "✅ დადასტურდა" },
  "mod.cb.rejected": { ru: "❌ Отклонено", ge: "❌ უარყოფილია" },
  "mod.cb.unknown": { ru: "Неизвестное действие", ge: "უცნობი მოქმედება" },
  "mod.cb.alreadyClosed": {
    ru: "Заявка уже закрыта другим модератором.",
    ge: "განაცხადი უკვე დახურულია სხვა მოდერატორის მიერ.",
  },
  "mod.cb.notFound": { ru: "Заявка не найдена.", ge: "განაცხადი ვერ მოიძებნა." },
  "mod.cb.error": { ru: "Ошибка. Попробуй ещё раз.", ge: "შეცდომა. სცადე ხელახლა." },

  // Mod card
  "card.title": { ru: "🔔 <b>Новая заявка на практику</b>", ge: "🔔 <b>ახალი განაცხადი პრაქტიკაზე</b>" },
  "card.btn.confirm": { ru: "✅ Подтвердить", ge: "✅ დადასტურება" },
  "card.btn.reject": { ru: "❌ Отклонить", ge: "❌ უარყოფა" },
  "card.btn.admin": { ru: "🔄 В админку", ge: "🔄 ადმინისკენ" },
  "card.format.pad": { ru: "Площадка", ge: "მოედანი" },
  "card.format.city": { ru: "Город", ge: "ქალაქი" },
  "card.format.padCity": { ru: "Площадка + город", ge: "მოედანი + ქალაქი" },
};

export function botT(
  lang: BotLang,
  key: string,
  params?: Record<string, string | number>,
): string {
  const entry = STRINGS[key];
  if (!entry) return key;
  const raw = entry[lang] ?? entry.ru;
  if (!params) return raw;
  return raw.replace(/\{\{(\w+)\}\}/g, (_, name) => {
    const v = params[name];
    return v === undefined ? `{{${name}}}` : String(v);
  });
}

export function langKeyboard() {
  return [
    [
      { text: botT("ru", "lang.button.ru"), callback_data: "lang:ru" },
      { text: botT("ru", "lang.button.ge"), callback_data: "lang:ge" },
    ],
  ];
}
