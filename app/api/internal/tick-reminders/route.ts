import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { botT, isBotLang, type BotLang } from "@/lib/bot-i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const expected = process.env.INTERNAL_API_TOKEN;
  if (!expected) return false;
  const got = req.headers.get("authorization") ?? "";
  return got === `Bearer ${expected}`;
}

type Candidate = {
  id: string;
  user_id: string;
  scheduled_at: string;
  created_at: string;
  instructor_name: string | null;
  format: string | null;
  chat_id: string;
  lang: string | null;
  r24: string | null;
  r12: string | null;
  r2: string | null;
};

function pickReminder(
  hoursLeft: number,
  leadTimeHours: number,
  c: Candidate,
): "24h" | "12h" | "2h" | null {
  if (hoursLeft <= 24 && hoursLeft > 12 && leadTimeHours >= 24 && c.r24 === null) return "24h";
  if (hoursLeft <= 12 && hoursLeft > 2 && leadTimeHours >= 12 && c.r12 === null) return "12h";
  if (hoursLeft <= 2 && hoursLeft > 0 && leadTimeHours >= 2 && c.r2 === null) return "2h";
  return null;
}

function fmtCardText(
  c: Candidate,
  which: "24h" | "12h" | "2h",
  lang: BotLang,
): { text: string; buttons: unknown } {
  const intlLocale = lang === "ge" ? "ka-GE" : "ru-RU";
  const date = new Date(c.scheduled_at).toLocaleString(intlLocale, {
    weekday: "short",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tbilisi",
  });
  const fmtLabel =
    c.format === "pad" ? botT(lang, "card.format.pad")
      : c.format === "city" ? botT(lang, "card.format.city")
        : c.format === "pad+city" ? botT(lang, "card.format.padCity")
          : (c.format ?? "—");
  const title = botT(lang, `remind.title.${which}`);
  const text = botT(lang, "remind.body", {
    title,
    date,
    instructor: c.instructor_name ?? "—",
    format: fmtLabel,
  });
  const buttons = {
    inline_keyboard: [[
      { text: botT(lang, "remind.btn.coming"), callback_data: `attend:yes:${c.id}` },
      { text: botT(lang, "remind.btn.notComing"), callback_data: `attend:no:${c.id}` },
    ]],
  };
  return { text, buttons };
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  // Берём все confirmed practice занятия в ближайшие 30 часов, у которых
  // user_attendance ещё не выставлен и юзер привязан к TG.
  const rows = await query<Candidate>(
    `SELECT l.id::text, l.user_id::text,
            l.scheduled_at, l.created_at,
            l.instructor_name, l.format,
            u.telegram_chat_id::text AS chat_id,
            u.telegram_lang AS lang,
            l.reminder_24h_sent_at AS r24,
            l.reminder_12h_sent_at AS r12,
            l.reminder_2h_sent_at AS r2
     FROM lessons l
     JOIN users u ON u.id = l.user_id
     WHERE l.status = 'confirmed'
       AND l.kind = 'practice'
       AND l.user_attendance IS NULL
       AND u.telegram_chat_id IS NOT NULL
       AND l.scheduled_at > now()
       AND l.scheduled_at <= now() + interval '30 hours'`,
  );

  const now = Date.now();
  const summary: Record<string, number> = { sent: 0, skipped: 0 };
  for (const c of rows) {
    const start = new Date(c.scheduled_at).getTime();
    const created = new Date(c.created_at).getTime();
    const hoursLeft = (start - now) / 3600_000;
    const leadTimeHours = (start - created) / 3600_000;
    const which = pickReminder(hoursLeft, leadTimeHours, c);
    if (!which) {
      summary.skipped++;
      continue;
    }
    const lang: BotLang = isBotLang(c.lang) ? c.lang : "ru";
    const { text, buttons } = fmtCardText(c, which, lang);
    await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_USER_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: Number(c.chat_id),
        text,
        parse_mode: "HTML",
        reply_markup: buttons,
      }),
    }).catch((e) => console.error("[reminders] sendMessage failed", e));
    const col =
      which === "24h" ? "reminder_24h_sent_at"
        : which === "12h" ? "reminder_12h_sent_at"
          : "reminder_2h_sent_at";
    await query(`UPDATE lessons SET ${col} = now() WHERE id = $1::bigint`, [c.id]);
    summary.sent++;
  }

  return NextResponse.json({ ok: true, ...summary });
}
