"use client";

import { useMemo, useRef, useState } from "react";
import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { getSlotsForDay, instructors, type Instructor } from "@/lib/instructors/data";
import { tariffOptions } from "./PracticePricing";

const avatarColors: Record<Instructor["avatarColor"], string> = {
  indigo: "bg-indigo-500/20 text-indigo-200",
  orange: "bg-orange/20 text-orange-soft",
  violet: "bg-violet-500/20 text-violet-200",
  emerald: "bg-emerald-500/20 text-emerald-200",
  rose: "bg-rose-500/20 text-rose-200",
};

const dayLabels = [
  "Сегодня", "Завтра", "Ср", "Чт", "Пт", "Сб", "Вс",
  "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс",
  "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс",
  "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс",
];

const dayDates = [
  "18 мар", "19 мар", "20 мар", "21 мар", "22 мар", "23 мар", "24 мар",
  "25 мар", "26 мар", "27 мар", "28 мар", "29 мар", "30 мар", "31 мар",
  "1 апр", "2 апр", "3 апр", "4 апр", "5 апр", "6 апр", "7 апр",
  "8 апр", "9 апр", "10 апр", "11 апр", "12 апр", "13 апр", "14 апр",
];

const langOptions: { value: "ru" | "ge" | "en" | null; label: string }[] = [
  { value: null, label: "Все" },
  { value: "ru", label: "ru" },
  { value: "ge", label: "ge" },
  { value: "en", label: "en" },
];

