import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { query } from "@/lib/db";
import {
  DAY_START_MIN,
  DAY_LAST_START_MIN,
  PRACTICE_DURATION_MIN,
  getTakenTimesForDay,
} from "@/lib/lessons";
import { tbilisiSlotStringToUtcDate } from "@/lib/tz";

export const runtime = "nodejs";

const FORMAT_LABEL: Record<string, string> = {
  pad: "Площадка",
  city: "Город",
};

const FORMAT_DURATION_MIN: Record<string, number> = {
  pad: 45,
  city: 45,
};

function hhmmToMin(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

function isStandardSlot(time: string): boolean {
  if (!/^\d{1,2}:\d{2}$/.test(time)) return false;
  const m = hhmmToMin(time);
  if (m < DAY_START_MIN || m > DAY_LAST_START_MIN) return false;
  return (m - DAY_START_MIN) % PRACTICE_DURATION_MIN === 0;
}

export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.role !== "instructor" || !me.instructor_ref) {
    return NextResponse.json({ error: "Только для инструкторов" }, { status: 403 });
  }

  let body: {
    dayOffset?: number;
    time?: string;
    format?: string;
    guestName?: string;
    guestContact?: string;
    notes?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (typeof body.dayOffset !== "number" || body.dayOffset < 0 || body.dayOffset > 90) {
    return NextResponse.json({ error: "Неверный день" }, { status: 400 });
  }
  if (typeof body.time !== "string" || !isStandardSlot(body.time)) {
    return NextResponse.json({ error: "Неверное время" }, { status: 400 });
  }
  const format =
    body.format === "pad" || body.format === "city" ? body.format : null;
  if (!format) {
    return NextResponse.json({ error: "Выбери формат" }, { status: 400 });
  }
  const guestName = (body.guestName ?? "").trim();
  if (guestName.length < 2 || guestName.length > 120) {
    return NextResponse.json({ error: "Имя ученика 2–120 символов" }, { status: 400 });
  }
  const guestContact = (body.guestContact ?? "").trim();
  if (guestContact.length < 3 || guestContact.length > 120) {
    return NextResponse.json(
      { error: "Контакт ученика 3–120 символов" },
      { status: 400 },
    );
  }

  // Проверка свободного слота — слот не должен быть занят.
  const taken = await getTakenTimesForDay(me.instructor_ref, body.dayOffset);
  if (taken.includes(body.time)) {
    return NextResponse.json(
      { error: "Это время уже занято" },
      { status: 409 },
    );
  }

  const scheduledAt = tbilisiSlotStringToUtcDate(body.dayOffset, body.time).toISOString();
  const durationMin = FORMAT_DURATION_MIN[format];
  const formatLabel = FORMAT_LABEL[format];
  const userNotes = (body.notes ?? "").trim().slice(0, 500);

  await query(
    `INSERT INTO lessons (user_id, kind, format, instructor_id, instructor_name,
                          scheduled_at, duration_min, location, status,
                          notes, guest_name, guest_contact)
     VALUES (NULL, 'practice', $1, $2, $3,
             $4, $5, $6, 'confirmed',
             $7, $8, $9)`,
    [
      format,
      me.instructor_ref,
      [me.first_name, me.last_name].filter(Boolean).join(" ") || `@${me.login}`,
      scheduledAt,
      durationMin,
      formatLabel,
      userNotes || null,
      guestName,
      guestContact,
    ],
  );

  return NextResponse.json({ ok: true });
}
