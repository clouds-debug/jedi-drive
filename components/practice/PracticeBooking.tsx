"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EnrollLoginGate } from "../EnrollLoginGate";
import { EditableText } from "../content/EditableText";
import { instructors as allInstructors, type Instructor } from "@/lib/instructors/data";
import { tariffOptions } from "./PracticePricing";
import { L, useT } from "@/lib/i18n/client";

const TARIFF_TO_FORMAT: Record<string, string> = {
  platform: "pad",
  city: "city",
};

const TARIFF_TO_DURATION: Record<string, number> = {
  platform: 45,
  city: 45,
};

const DEFAULT_DURATION_MIN = 45;

const avatarColors: Record<Instructor["avatarColor"], string> = {
  indigo: "bg-indigo-500/20 text-indigo-200",
  orange: "bg-orange/20 text-orange-soft",
  violet: "bg-violet-500/20 text-violet-200",
  emerald: "bg-emerald-500/20 text-emerald-200",
  rose: "bg-rose-500/20 text-rose-200",
};

const TBILISI_OFFSET_MS = 4 * 60 * 60 * 1000;

function tbilisiDay(dayOffset: number): Date {
  const tNow = new Date(Date.now() + TBILISI_OFFSET_MS);
  return new Date(
    Date.UTC(
      tNow.getUTCFullYear(),
      tNow.getUTCMonth(),
      tNow.getUTCDate() + dayOffset,
    ),
  );
}

type Translator = (key: string, params?: Record<string, string | number>) => string;

function buildDayLabels(t: Translator): string[] {
  return Array.from({ length: 28 }, (_, i) => {
    if (i === 0) return t("date.today");
    if (i === 1) return t("date.tomorrow");
    return t(`date.weekday.${tbilisiDay(i).getUTCDay()}`);
  });
}

function buildDayDates(t: Translator): string[] {
  return Array.from({ length: 28 }, (_, i) => {
    const d = tbilisiDay(i);
    return `${d.getUTCDate()} ${t(`date.month.${d.getUTCMonth()}`)}`;
  });
}

function buildWeekLabels(t: Translator): string[] {
  return Array.from({ length: 4 }, (_, w) => {
    const start = tbilisiDay(w * 7);
    const end = tbilisiDay(w * 7 + 6);
    return `${start.getUTCDate()} ${t(`date.month.${start.getUTCMonth()}`)} – ${end.getUTCDate()} ${t(`date.month.${end.getUTCMonth()}`)}`;
  });
}

