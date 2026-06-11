"use client";

import { useMemo, useState } from "react";
import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { getSlotsForDay, instructors, type Instructor } from "@/lib/instructors/data";

const avatarColors: Record<Instructor["avatarColor"], string> = {
  indigo: "bg-indigo-500/20 text-indigo-200",
  orange: "bg-orange/20 text-orange-soft",
  violet: "bg-violet-500/20 text-violet-200",
  emerald: "bg-emerald-500/20 text-emerald-200",
  rose: "bg-rose-500/20 text-rose-200",
};

const dayLabels = ["Сегодня", "Завтра", "Ср", "Чт", "Пт", "Сб", "Вс"];
const dayDates = ["18 мар", "19 мар", "20 мар", "21 мар", "22 мар", "23 мар", "24 мар"];

export function PracticeBooking() {
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
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
    if (!selectedInstructor || !selectedTime || !name.trim() || !contact.trim()) return;
    setSent(true);
  }

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
            <SuccessCard instructor={selectedInstructor!} day={selectedDay} time={selectedTime!} name={name} />
          </Reveal>
        ) : (
          <>
            <Reveal delay={100}>
              <InstructorsRow
                selectedId={selectedInstructorId}
                onSelect={selectInstructor}
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
                  />
                </Reveal>
              </div>
            )}

            {selectedInstructor && selectedTime && (
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

function InstructorsRow({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">
        Шаг 1 · Инструктор
      </div>
      <div className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-6 px-6 lg:-mx-10 lg:px-10 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex gap-3">
          {instructors.map((inst) => {
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
                  <div className="text-[13.5px] font-medium text-white truncate">{inst.name.split(" ")[0]} {inst.name.split(" ")[1]?.[0]}.</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                      <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                    </svg>
                    <span className="text-[12px] text-white">{inst.rating}</span>
                    <span className="text-[11px] text-muted-on-navy">· {inst.reviewsCount}</span>
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
  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">
        Шаг 2 · Дата и время
      </div>
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/[0.06]">
          <span
            className={`w-10 h-10 rounded-full grid place-items-center text-[13px] font-medium ${
              avatarColors[instructor.avatarColor]
            }`}
          >
            {instructor.initials}
          </span>
          <div>
            <div className="text-[14px] font-medium text-white">{instructor.name}</div>
            <div className="text-[11.5px] text-muted-on-navy">
              {instructor.car} · стаж {instructor.experienceYears} лет
            </div>
          </div>
        </div>

        <div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 mb-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {dayLabels.map((label, i) => {
            const isSelected = selectedDay === i;
            return (
              <button
                key={i}
                onClick={() => onSelectDay(i)}
                className={`shrink-0 px-3.5 py-2.5 rounded-lg text-left transition-all ${
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

function ContactForm({
  name,
  contact,
  onNameChange,
  onContactChange,
  onSubmit,
  instructor,
  day,
  time,
}: {
  name: string;
  contact: string;
  onNameChange: (v: string) => void;
  onContactChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  instructor: Instructor;
  day: number;
  time: string;
}) {
  return (
    <div>
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase mb-3">
        Шаг 3 · Контакты
      </div>
      <form
        onSubmit={onSubmit}
        className="bg-white/[0.04] border border-white/10 rounded-2xl p-5 sm:p-7"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 bg-orange/[0.08] border border-orange/30 rounded-lg mb-5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" aria-hidden>
            <path d="M5 13l4 4L19 7" />
          </svg>
          <div className="flex-1 text-[13px] text-white">
            <span className="text-orange-soft">{dayLabels[day]} · {dayDates[day]}</span>
            <span className="text-muted-on-navy"> · </span>
            <span>{time}</span>
            <span className="text-muted-on-navy"> · </span>
            <span>{instructor.name}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <Field label="Как тебя зовут" value={name} onChange={onNameChange} placeholder="Имя" />
          <Field label="Телефон или email" value={contact} onChange={onContactChange} placeholder="+995 / @ / e-mail" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
          <p className="text-[11.5px] text-muted-on-navy/80 leading-[1.55] max-w-[300px]">
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
  name,
}: {
  instructor: Instructor;
  day: number;
  time: string;
  name: string;
}) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-8 sm:p-10 text-center max-w-[640px] mx-auto">
      <div className="mx-auto w-16 h-16 rounded-full bg-orange/15 grid place-items-center mb-5">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2" aria-hidden>
          <path d="M5 12l5 5L20 6" />
        </svg>
      </div>
      <div className="text-[22px] sm:text-[26px] font-medium text-white mb-2">
        Заявка отправлена, {name}!
      </div>
      <p className="text-[14px] text-muted-on-navy max-w-[420px] mx-auto leading-[1.65] mb-6">
        Инструктор <span className="text-white">{instructor.name}</span> получил уведомление о записи на{" "}
        <span className="text-white">{dayLabels[day]} · {dayDates[day]}, {time}</span>. Он подтвердит в течение 30 минут.
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
