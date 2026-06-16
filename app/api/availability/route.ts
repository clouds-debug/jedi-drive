import { NextRequest, NextResponse } from "next/server";
import { getAvailableStartsForDay } from "@/lib/lessons";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const instructorId = url.searchParams.get("instructorId");
  const dayOffsetStr = url.searchParams.get("dayOffset");
  const durationStr = url.searchParams.get("durationMin");
  const exclude = url.searchParams.get("excludeLessonId") ?? undefined;

  if (!instructorId || dayOffsetStr === null || durationStr === null) {
    return NextResponse.json({ error: "Bad params" }, { status: 400 });
  }
  const dayOffset = Number(dayOffsetStr);
  const durationMin = Number(durationStr);
  if (!Number.isFinite(dayOffset) || dayOffset < 0 || dayOffset > 90) {
    return NextResponse.json({ error: "Bad day" }, { status: 400 });
  }
  if (!Number.isFinite(durationMin) || durationMin < 5 || durationMin > 240) {
    return NextResponse.json({ error: "Bad duration" }, { status: 400 });
  }

  const available = await getAvailableStartsForDay(
    instructorId,
    dayOffset,
    durationMin,
    exclude,
  );
  return NextResponse.json({ available });
}