export function PracticeBooking({
  isAuthed,
  hiddenInstructorIds = [],
  extraInstructors = [],
}: {
  isAuthed: boolean;
  hiddenInstructorIds?: string[];
  extraInstructors?: Instructor[];
}) {
  const { t } = useT();
  const dayLabels = useMemo(() => buildDayLabels(t), [t]);
  const dayDates = useMemo(() => buildDayDates(t), [t]);
  const weekLabels = useMemo(() => buildWeekLabels(t), [t]);

  const hiddenSet = useMemo(() => new Set(hiddenInstructorIds), [hiddenInstructorIds]);
  const instructors = useMemo(
    () => [
      ...extraInstructors.filter((i) => !hiddenSet.has(i.id)),
      ...allInstructors.filter((i) => !hiddenSet.has(i.id)),
    ],
    [hiddenSet, extraInstructors],
  );
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  useEffect(() => {
    function applyFromHash() {
      const h = window.location.hash;
      const m = /^#book-(.+)$/.exec(h);
      if (!m) return;
      const id = decodeURIComponent(m[1]);
      if (instructors.some((i) => i.id === id)) {
        setSelectedInstructorId(id);
      }
    }
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, [instructors]);

  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTariff, setSelectedTariff] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedInstructor = useMemo(
    () => instructors.find((i) => i.id === selectedInstructorId) || null,
    [selectedInstructorId, instructors]
  );

  const activeDuration = useMemo(
    () =>
      selectedTariff && TARIFF_TO_DURATION[selectedTariff]
        ? TARIFF_TO_DURATION[selectedTariff]
        : DEFAULT_DURATION_MIN,
    [selectedTariff],
  );

  const [availableTimes, setAvailableTimes] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedInstructorId) {
      setAvailableTimes([]);
      return;
    }
    let cancelled = false;
    fetch(
      `/api/availability?instructorId=${encodeURIComponent(selectedInstructorId)}&dayOffset=${selectedDay}&durationMin=${activeDuration}`,
    )
      .then((r) => (r.ok ? r.json() : { available: [] }))
      .then((data: { available?: string[] }) => {
        if (!cancelled) setAvailableTimes(data.available ?? []);
      })
      .catch(() => {
        if (!cancelled) setAvailableTimes([]);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedInstructorId, selectedDay, activeDuration]);

  const slots = useMemo(
    () => availableTimes.map((time) => ({ time, available: true })),
    [availableTimes],
  );

  function selectInstructor(id: string) {
    if (selectedInstructorId === id) {
      setSelectedInstructorId(null);
      setSelectedTime(null);
      setSelectedTariff(null);
      return;
    }
    setSelectedInstructorId(id);
    setSelectedTime(null);
    setSelectedTariff(null);
    setSelectedDay(0);
  }

  function clearInstructor() {
    setSelectedInstructorId(null);
    setSelectedTime(null);
    setSelectedTariff(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInstructor || !selectedTime || !selectedTariff) return;

    setPending(true);
    setSubmitError(null);
    try {
      const tariff = tariffOptions.find((opt) => opt.id === selectedTariff);
      const res = await fetch("/api/enroll/practice", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          instructorId: selectedInstructor.id,
          instructorName: selectedInstructor.name,
          dayOffset: selectedDay,
          dayLabel: `${dayLabels[selectedDay]} ${dayDates[selectedDay]}`,
          time: selectedTime,
          format: TARIFF_TO_FORMAT[selectedTariff] ?? "pad",
          tariffId: selectedTariff,
          tariffLabel: tariff ? t(tariff.nameKey) : null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSubmitError(data?.error ?? t("practice.booking.error.generic"));
        return;
      }
      setSent(true);
    } catch {
      setSubmitError(t("practice.booking.error.network"));
    } finally {
      setPending(false);
    }
  }

  const selectedTariffData = tariffOptions.find((opt) => opt.id === selectedTariff);

  return (
    <section id="booking" className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] rounded-full bg-orange/[0.08] blur-[120px] pointer-events-none" aria-hidden />
      <div className="absolute -left-32 top-1/4 w-[380px] h-[380px] rounded-full bg-orange/[0.04] blur-[140px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="04">
            <EditableText storageKey="practice.booking.section.label">{t("practice.booking.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[36px] font-medium text-white tracking-[-0.015em] mb-4 max-w-[520px] leading-[1.1]">
            <EditableText storageKey="practice.booking.title.lead">{t("practice.booking.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="practice.booking.title.accent">{t("practice.booking.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14.5px] text-muted-on-navy leading-[1.65] mb-10 max-w-[520px]">
            <EditableText storageKey="practice.booking.subtitle" multiline>{t("practice.booking.subtitle")}</EditableText>
          </p>
        </Reveal>

        {!isAuthed ? (
          <Reveal delay={80}>
            <EnrollLoginGate
              title={t("practice.booking.login.title")}
              next="/services/practice#booking"
            />
          </Reveal>
        ) : sent ? (
          <Reveal>
            <SuccessCard
              instructor={selectedInstructor!}
              day={selectedDay}
              time={selectedTime!}
              tariff={selectedTariffData!}
              dayLabels={dayLabels}
              dayDates={dayDates}
            />
          </Reveal>
        ) : (
          <>
            <Reveal delay={100}>
              <InstructorPicker
                selectedId={selectedInstructorId}
                onSelect={selectInstructor}
                onClear={clearInstructor}
                instructors={instructors}
              />
            </Reveal>

            {selectedInstructor && (
              <div className="mt-6">
                <Reveal delay={50}>
                  <Calendar
                    instructor={selectedInstructor}
                    selectedDay={selectedDay}
                    onSelectDay={(d) => {
                      setSelectedDay(d);
                      setSelectedTime(null);
                    }}
                    slots={slots}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                    dayLabels={dayLabels}
                    dayDates={dayDates}
                    weekLabels={weekLabels}
                  />
                </Reveal>
              </div>
            )}

            {selectedInstructor && selectedTime && (
              <div className="mt-6">
                <Reveal delay={50}>
                  <TariffPicker selected={selectedTariff} onSelect={setSelectedTariff} />
                </Reveal>
              </div>
            )}

            {selectedInstructor && selectedTime && selectedTariff && (
              <div className="mt-6">
                <Reveal delay={50}>
                  <ContactForm
                    onSubmit={handleSubmit}
                    instructor={selectedInstructor}
                    day={selectedDay}
                    time={selectedTime}
                    tariff={selectedTariffData!}
                    pending={pending}
                    error={submitError}
                    dayLabels={dayLabels}
                    dayDates={dayDates}
                  />
                </Reveal>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function InstructorPicker({
  selectedId,
  onSelect,
  onClear,
  instructors,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
  onClear: () => void;
  instructors: Instructor[];
}) {
  const { t } = useT();
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<"ru" | "ge" | "en" | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const langOptions: { value: "ru" | "ge" | "en" | null; label: string }[] = [
    { value: null, label: t("practice.booking.lang.all") },
    { value: "ru", label: "ru" },
    { value: "ge", label: "ge" },
    { value: "en", label: "en" },
  ];

  const filtered = useMemo(() => {
    return instructors.filter((inst) => {
      if (search && !inst.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (langFilter && !inst.languages.includes(langFilter)) return false;
      return true;
    });
  }, [instructors, search, langFilter]);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase">{t("practice.booking.step1")}</div>
        <div className="flex items-center gap-3">
          {selectedId && (
            <button
              onClick={onClear}
              className="inline-flex items-center gap-1.5 text-[11.5px] text-muted-on-navy hover:text-white transition-colors"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
              {t("practice.booking.reset")}
            </button>
          )}
          <div className="text-[11.5px] text-muted-on-navy">
            {t("practice.booking.filteredCount", { shown: filtered.length, total: instructors.length })}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-on-navy/60"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("practice.booking.searchPlaceholder")}
            className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-3.5 py-2.5 text-[13.5px] text-white placeholder:text-muted-on-navy/50 outline-none transition-colors focus:border-orange/50 focus:bg-white/[0.06]"
          />
        </div>

        <div className="flex gap-1 bg-white/[0.04] border border-white/10 rounded-lg p-1">
          {langOptions.map((opt) => {
            const isActive = langFilter === opt.value;
            return (
              <button
                key={opt.label}
                onClick={() => setLangFilter(opt.value)}
                className={`px-3 py-1.5 rounded-md text-[12px] tracking-[0.04em] transition-all ${
                  isActive ? "bg-orange text-white" : "text-muted-on-navy hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white/[0.03] border border-white/10 rounded-xl p-8 text-center">
          <div className="text-[14px] text-white mb-1">{t("practice.booking.empty.title")}</div>
          <p className="text-[12.5px] text-muted-on-navy">{t("practice.booking.empty.desc")}</p>
        </div>
      ) : (
        <div className="flex items-stretch gap-2 sm:gap-3">
          {filtered.length > 3 && (
            <button
              onClick={() => scroll("left")}
              aria-label={t("practice.booking.prev")}
              className="shrink-0 self-center w-10 h-10 rounded-full bg-white/[0.04] border border-white/15 text-white grid place-items-center hover:bg-white/[0.08] hover:border-white/30 hover:text-orange-soft active:scale-95 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
          )}

          <div
            ref={scrollRef}
            className="flex-1 min-w-0 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-3">
              {filtered.map((inst) => {
                const isSelected = inst.id === selectedId;
                return (
                  <button
                    key={inst.id}
                    onClick={() => onSelect(inst.id)}
                    className={`snap-start shrink-0 w-[260px] flex items-center gap-3.5 p-4 rounded-xl border transition-all duration-300 ${
                      isSelected
                        ? "bg-white/[0.06] border-orange/50 shadow-[0_8px_24px_-12px_rgba(249,115,22,0.4)]"
                        : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
                    }`}
                  >
                    {inst.avatarUrl ? (
                      <img
                        src={inst.avatarUrl}
                        alt={inst.name}
                        className="shrink-0 w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className={`shrink-0 w-12 h-12 rounded-full grid place-items-center text-[14px] font-medium ${
                          avatarColors[inst.avatarColor]
                        }`}
                      >
                        {inst.initials}
                      </span>
                    )}
                    <div className="text-left flex-1 min-w-0">
                      <div className="text-[13.5px] font-medium text-white truncate">
                        {inst.name.split(" ")[0]} {inst.name.split(" ")[1]?.[0]}.
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                          <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                        </svg>
                        <span className="text-[12px] text-white">{inst.rating}</span>
                        <span className="text-[11px] text-muted-on-navy">· {inst.reviewsCount}</span>
                      </div>
                      <div className="text-[10px] text-muted-on-navy/80 tracking-[0.16em] uppercase mt-1">
                        {inst.languages.join(" · ")}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="shrink-0 w-5 h-5 rounded-full bg-orange grid place-items-center">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" aria-hidden>
                          <path d="M5 12l5 5L20 6" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {filtered.length > 3 && (
            <button
              onClick={() => scroll("right")}
              aria-label={t("practice.booking.next")}
              className="shrink-0 self-center w-10 h-10 rounded-full bg-white/[0.04] border border-white/15 text-white grid place-items-center hover:bg-white/[0.08] hover:border-white/30 hover:text-orange-soft active:scale-95 transition-all"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function Calendar({
  instructor,
  selectedDay,
  onSelectDay,
  slots,
  selectedTime,
  onSelectTime,
  dayLabels,
  dayDates,
  weekLabels,
}: {
  instructor: Instructor;
  selectedDay: number;
  onSelectDay: (d: number) => void;
  slots: { time: string; available: boolean }[];
  selectedTime: string | null;
  onSelectTime: (t: string) => void;
  dayLabels: string[];
  dayDates: string[];
  weekLabels: string[];
}) {
  const { t } = useT();
  const [view, setView] = useState<"week" | "month">("week");
  const [weekIndex, setWeekIndex] = useState(Math.floor(selectedDay / 7));

  const weekStart = weekIndex * 7;
  const weekDays = Array.from({ length: 7 }, (_, i) => weekStart + i);

  const canPrev = weekIndex > 0;
  const canNext = weekIndex < 3;

  function selectDayFromMonth(dayIdx: number) {
    onSelectDay(dayIdx);
    setWeekIndex(Math.floor(dayIdx / 7));
    setView("week");
  }

  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">{t("practice.booking.step2")}</div>
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/[0.06]">
          {instructor.avatarUrl ? (
            <img
              src={instructor.avatarUrl}
              alt={instructor.name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span
              className={`w-10 h-10 rounded-full grid place-items-center text-[13px] font-medium ${
                avatarColors[instructor.avatarColor]
              }`}
            >
              {instructor.initials}
            </span>
          )}
          <div className="flex-1">
            <div className="text-[14px] font-medium text-white">{instructor.name}</div>
            <div className="text-[11.5px] text-muted-on-navy">
              {instructor.car} · {t("practice.booking.experience", { n: instructor.experienceYears })}
            </div>
          </div>
          <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase">
            {instructor.languages.join(" · ")}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
          <div className="inline-flex gap-1 bg-white/[0.04] border border-white/10 rounded-lg p-1">
            <button
              onClick={() => setView("week")}
              className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                view === "week" ? "bg-orange text-white" : "text-muted-on-navy hover:text-white"
              }`}
            >
              {t("practice.booking.viewWeek")}
            </button>
            <button
              onClick={() => setView("month")}
              className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${
                view === "month" ? "bg-orange text-white" : "text-muted-on-navy hover:text-white"
              }`}
            >
              {t("practice.booking.viewMonth")}
            </button>
          </div>

          {view === "week" && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => canPrev && setWeekIndex(weekIndex - 1)}
                disabled={!canPrev}
                aria-label={t("practice.booking.prevWeek")}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 text-white grid place-items-center hover:bg-white/[0.08] hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <span className="text-[12px] text-white min-w-[90px] text-center tabular-nums">
                {weekLabels[weekIndex]}
              </span>
              <button
                onClick={() => canNext && setWeekIndex(weekIndex + 1)}
                disabled={!canNext}
                aria-label={t("practice.booking.nextWeek")}
                className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 text-white grid place-items-center hover:bg-white/[0.08] hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {view === "week" ? (
          <div className="grid grid-cols-7 gap-1.5 mb-5">
            {weekDays.map((i) => {
              const isSelected = selectedDay === i;
              return (
                <button
                  key={i}
                  onClick={() => onSelectDay(i)}
                  className={`px-2 py-2.5 rounded-lg text-center transition-all ${
                    isSelected
                      ? "bg-orange text-white"
                      : "bg-white/[0.04] border border-white/10 text-muted-on-navy hover:bg-white/[0.07] hover:text-white"
                  }`}
                >
                  <div className="text-[11.5px] font-medium leading-tight">{dayLabels[i]}</div>
                  <div className={`text-[10.5px] mt-0.5 ${isSelected ? "text-white/80" : "text-muted-on-navy/70"}`}>
                    {dayDates[i]}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mb-5">
            <div className="grid grid-cols-7 gap-1.5 mb-2 text-[10.5px] text-muted-on-navy/70 tracking-[0.1em] uppercase text-center">
              <div>{t("date.weekday.1")}</div>
              <div>{t("date.weekday.2")}</div>
              <div>{t("date.weekday.3")}</div>
              <div>{t("date.weekday.4")}</div>
              <div>{t("date.weekday.5")}</div>
              <div>{t("date.weekday.6")}</div>
              <div>{t("date.weekday.0")}</div>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 28 }, (_, i) => {
                const isSelected = selectedDay === i;
                return (
                  <button
                    key={i}
                    onClick={() => selectDayFromMonth(i)}
                    className={`aspect-square rounded-lg text-center grid place-items-center transition-all ${
                      isSelected
                        ? "bg-orange text-white"
                        : "bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08] hover:border-white/20"
                    }`}
                  >
                    <div>
                      <div className="text-[13px] font-medium leading-tight">
                        {dayDates[i].split(" ")[0]}
                      </div>
                      <div className={`text-[9px] mt-0.5 ${isSelected ? "text-white/70" : "text-muted-on-navy/60"} tracking-[0.05em] uppercase`}>
                        {dayDates[i].split(" ")[1]}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            return (
              <button
                key={slot.time}
                onClick={() => slot.available && onSelectTime(slot.time)}
                disabled={!slot.available}
                className={`relative px-3 py-2.5 rounded-lg text-[13.5px] font-medium border transition-all ${
                  isSelected
                    ? "bg-orange border-orange text-white"
                    : slot.available
                    ? "bg-white/[0.03] border-white/10 text-white hover:bg-white/[0.06] hover:border-white/20"
                    : "bg-white/[0.01] border-white/[0.04] text-muted-on-navy/40 line-through cursor-not-allowed"
                }`}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TariffPicker({
  selected,
  onSelect,
}: {
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useT();
  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">{t("practice.booking.step3")}</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {tariffOptions.map((opt) => {
          const isSelected = selected === opt.id;
          const isPopular = opt.id === "combo";
          return (
            <button
              key={opt.id}
              onClick={() => onSelect(opt.id)}
              className={`relative text-left p-4 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? "bg-white/[0.06] border-orange/50 shadow-[0_8px_24px_-12px_rgba(249,115,22,0.4)]"
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
              }`}
            >
              {isPopular && (
                <span className="absolute top-3 right-3 text-[9.5px] text-orange-soft tracking-[0.14em] uppercase">
                  {t("practice.booking.popular")}
                </span>
              )}

              <div className="text-[10.5px] text-muted-on-navy tracking-[0.14em] uppercase mb-1.5">
                {t("practice.booking.lessonsCount", { n: opt.lessons })}
              </div>
              <div className="text-[15px] font-medium text-white mb-2">{t(opt.nameKey)}</div>
              <div className="text-[20px] font-medium text-orange-soft leading-none">{opt.price}</div>

              {isSelected && (
                <span className="absolute bottom-3 right-3 w-5 h-5 rounded-full bg-orange grid place-items-center">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" aria-hidden>
                    <path d="M5 12l5 5L20 6" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContactForm({
  onSubmit,
  instructor,
  day,
  time,
  tariff,
  pending,
  error,
  dayLabels,
  dayDates,
}: {
  onSubmit: (e: React.FormEvent) => void;
  instructor: Instructor;
  day: number;
  time: string;
  tariff: { id: string; nameKey: string; price: string; lessons: string };
  pending: boolean;
  error: string | null;
  dayLabels: string[];
  dayDates: string[];
}) {
  const { t } = useT();
  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">{t("practice.booking.step4")}</div>
      <form onSubmit={onSubmit} className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3.5 bg-orange/[0.08] border border-orange/30 rounded-lg mb-5 text-[12.5px]">
          <span className="flex items-center gap-2 text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" aria-hidden>
              <path d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-orange-soft">{dayLabels[day]} · {dayDates[day]}, {time}</span>
          </span>
          <span className="text-muted-on-navy">·</span>
          <span className="text-white">{instructor.name}</span>
          <span className="text-muted-on-navy">·</span>
          <span className="text-white">
            {t(tariff.nameKey)} <span className="text-muted-on-navy">({tariff.price})</span>
          </span>
        </div>

        <p className="text-[13px] text-muted-on-navy leading-[1.6] mb-4">
          {t("practice.booking.disclaimer")}
        </p>

        {error && (
          <div className="mb-4 text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-[11.5px] text-muted-on-navy/80 leading-[1.55] max-w-[320px]">
            {t("practice.booking.confirmNote")}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center gap-2 bg-orange text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-all hover:bg-[#EA670F] hover:translate-x-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? t("practice.booking.sending") : t("practice.booking.submit")}
            {!pending && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function SuccessCard({
  instructor,
  day,
  time,
  tariff,
  dayLabels,
  dayDates,
}: {
  instructor: Instructor;
  day: number;
  time: string;
  tariff: { id: string; nameKey: string; price: string };
  dayLabels: string[];
  dayDates: string[];
}) {
  const { t } = useT();
  const when = `${dayLabels[day]} · ${dayDates[day]}, ${time}`;
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 sm:p-10 text-center max-w-[680px] mx-auto">
      <div className="mx-auto w-16 h-16 rounded-full bg-orange/15 grid place-items-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" aria-hidden>
          <path d="M5 12l5 5L20 6" />
        </svg>
      </div>
      <div className="text-[22px] sm:text-[26px] font-medium text-white mb-2">
        {t("practice.booking.success.title")}
      </div>
      <p className="text-[14px] text-muted-on-navy max-w-[480px] mx-auto leading-[1.65] mb-6">
        {t("practice.booking.success.desc", { instr: instructor.name, when, tariff: t(tariff.nameKey) })}
      </p>
      <L
        href="/cabinet/lessons"
        className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/15 hover:bg-white/[0.08] text-white text-[13px] px-4 py-2 rounded-lg transition-colors"
      >
        {t("practice.booking.success.cta")}
      </L>
    </div>
  );
}
