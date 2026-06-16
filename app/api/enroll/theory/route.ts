import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { query } from "@/lib/db";
import { countPendingByKind } from "@/lib/lessons";
import { createNotification } from "@/lib/notifications";
import { getClientIp, rateLimit, tooManyResponse } from "@/lib/rate-limit";
import { isIpBlocked, touchUserIp } from "@/lib/admin/blocks";
import { getT } from "@/lib/i18n/server";

export const runtime = "nodejs";

const RATE_WINDOW_MS = 60 * 60 * 1000;
const RATE_MAX = 10;

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

  let body: { format?: string; comment?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: t("api.enroll.badJson") }, { status: 400 });
  }

  const format =
    body.format === "solo" ? "individual" : body.format === "group" ? "group" : null;
  if (!format) return NextResponse.json({ error: t("api.enroll.badFormat") }, { status: 400 });

  const rate = rateLimit({
    key: `enroll:user:${session.userId}`,
    max: RATE_MAX,
    windowMs: RATE_WINDOW_MS,
  });
  if (!rate.ok) {
    return tooManyResponse(rate, t("api.enroll.rateLimit"));
  }

  const pendingTheory = await countPendingByKind(session.userId, "theory");
  if (pendingTheory >= 1) {
    return NextResponse.json({ error: t("api.enroll.theory.duplicate") }, { status: 429 });
  }

  // Дата-плейсхолдер: scheduled_at NOT NULL в схеме. Используем «далёкую» дату.
  const scheduledAt = "2099-01-01T00:00:00Z";
  const commentText = (body.comment ?? "").trim();

  await query(
    `INSERT INTO lessons (user_id, kind, format, scheduled_at, duration_min, status, notes)
     VALUES ($1, 'theory', $2, $3, 90, 'pending', $4)`,
    [session.userId, format, scheduledAt, commentText || null],
  );

  await createNotification(
    session.userId,
    t("api.notif.theory.title"),
    t("api.notif.theory.body"),
    "booking",
  );

  return NextResponse.json({ ok: true });
}
