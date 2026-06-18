import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { freezeSlot, unfreezeSlot } from "@/lib/admin/schedule";
import { tbilisiSlotStringToUtcDate } from "@/lib/tz";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const me = await findUserById(session.userId);
  if (!me || me.role !== "instructor" || !me.instructor_ref) {
    return NextResponse.json({ error: "Только для инструкторов" }, { status: 403 });
  }

  let body: { dayOffset?: number; time?: string; action?: "freeze" | "unfreeze" };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const dayOffset = Number(body.dayOffset);
  const time = (body.time ?? "").trim();
  const action = body.action;
  if (!Number.isFinite(dayOffset) || dayOffset < 0 || dayOffset > 90) {
    return NextResponse.json({ error: "Bad day" }, { status: 400 });
  }
  if (!/^\d{1,2}:\d{2}$/.test(time)) {
    return NextResponse.json({ error: "Bad time" }, { status: 400 });
  }
  if (action !== "freeze" && action !== "unfreeze") {
    return NextResponse.json({ error: "Bad action" }, { status: 400 });
  }

  const scheduledAt = tbilisiSlotStringToUtcDate(dayOffset, time).toISOString();

  if (action === "freeze") {
    await freezeSlot(me.instructor_ref, scheduledAt, me.id);
  } else {
    await unfreezeSlot(me.instructor_ref, scheduledAt);
  }
  return NextResponse.json({ ok: true });
}
