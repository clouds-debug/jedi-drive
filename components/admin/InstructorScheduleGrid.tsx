"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useT } from "@/lib/i18n/client";

type Lesson = {
  id: string;
  userId: string | null;
  userLogin: string | null;
  userFirstName: string | null;
  userLastName: string | null;
  userPhone: string | null;
  userTelegram: string | null;
  guestName: string | null;
  guestContact: string | null;
  kind: "theory" | "practice";
  format: string | null;
  hhmm: string;
  durationMin: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
};

const TBILISI_OFFSET_MS = 4 * 60 * 60 * 1000;
const DAYS_AHEAD = 14;
const DAY_START_MIN = 8 * 60 + 45;
const DAY_LAST_START_MIN = 19 * 60 + 15;
const STEP_MIN = 45;

function buildSlotTimes(): string[] {
  const out: string[] = [];
  for (let m = DAY_START_MIN; m <= DAY_LAST_START_MIN; m += STEP_MIN) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    out.push(`${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}`);
  }
  return out;
}

function useDayMeta() {
  const { t } = useT();
  return (offset: number) => {
    const tNow = new Date(Date.now() + TBILISI_OFFSET_MS);
    const d = new Date(
      Date.UTC(
        tNow.getUTCFullYear(),
        tNow.getUTCMonth(),
        tNow.getUTCDate() + offset,
      ),
    );
    return {
      weekday:
        offset === 0
          ? t("admin.schedule.today")
          : offset === 1
            ? t("admin.schedule.tomorrow")
            : t(`admin.weekdays.short.${d.getUTCDay()}`),
      date: `${d.getUTCDate()} ${t(`admin.months.short.${d.getUTCMonth()}`)}`,
    };
  };
}

function useFormatLabel() {
  const { t } = useT();
  return (kind: string, fmt: string | null): string => {
    if (!fmt) return kind === "theory" ? t("admin.kind.theory") : t("admin.kind.practice");
    if (kind === "practice") {
      if (fmt === "pad") return t("admin.format.practice.pad");
      if (fmt === "city") return t("admin.format.practice.city");
    }
    if (kind === "theory") {
      if (fmt === "group") return t("admin.format.theory.group");
      if (fmt === "individual") return t("admin.format.theory.individual");
    }
    return fmt;
  };
}

