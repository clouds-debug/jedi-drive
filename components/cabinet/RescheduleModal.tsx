"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { instructors } from "@/lib/instructors/data";
import { useT } from "@/lib/i18n/client";

const DAYS_AHEAD = 14;

const TBILISI_OFFSET_MS = 4 * 60 * 60 * 1000;

function combineUtc(dayOffset: number, time: string): Date {
  const [hh, mm] = time.split(":").map(Number);
  const tNow = new Date(Date.now() + TBILISI_OFFSET_MS);
  const wallClockMs = Date.UTC(
    tNow.getUTCFullYear(),
    tNow.getUTCMonth(),
    tNow.getUTCDate() + dayOffset,
    hh,
    mm,
    0,
    0,
  );
  return new Date(wallClockMs - TBILISI_OFFSET_MS);
}

export function RescheduleModal({
  lessonId,
  kind,
  instructorId,
  durationMin,
  currentScheduledAt,
  onClose,
  onDone,
  endpoint,
}: {
  lessonId: string;
  kind: "theory" | "practice";
  instructorId: string | null;
  durationMin: number;
  currentScheduledAt: string;
  onClose: () => void;
  onDone: () => void;
  endpoint?: string;
}) {
  const { t } = useT();
  const [dayOffset, setDayOffset] = useState<number>(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickedInstructorId, setPickedInstructorId] = useState<string | null>(
    instructorId,
  );

  void currentScheduledAt;

  const isPractice = kind === "practice";
  const usesInstructorSchedule = isPractice && pickedInstructorId !== null;

  const days = useMemo(() => {
    function dayMeta(offset: number) {
      const tNow = new Date(Date.now() + TBILISI_OFFSET_MS);
      const tDay = new Date(
        Date.UTC(
          tNow.getUTCFullYear(),
          tNow.getUTCMonth(),
          tNow.getUTCDate() + offset,
        ),
      );
      const wd = tDay.getUTCDay();
      const mn = tDay.getUTCMonth();
      return {
        iso: tDay.toISOString().slice(0, 10),
        weekday:
          offset === 0
            ? t("date.today")
            : offset === 1
              ? t("date.tomorrow")
              : t(`date.weekday.${wd}`),
        date: `${tDay.getUTCDate()} ${t(`date.month.${mn}`)}`,
        full: tDay,
      };
    }
    return Array.from({ length: DAYS_AHEAD }, (_, i) => dayMeta(i));
  }, [t]);

  useEffect(() => {
    if (!usesInstructorSchedule || !pickedInstructorId) {
      const fallback: string[] = [];
      const start = 8 * 60 + 45;
      const lastStart = 19 * 60 + 15;
      for (let m = start; m <= lastStart; m += durationMin) {
        const h = Math.floor(m / 60);
        const mm = m % 60;
        fallback.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
      }
      const tNow = new Date(Date.now() + TBILISI_OFFSET_MS);
      const nowMin = tNow.getUTCHours() * 60 + tNow.getUTCMinutes();
      const filtered = dayOffset === 0 ? fallback.filter((t) => {
        const [h, mm] = t.split(":").map(Number);
        return h * 60 + mm > nowMin;
      }) : fallback;
      setSlots(filtered);
      setLoading(false);
      setSelectedTime(null);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(
      `/api/availability?instructorId=${encodeURIComponent(pickedInstructorId)}&dayOffset=${dayOffset}&durationMin=${durationMin}&excludeLessonId=${lessonId}`,
    )
      .then((r) => (r.ok ? r.json() : { available: [] }))
      .then((d: { available?: string[] }) => {
        if (!cancelled) setSlots(d.available ?? []);
      })
      .catch(() => {
        if (!cancelled) setSlots([]);
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
          setSelectedTime(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [usesInstructorSchedule, pickedInstructorId, dayOffset, durationMin, lessonId]);

  async function submit(scheduledAt: Date) {
    setBusy(true);
    setError(null);
    try {
      const payload: Record<string, unknown> = {
        scheduledAt: scheduledAt.toISOString(),
      };
      if (isPractice && pickedInstructorId && pickedInstructorId !== instructorId) {
        payload.instructorId = pickedInstructorId;
      }
      const res = await fetch(endpoint ?? `/api/lessons/${lessonId}/reschedule`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("cab.resched.modal.error"));
        return;
      }
      onDone();
    } finally {
      setBusy(false);
    }
  }

  function onConfirm() {
    if (!selectedTime) return;
    const d = combineUtc(dayOffset, selectedTime);
    void submit(d);
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-navy-deep/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] bg-navy border border-white/12 rounded-[var(--radius-card)] p-6 sm:p-7 max-h-[90vh] overflow-y-auto no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-[11px] font-mono text-orange tracking-[0.1em] mb-1">{t("cab.resched.modal.kicker")}</div>
              <h3 className="text-[20px] text-white font-medium">{t("cab.resched.modal.heading")}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 grid place-items-center text-muted-on-navy hover:text-white transition-colors"
              aria-label={t("cab.review.modal.close")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

              <p className="text-[12.5px] text-muted-on-navy mb-4">
                {usesInstructorSchedule
                  ? t("cab.resched.modal.descWithInstr", { n: durationMin })
                  : t("cab.resched.modal.descNoInstr", { n: durationMin })}
              </p>

              {isPractice && (
                <>
                  <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase mb-2">
                    {t("cab.resched.modal.instructor")}
                  </div>
                  <select
                    value={pickedInstructorId ?? ""}
                    onChange={(e) => {
                      setPickedInstructorId(e.target.value || null);
                      setSelectedTime(null);
                    }}
                    className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-3 py-2.5 text-[13.5px] text-white focus:outline-none focus:border-orange/60 mb-5 appearance-none cursor-pointer"
                    style={{
                      backgroundImage:
                        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'><path d='M2 4l4 4 4-4' fill='none' stroke='%23A5B4D8' stroke-width='1.5'/></svg>\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 12px center",
                      paddingRight: "32px",
                    }}
                  >
                    {instructors.map((inst) => (
                      <option key={inst.id} value={inst.id} className="bg-navy">
                        {inst.name}
                        {inst.id === instructorId ? " " + t("cab.resched.modal.current.suffix") : ""}
                      </option>
                    ))}
                  </select>
                </>
              )}

              <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase mb-2">
                {t("cab.resched.modal.chooseDay")}
              </div>
              <DayScroller>
                {days.map((d, i) => {
                  const offset = i;
                  const active = offset === dayOffset;
                  return (
                    <button
                      key={offset}
                      type="button"
                      onClick={() => setDayOffset(offset)}
                      className={`shrink-0 w-[64px] py-2 rounded-lg border text-center transition-colors ${
                        active
                          ? "bg-orange/15 border-orange/50 text-white"
                          : "bg-white/[0.03] border-white/10 text-muted-on-navy hover:text-white hover:border-white/25"
                      }`}
                    >
                      <div className="text-[10.5px] tracking-[0.05em] uppercase">{d.weekday}</div>
                      <div className="text-[12.5px] tabular-nums mt-0.5">{d.date}</div>
                    </button>
                  );
                })}
              </DayScroller>

              <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase mb-2">
                {t("cab.resched.modal.freeTime")}
              </div>
              {loading ? (
                <div className="text-[12.5px] text-muted-on-navy bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                  {t("cab.resched.modal.calculating")}
                </div>
              ) : slots.length === 0 ? (
                <div className="text-[12.5px] text-muted-on-navy bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                  {t("cab.resched.modal.tryAnotherDay")}
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {slots.map((time) => {
                    const selected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`py-2 rounded-lg border text-[12.5px] tabular-nums transition-colors ${
                          selected
                            ? "bg-orange border-orange text-white"
                            : "bg-white/[0.03] border-white/10 text-white hover:border-orange/50"
                        }`}
                      >
                        {time}
                      </button>
                    );
                  })}
                </div>
              )}

              {error && (
                <div className="mt-4 text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className="text-[13px] px-4 py-2 rounded-lg text-muted-on-navy hover:text-white transition-colors"
                >
                  {t("cab.resched.modal.cancel")}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={busy || !selectedTime}
                  className="text-[13px] bg-orange hover:bg-orange/90 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {busy ? t("cab.resched.modal.sending") : t("cab.resched.modal.confirm")}
                </button>
              </div>
        </div>
      </div>
    </div>
  );
}

function DayScroller({ children }: { children: React.ReactNode }) {
  const { t } = useT();
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  function update() {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    update();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  function scroll(dir: "left" | "right") {
    const el = ref.current;
    if (!el) return;
    el.scrollLeft += dir === "left" ? -220 : 220;
    setTimeout(update, 320);
  }

  return (
    <div className="flex items-stretch gap-1.5 mb-5">
      <button
        type="button"
        onClick={() => scroll("left")}
        disabled={!canPrev}
        aria-label={t("cab.resched.modal.prev")}
        className="shrink-0 w-7 rounded-lg bg-white/[0.03] border border-white/10 text-muted-on-navy hover:text-white hover:border-white/25 grid place-items-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div
        ref={ref}
        className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1 flex-1 scroll-smooth"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        disabled={!canNext}
        aria-label={t("cab.resched.modal.next")}
        className="shrink-0 w-7 rounded-lg bg-white/[0.03] border border-white/10 text-muted-on-navy hover:text-white hover:border-white/25 grid place-items-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