export function PracticeBooking() {
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTariff, setSelectedTariff] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  const selectedInstructor = useMemo(
    () => instructors.find((i) => i.id === selectedInstructorId) || null,
    [selectedInstructorId]
  );

  const slots = useMemo(
    () => (selectedInstructorId ? getSlotsForDay(selectedInstructorId, selectedDay) : []),
    [selectedInstructorId, selectedDay]
  );

  function selectInstructor(id: string) {
    setSelectedInstructorId(id);
    setSelectedTime(null);
    setSelectedDay(0);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedInstructor || !selectedTime || !selectedTariff || !name.trim() || !contact.trim()) return;
    setSent(true);
  }

  const selectedTariffData = tariffOptions.find((t) => t.id === selectedTariff);

  return (
    <section id="booking" className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] rounded-full bg-orange/[0.08] blur-[120px] pointer-events-none" aria-hidden />
      <div className="absolute -left-32 top-1/4 w-[380px] h-[380px] rounded-full bg-orange/[0.04] blur-[140px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="04">Запись</SectionLabel>
          <h2 className="text-[28px] sm:text-[36px] font-medium text-white tracking-[-0.015em] mb-4 max-w-[520px] leading-[1.1]">
            Выбери инструктора и <span className="text-orange">время</span>
          </h2>
          <p className="text-[14.5px] text-muted-on-navy leading-[1.65] mb-10 max-w-[520px]">
            Запись идёт прямо в календарь инструктора. После выбора слота инструктор получит уведомление и подтвердит занятие.
          </p>
        </Reveal>

        {sent ? (
          <Reveal>
            <SuccessCard
              instructor={selectedInstructor!}
              day={selectedDay}
              time={selectedTime!}
              tariff={selectedTariffData!}
              name={name}
            />
          </Reveal>
        ) : (
          <>
            <Reveal delay={100}>
              <InstructorPicker selectedId={selectedInstructorId} onSelect={selectInstructor} />
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
                    name={name}
                    contact={contact}
                    onNameChange={setName}
                    onContactChange={setContact}
                    onSubmit={handleSubmit}
                    instructor={selectedInstructor}
                    day={selectedDay}
                    time={selectedTime}
                    tariff={selectedTariffData!}
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
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [langFilter, setLangFilter] = useState<"ru" | "ge" | "en" | null>(null);

  const filtered = useMemo(() => {
    return instructors.filter((inst) => {
      if (search && !inst.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (langFilter && !inst.languages.includes(langFilter)) return false;
      return true;
    });
  }, [search, langFilter]);

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-3">
        <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase">Шаг 1 · Инструктор</div>
        <div className="text-[11.5px] text-muted-on-navy">
          {filtered.length} из {instructors.length}
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
            placeholder="Найти по имени"
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
          <div className="text-[14px] text-white mb-1">Никого не нашли</div>
          <p className="text-[12.5px] text-muted-on-navy">Попробуй другой запрос или сбрось фильтр языка.</p>
        </div>
      ) : (
        <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-6 px-6 lg:-mx-10 lg:px-10 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
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
                  <span
                    className={`shrink-0 w-12 h-12 rounded-full grid place-items-center text-[14px] font-medium ${
                      avatarColors[inst.avatarColor]
                    }`}
                  >
                    {inst.initials}
                  </span>
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
}: {
  instructor: Instructor;
  selectedDay: number;
  onSelectDay: (d: number) => void;
  slots: { time: string; available: boolean }[];
  selectedTime: string | null;
  onSelectTime: (t: string) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollWeek(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -280 : 280, behavior: "smooth" });
  }

  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">Шаг 2 · Дата и время</div>
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/[0.06]">
          <span
            className={`w-10 h-10 rounded-full grid place-items-center text-[13px] font-medium ${
              avatarColors[instructor.avatarColor]
            }`}
          >
            {instructor.initials}
          </span>
          <div className="flex-1">
            <div className="text-[14px] font-medium text-white">{instructor.name}</div>
            <div className="text-[11.5px] text-muted-on-navy">
              {instructor.car} · стаж {instructor.experienceYears} лет
            </div>
          </div>
          <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase">
            {instructor.languages.join(" · ")}
          </div>
        </div>

        <div className="flex items-center justify-between mb-2.5">
          <div className="text-[11.5px] text-muted-on-navy tracking-[0.08em]">
            Доступные дни на {dayLabels.length / 7} недели
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => scrollWeek("left")}
              aria-label="Назад на неделю"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 text-white grid place-items-center hover:bg-white/[0.08] hover:border-white/20 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <button
              onClick={() => scrollWeek("right")}
              aria-label="Вперёд на неделю"
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/10 text-white grid place-items-center hover:bg-white/[0.08] hover:border-white/20 transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-1.5 overflow-x-auto scroll-smooth -mx-1 px-1 mb-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {dayLabels.map((label, i) => {
            const isSelected = selectedDay === i;
            return (
              <button
                key={i}
                onClick={() => onSelectDay(i)}
                className={`shrink-0 min-w-[64px] px-3 py-2.5 rounded-lg text-center transition-all ${
                  isSelected
                    ? "bg-orange text-white"
                    : "bg-white/[0.04] border border-white/10 text-muted-on-navy hover:bg-white/[0.07] hover:text-white"
                }`}
              >
                <div className="text-[11.5px] font-medium leading-tight">{label}</div>
                <div className={`text-[10.5px] mt-0.5 ${isSelected ? "text-white/80" : "text-muted-on-navy/70"}`}>
                  {dayDates[i]}
                </div>
              </button>
            );
          })}
        </div>

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
  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">Шаг 3 · Тариф</div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {tariffOptions.map((t) => {
          const isSelected = selected === t.id;
          const isPopular = t.id === "combo";
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`relative text-left p-4 rounded-xl border transition-all duration-300 ${
                isSelected
                  ? "bg-white/[0.06] border-orange/50 shadow-[0_8px_24px_-12px_rgba(249,115,22,0.4)]"
                  : "bg-white/[0.03] border-white/10 hover:bg-white/[0.05] hover:border-white/20"
              }`}
            >
              {isPopular && (
                <span className="absolute top-3 right-3 text-[9.5px] text-orange-soft tracking-[0.14em] uppercase">
                  Популярный
                </span>
              )}

              <div className="text-[10.5px] text-muted-on-navy tracking-[0.14em] uppercase mb-1.5">
                {t.lessons} занятий
              </div>
              <div className="text-[15px] font-medium text-white mb-2">{t.name}</div>
              <div className="text-[20px] font-medium text-orange-soft leading-none">{t.price}</div>

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
  name,
  contact,
  onNameChange,
  onContactChange,
  onSubmit,
  instructor,
  day,
  time,
  tariff,
}: {
  name: string;
  contact: string;
  onNameChange: (v: string) => void;
  onContactChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  instructor: Instructor;
  day: number;
  time: string;
  tariff: { id: string; name: string; price: string; lessons: string };
}) {
  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">Шаг 4 · Контакты</div>
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
            {tariff.name} <span className="text-muted-on-navy">({tariff.price})</span>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Field label="Как тебя зовут" value={name} onChange={onNameChange} placeholder="Имя" />
          <Field label="Телефон или email" value={contact} onChange={onContactChange} placeholder="+995 / @ / e-mail" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
          <p className="text-[11.5px] text-muted-on-navy/80 leading-[1.55] max-w-[320px]">
            Инструктор получит уведомление и подтвердит занятие в течение 30 минут.
          </p>
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 bg-orange text-white px-6 py-3 rounded-lg text-[14px] font-medium transition-all hover:bg-[#EA670F] hover:translate-x-0.5"
          >
            Записаться
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
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
  name,
}: {
  instructor: Instructor;
  day: number;
  time: string;
  tariff: { id: string; name: string; price: string };
  name: string;
}) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 sm:p-10 text-center max-w-[680px] mx-auto">
      <div className="mx-auto w-16 h-16 rounded-full bg-orange/15 grid place-items-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" aria-hidden>
          <path d="M5 12l5 5L20 6" />
        </svg>
      </div>
      <div className="text-[22px] sm:text-[26px] font-medium text-white mb-2">
        Заявка отправлена, {name}!
      </div>
      <p className="text-[14px] text-muted-on-navy max-w-[480px] mx-auto leading-[1.65] mb-6">
        Инструктор <span className="text-white">{instructor.name}</span> получил уведомление о записи на{" "}
        <span className="text-white">{dayLabels[day]} · {dayDates[day]}, {time}</span> · тариф{" "}
        <span className="text-white">{tariff.name}</span>. Подтвердит в течение 30 минут.
      </p>
      <div className="inline-flex items-center gap-2 text-[12px] text-muted-on-navy bg-white/[0.04] border border-white/10 px-3.5 py-2 rounded-lg">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v6l4 2" />
        </svg>
        Подтверждение придёт на твой контакт
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-2.5 text-[14px] text-white placeholder:text-muted-on-navy/50 outline-none transition-colors focus:border-orange/50 focus:bg-white/[0.06]"
      />
    </label>
  );
}
