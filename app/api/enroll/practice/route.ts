import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { query } from "@/lib/db";
import { countCompletedByKind, countPendingByKind } from "@/lib/lessons";
import { getTrustThreshold } from "@/lib/admin/settings";
import { createNotification } from "@/lib/notifications";
import { dispatchModBookingCard } from "@/lib/telegram-dispatch";
import { getClientIp, rateLimit, tooManyResponse } from "@/lib/rate-limit";
import { isIpBlocked, touchUserIp } from "@/lib/admin/blocks";
import { tbilisiSlotStringToUtcDate } from "@/lib/tz";
import { getT } from "@/lib/i18n/server";

export const runtime = "nodejs";

const MAX_PENDING = 3;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 10;

type Body = {
  instructorId?: string;
  instructorName?: string;
  dayOffset?: number;
  dayLabel?: string;
  time?: string;
  format?: string;
  tariffId?: string;
  tariffLabel?: string;
};

const FORMAT_DURATION_MIN: Record<string, number> = {
  pad: 45,
  city: 45,
};

function buildScheduledAt(dayOffset: number, time: string): string {
  return tbilisiSlotStringToUtcDate(dayOffset, time).toISOString();
}

export async function POST(req: NextRequest) {
  const { t } = await getT();
  const session = await readSession();
  if (!session) {
    return NextResponse.json({ error: t("api.enroll.needLogin") }, { status: 401 });
  }

  const ip = getClientIp(req);
  if (await isIpBlocked(ip)) {
    return NextResponse.json({ error: t("api.enroll.unavailable") }, { status: 403 });
  }

  const me = await findUserById(session.userId);
  if (!me || me.is_blocked) {
    return NextResponse.json({ error: t("api.enroll.unavailable") }, { status: 403 });
  }
  if (!me.phone && !me.telegram_username) {
    return NextResponse.json({ error: t("api.enroll.needContact") }, { status: 400 });
  }
  await touchUserIp(me.id, ip);

  let body: Body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: t("api.enroll.badJson") }, { status: 400 });
  }

  if (
    typeof body.instructorId !== "string" ||
    typeof body.instructorName !== "string" ||
    typeof body.dayOffset !== "number" ||
    typeof body.time !== "string" ||
    typeof body.format !== "string"
  ) {
    return NextResponse.json({ error: t("api.enroll.practice.fieldsMissing") }, { status: 400 });
  }

  if (!/^\d{1,2}:\d{2}$/.test(body.time)) {
    return NextResponse.json({ error: t("api.enroll.practice.badTime") }, { status: 400 });
  }

  const rate = rateLimit({
    key: `enroll:user:${session.userId}`,
    max: RATE_MAX,
    windowMs: RATE_WINDOW_MS,
  });
  if (!rate.ok) {
    return tooManyResponse(rate, t("api.enroll.rateLimit"));
  }

  const pending = await countPendingByKind(session.userId, "practice");
  if (pending >= MAX_PENDING) {
    return NextResponse.json(
      { error: t("api.enroll.practice.maxPending", { n: pending }) },
      { status: 429 },
    );
  }

  const scheduledAt = buildScheduledAt(body.dayOffset, body.time);

  const FORMAT_LABEL: Record<string, string> = {
    pad: t("api.enroll.practice.formatPad"),
    city: t("api.enroll.practice.formatCity"),
  };
  const formatLabel = FORMAT_LABEL[body.format] ?? body.format;
  const notes = [
    body.tariffLabel ? `${t("api.enroll.practice.tariffLabel")}: ${body.tariffLabel}` : null,
    body.dayLabel ? `${t("api.enroll.practice.dateLabel")}: ${body.dayLabel} ${body.time}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const durationMin = FORMAT_DURATION_MIN[body.format] ?? 60;

  const [completedCount, trustThreshold] = await Promise.all([
    countCompletedByKind(session.userId, "practice"),
    getTrustThreshold("practice"),
  ]);
  const autoConfirm = completedCount >= trustThreshold;
  const status = autoConfirm ? "confirmed" : "pending";

  const inserted = await query<{ id: string }>(
    `INSERT INTO lessons (user_id, kind, format, instructor_id, instructor_name,
                          scheduled_at, duration_min, location, status, notes)
     VALUES ($1, 'practice', $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING id::text`,
    [
      session.userId,
      body.format,
      body.instructorId,
      body.instructorName,
      scheduledAt,
      durationMin,
      formatLabel,
      status,
      notes,
    ],
  );
  const lessonId = inserted[0]?.id;

  if (!autoConfirm && lessonId) {
    const fullName = [me.first_name, me.last_name].filter(Boolean).join(" ") || me.login;
    void dispatchModBookingCard({
      lessonId,
      fullName,
      login: me.login,
      phone: me.phone,
      telegramUsername: me.telegram_username,
      scheduledAt: new Date(scheduledAt),
      instructorName: body.instructorName,
      format: body.format,
      notes: notes || null,
    }).catch((e) => console.error("[tg] mod card dispatch failed", e));
  }

  const params = { instr: body.instructorName, day: body.dayLabel ?? "", time: body.time };
  await createNotification(
    session.userId,
    autoConfirm ? t("api.notif.practice.autoTitle") : t("api.notif.practice.title"),
    autoConfirm
      ? t("api.notif.practice.autoBody", params)
      : t("api.notif.practice.pendingBody", params),
    "booking",
  );

  return NextResponse.json({ ok: true });
}
