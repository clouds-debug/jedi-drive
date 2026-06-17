export const TBILISI_TZ = "Asia/Tbilisi";
const TBILISI_OFFSET_MS = 4 * 60 * 60 * 1000;


export function tbilisiNowAsWallClock(): Date {
  return new Date(Date.now() + TBILISI_OFFSET_MS);
}


export function tbilisiNowMinutes(): number {
  const t = tbilisiNowAsWallClock();
  return t.getUTCHours() * 60 + t.getUTCMinutes();
}

export function tbilisiSlotToUtcDate(
  dayOffset: number,
  hh: number,
  mm: number,
): Date {
  const tNow = tbilisiNowAsWallClock();
  const wallClockMidnight = Date.UTC(
    tNow.getUTCFullYear(),
    tNow.getUTCMonth(),
    tNow.getUTCDate() + dayOffset,
  );
  const wallClockSlot = wallClockMidnight + (hh * 60 + mm) * 60 * 1000;
  return new Date(wallClockSlot - TBILISI_OFFSET_MS);
}


export function tbilisiSlotStringToUtcDate(
  dayOffset: number,
  time: string,
): Date {
  const [hh, mm] = time.split(":").map(Number);
  return tbilisiSlotToUtcDate(dayOffset, hh, mm);
}


export function tbilisiDayBoundsUtc(dayOffset: number): {
  start: Date;
  end: Date;
} {
  const start = tbilisiSlotToUtcDate(dayOffset, 0, 0);
  const end = new Date(start.getTime() + 86_400_000);
  return { start, end };
}

export function dayOffsetFromUtc(d: Date): number {
  const todayStart = tbilisiDayBoundsUtc(0).start.getTime();
  return Math.floor((d.getTime() - todayStart) / 86_400_000);
}
