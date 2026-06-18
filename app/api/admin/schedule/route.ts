import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { getInstructorDay, getInstructorFrozenDay } from "@/lib/admin/schedule";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.role !== "instructor" || !me.instructor_ref) {
    return NextResponse.json({ error: "Только для инструкторов" }, { status: 403 });
  }

  const url = new URL(req.url);
  const dayOffset = Number(url.searchParams.get("dayOffset") ?? 0);
  if (!Number.isFinite(dayOffset) || dayOffset < 0 || dayOffset > 90) {
    return NextResponse.json({ error: "Bad day" }, { status: 400 });
  }

  const [rows, frozen] = await Promise.all([
    getInstructorDay(me.instructor_ref, dayOffset),
    getInstructorFrozenDay(me.instructor_ref, dayOffset),
  ]);
  return NextResponse.json({
    lessons: rows.map((l) => ({
      id: l.id,
      userId: l.user_id,
      userLogin: l.user_login,
      userFirstName: l.user_first_name,
      userLastName: l.user_last_name,
      userPhone: l.user_phone,
      userTelegram: l.user_telegram_username,
      guestName: l.guest_name,
      guestContact: l.guest_contact,
      kind: l.kind,
      format: l.format,
      hhmm: l.hhmm,
      durationMin: l.duration_min,
      status: l.status,
      notes: l.notes,
    })),
    frozen,
  });
}