export function InstructorScheduleGrid({
  initialDay,
  initialLessons,
}: {
  initialDay: number;
  initialLessons: Lesson[];
}) {
  const { t } = useT();
  const router = useRouter();
  const dayMeta = useDayMeta();
  const [dayOffset, setDayOffset] = useState(initialDay);
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const [bookingSlot, setBookingSlot] = useState<string | null>(null);

  const slotTimes = useMemo(() => buildSlotTimes(), []);
  const lessonByTime = useMemo(() => {
    const m = new Map<string, Lesson>();
    for (const l of lessons) {
      if (l.status === "pending" || l.status === "confirmed") {
        m.set(l.hhmm, l);
      }
    }
    return m;
  }, [lessons]);

  const offGridLessons = useMemo(
    () => lessons.filter((l) => !slotTimes.includes(l.hhmm)),
    [lessons, slotTimes],
  );

  useEffect(() => {
    setSelectedSlot(null);
    if (dayOffset === initialDay) return;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/admin/schedule?dayOffset=${dayOffset}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { lessons: Lesson[] }) => {
        if (!cancelled) setLessons(d.lessons);
      })
      .catch(() => {
        if (!cancelled) setLessons([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [dayOffset, initialDay]);

  const days = Array.from({ length: DAYS_AHEAD }, (_, i) => dayMeta(i));
  const selectedLesson = selectedSlot ? lessonByTime.get(selectedSlot) : null;

  return (
    <div>
      <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase mb-2">
        {t("admin.schedule.pickDay")}
      </div>
      <DayScroller backLabel={t("admin.schedule.scrollBack")} nextLabel={t("admin.schedule.scrollNext")}>
        {days.map((d, i) => {
          const active = i === dayOffset;
          return (
            <button
              key={i}
              type="button"
              onClick={() => setDayOffset(i)}
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
        {t("admin.schedule.workingHours")}
      </div>

      {loading ? (
        <div className="text-[12.5px] text-muted-on-navy bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
          {t("admin.schedule.loading")}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {slotTimes.map((time) => {
            const lesson = lessonByTime.get(time);
            const busy = !!lesson;
            const studentName = lesson
              ? lesson.guestName
                ?? ([lesson.userFirstName, lesson.userLastName].filter(Boolean).join(" ") ||
                    lesson.userLogin ||
                    t("admin.booking.noName"))
              : "";
            return (
              <button
                key={time}
                type="button"
                onClick={() => (busy ? setSelectedSlot(time) : setBookingSlot(time))}
                className={`text-left rounded-lg border-2 px-3 py-2.5 transition-colors cursor-pointer ${
                  busy
                    ? "border-orange/60 bg-orange/[0.06] hover:bg-orange/[0.12]"
                    : "border-emerald-500/40 bg-emerald-500/[0.04] hover:bg-emerald-500/[0.10]"
                }`}
              >
                <div className="font-mono text-[14px] text-white tabular-nums">
                  {time}
                </div>
                <div className="text-[11.5px] mt-0.5 truncate">
                  {busy ? (
                    <span className={lesson?.status === "pending" ? "text-orange-soft" : "text-white"}>
                      {studentName}
                      {lesson?.status === "pending" ? " · ⏳" : ""}
                    </span>
                  ) : (
                    <span className="text-emerald-300/80">{t("admin.schedule.freeTake")}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {offGridLessons.length > 0 && (
        <div className="mt-6">
          <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase mb-2">
            {t("admin.schedule.offGrid")}
          </div>
          <div className="space-y-2">
            {offGridLessons.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setSelectedSlot(l.hhmm)}
                className="w-full text-left rounded-lg border border-orange/40 bg-orange/[0.06] hover:bg-orange/[0.12] px-3 py-2.5 transition-colors"
              >
                <div className="font-mono text-[13px] text-white tabular-nums">{l.hhmm}</div>
                <div className="text-[11.5px] text-muted-on-navy">
                  {[l.userFirstName, l.userLastName].filter(Boolean).join(" ") || l.userLogin}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedLesson && (
        <LessonModal
          lesson={selectedLesson}
          onClose={() => setSelectedSlot(null)}
          onDone={() => {
            setSelectedSlot(null);
            setLessons((prev) => prev);
            triggerReload(dayOffset, setLessons, setLoading);
            router.refresh();
          }}
        />
      )}

      {bookingSlot && (
        <GuestBookingModal
          dayOffset={dayOffset}
          time={bookingSlot}
          onClose={() => setBookingSlot(null)}
          onDone={() => {
            setBookingSlot(null);
            triggerReload(dayOffset, setLessons, setLoading);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function triggerReload(
  dayOffset: number,
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
) {
  setLoading(true);
  fetch(`/api/admin/schedule?dayOffset=${dayOffset}`)
    .then((r) => (r.ok ? r.json() : Promise.reject()))
    .then((d: { lessons: Lesson[] }) => setLessons(d.lessons))
    .catch(() => setLessons([]))
    .finally(() => setLoading(false));
}

function GuestBookingModal({
  dayOffset,
  time,
  onClose,
  onDone,
}: {
  dayOffset: number;
  time: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useT();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [format, setFormat] = useState<"pad" | "city">("pad");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/schedule/book", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          dayOffset,
          time,
          format,
          guestName: name,
          guestContact: contact,
          notes,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("admin.error.generic"));
        return;
      }
      onDone();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-navy-deep/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[460px] bg-navy border border-white/12 rounded-[var(--radius-card)] p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-[11px] font-mono text-orange tracking-[0.1em] mb-1">
                {t("admin.schedule.modal.slotKicker", { time })}
              </div>
              <h3 className="text-[20px] text-white font-medium">
                {t("admin.schedule.modal.guestTitle")}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 grid place-items-center text-muted-on-navy hover:text-white transition-colors"
              aria-label={t("admin.schedule.close")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <p className="text-[12.5px] text-muted-on-navy mb-4">
            {t("admin.schedule.modal.guestNote")}
          </p>

          <form onSubmit={submit} className="space-y-4">
            <label className="block">
              <span className="block text-[10.5px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">
                {t("admin.schedule.modal.studentName")}
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("admin.schedule.modal.studentPlaceholder")}
                required
                className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/60"
              />
            </label>

            <label className="block">
              <span className="block text-[10.5px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">
                {t("admin.schedule.modal.contact")}
              </span>
              <input
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder={t("admin.schedule.modal.contactPlaceholder")}
                required
                className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/60"
              />
            </label>

            <div>
              <span className="block text-[10.5px] text-muted-on-navy tracking-[0.1em] uppercase mb-2">
                {t("admin.schedule.modal.format")}
              </span>
              <div className="flex gap-2">
                {[
                  { v: "pad" as const, label: t("admin.format.practice.pad") },
                  { v: "city" as const, label: t("admin.format.practice.city") },
                ].map((f) => (
                  <button
                    key={f.v}
                    type="button"
                    onClick={() => setFormat(f.v)}
                    className={`flex-1 px-3 py-2 rounded-lg text-[13px] border transition-colors ${
                      format === f.v
                        ? "bg-orange/15 border-orange/50 text-white"
                        : "bg-white/[0.04] border-white/12 text-muted-on-navy hover:text-white hover:border-white/25"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="block text-[10.5px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">
                {t("admin.schedule.modal.commentOptional")}
              </span>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                maxLength={500}
                className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-3.5 py-2.5 text-[13px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/60 resize-none"
              />
            </label>

            {error && (
              <div className="text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={busy}
                className="text-[13px] px-4 py-2 rounded-lg text-muted-on-navy hover:text-white transition-colors"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                disabled={busy}
                className="text-[13px] bg-orange hover:bg-orange/90 text-white px-4 py-2 rounded-lg disabled:opacity-60 transition-colors"
              >
                {busy ? t("admin.schedule.modal.saving") : t("admin.schedule.modal.takeSlot")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function LessonModal({
  lesson,
  onClose,
  onDone,
}: {
  lesson: Lesson;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useT();
  const formatLabel = useFormatLabel();
  const isGuest = lesson.userId === null;
  const fullName = isGuest
    ? lesson.guestName ?? t("admin.booking.guest")
    : [lesson.userFirstName, lesson.userLastName].filter(Boolean).join(" ") ||
      lesson.userLogin ||
      t("admin.booking.noName");

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function decide(action: "confirm" | "reject") {
    if (action === "reject" && !confirm(t("admin.schedule.modal.confirmReject"))) return;
    setBusy(action);
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lesson.id}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("admin.error.generic"));
        return;
      }
      onDone();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-navy-deep/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] bg-navy border border-white/12 rounded-[var(--radius-card)] p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-[11px] font-mono text-orange tracking-[0.1em] mb-1">
                {t("admin.schedule.modal.recordOn", { time: lesson.hhmm })}
              </div>
              <h3 className="text-[20px] text-white font-medium">{fullName}</h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 grid place-items-center text-muted-on-navy hover:text-white transition-colors"
              aria-label={t("admin.schedule.close")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <dl className="space-y-2 text-[13px] mb-5">
            {isGuest ? (
              <>
                <Row label={t("admin.schedule.modal.recordType")} value={t("admin.schedule.modal.recordTypeGuest")} />
                {lesson.guestContact && (
                  <Row label={t("admin.schedule.modal.contactLabel")} value={lesson.guestContact} />
                )}
              </>
            ) : (
              <>
                {lesson.userLogin && (
                  <Row label={t("admin.schedule.modal.loginLabel")} value={`@${lesson.userLogin}`} />
                )}
                {lesson.userPhone && (
                  <Row
                    label={t("admin.schedule.modal.phoneLabel")}
                    value={
                      <a
                        href={`tel:${lesson.userPhone}`}
                        className="text-orange-soft hover:underline"
                      >
                        {lesson.userPhone}
                      </a>
                    }
                  />
                )}
                {lesson.userTelegram && (
                  <Row
                    label={t("admin.schedule.modal.telegramLabel")}
                    value={
                      <a
                        href={`https://t.me/${lesson.userTelegram}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-orange-soft hover:underline"
                      >
                        @{lesson.userTelegram}
                      </a>
                    }
                  />
                )}
              </>
            )}
            <Row
              label={t("admin.schedule.modal.typeLabel")}
              value={`${formatLabel(lesson.kind, lesson.format)} · ${t("admin.booking.durationMin", { min: lesson.durationMin })}`}
            />
            <Row label={t("admin.schedule.modal.statusLabel")} value={<StatusBadge status={lesson.status} />} />
            {lesson.notes && <Row label={t("admin.schedule.modal.commentLabel")} value={lesson.notes} />}
          </dl>

          {error && (
            <div className="mb-4 text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {(lesson.status === "pending" || lesson.status === "confirmed") && (
            <div className="flex justify-end gap-2 pt-3 border-t border-white/[0.06]">
              {lesson.status === "pending" && (
                <button
                  type="button"
                  onClick={() => decide("confirm")}
                  disabled={busy !== null}
                  className="text-[13px] bg-orange hover:bg-orange/90 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                >
                  {busy === "confirm" ? "..." : t("admin.decision.confirm")}
                </button>
              )}
              <button
                type="button"
                onClick={() => decide("reject")}
                disabled={busy !== null}
                className="text-[13px] text-orange-soft hover:text-orange border border-orange/30 hover:border-orange/50 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
              >
                {busy === "reject" ? "..." : t("admin.decision.reject")}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3 items-baseline">
      <dt className="text-[10.5px] text-muted-on-navy tracking-[0.1em] uppercase">
        {label}
      </dt>
      <dd className="text-white">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: Lesson["status"] }) {
  const { t } = useT();
  const clsMap: Record<Lesson["status"], string> = {
    pending: "border-orange/40 bg-orange/[0.08] text-orange-soft",
    confirmed: "border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-300",
    completed: "border-white/15 bg-white/[0.04] text-muted-on-navy",
    cancelled: "border-red-500/30 bg-red-500/[0.08] text-red-300",
  };
  return (
    <span className={`inline-flex text-[10.5px] font-mono uppercase tracking-[0.1em] border ${clsMap[status]} rounded px-2 py-0.5`}>
      {t(`admin.status.${status}`)}
    </span>
  );
}

function DayScroller({ children, backLabel, nextLabel }: { children: React.ReactNode; backLabel: string; nextLabel: string }) {
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
        aria-label={backLabel}
        className="shrink-0 w-7 rounded-lg bg-white/[0.03] border border-white/10 text-muted-on-navy hover:text-white hover:border-white/25 grid place-items-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <div
        ref={ref}
        className="flex gap-1.5 overflow-x-auto overscroll-x-contain touch-pan-x no-scrollbar pb-1 flex-1 scroll-smooth"
      >
        {children}
      </div>
      <button
        type="button"
        onClick={() => scroll("right")}
        disabled={!canNext}
        aria-label={nextLabel}
        className="shrink-0 w-7 rounded-lg bg-white/[0.03] border border-white/10 text-muted-on-navy hover:text-white hover:border-white/25 grid place-items-center disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
