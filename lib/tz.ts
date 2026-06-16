// Школа физически в Тбилиси, все расписание привязано к местному времени (UTC+4, без DST).
// Эти утилиты дают единое представление о дне/времени независимо от того, где сервер или клиент.

export const TBILISI_TZ = "Asia/Tbilisi";
const TBILISI_OFFSET_MS = 4 * 60 * 60 * 1000;

/** Возвращает Date, в чьих UTC-полях лежит «настенное» тбилисское время. */
export function tbilisiNowAsWallClock(): Date {
  return new Date(Date.now() + TBILISI_OFFSET_MS);
}

/** Минут с начала суток в Тбилиси прямо сейчас. */
export function tbilisiNowMinutes(): number {
  const t = tbilisiNowAsWallClock();
  return t.getUTCHours() * 60 + t.getUTCMinutes();
}

/**
 * Возвращает реальный UTC-таймстемп слота, который для тбилисского
 * пользователя выглядит как «текущий день + dayOffset, HH:MM».
 */
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

/** То же, но time = "HH:MM". */
export function tbilisiSlotStringToUtcDate(
  dayOffset: number,
  time: string,
): Date {
  const [hh, mm] = time.split(":").map(Number);
  return tbilisiSlotToUtcDate(dayOffset, hh, mm);
}

/** Границы тбилисского дня (dayOffset от текущего) в UTC. */
export function tbilisiDayBoundsUtc(dayOffset: number): {
  start: Date;
  end: Date;
} {
  const start = tbilisiSlotToUtcDate(dayOffset, 0, 0);
  const end = new Date(start.getTime() + 86_400_000);
  return { start, end };
}

/**
 * По UTC-Date вычисляет на каком тбилисском дне относительно «сегодня» он лежит.
 * Возвращает целое число дней.
 */
export function dayOffsetFromUtc(d: Date): number {
  const todayStart = tbilisiDayBoundsUtc(0).start.getTime();
  return Math.floor((d.getTime() - todayStart) / 86_400_000);
}
