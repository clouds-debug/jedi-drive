"use client";

import { useState } from "react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const streamOptions = [
  { value: "27", label: "Поток №27 · 11 марта (текущий)" },
  { value: "28", label: "Поток №28 · 15 апреля (ru)" },
  { value: "29", label: "Поток №29 · 20 мая (ge)" },
  { value: "any", label: "Подобрать удобный" },
];

const formatOptions = [
  { value: "group", label: "Группа онлайн" },
  { value: "solo", label: "Индивидуально" },
];

export function TheoryEnroll() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [stream, setStream] = useState("27");
  const [format, setFormat] = useState("group");
  const [comment, setComment] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !contact.trim()) return;
    setSent(true);
  }

  return (
    <section id="enroll" className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] rounded-full bg-orange/[0.08] blur-[120px] pointer-events-none" aria-hidden />
      <div className="absolute -left-32 top-1/4 w-[380px] h-[380px] rounded-full bg-orange/[0.04] blur-[140px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-5">
            <Reveal>
              <SectionLabel num="04">Запись</SectionLabel>
              <h2 className="text-[28px] sm:text-[36px] font-medium text-white tracking-[-0.015em] mb-4 max-w-[480px] leading-[1.1]">
                Закрепи <span className="text-orange">место</span>
              </h2>
              <p className="text-[14.5px] text-muted-on-navy leading-[1.65] mb-8 max-w-[420px]">
                Оставь заявку — перезвоним в течение часа, ответим на вопросы, поможем выбрать поток и формат.
              </p>
            </Reveal>

            <Reveal delay={100}>
              <ul className="space-y-3.5">
                <li className="flex items-start gap-3 text-[13.5px] text-muted-on-navy">
                  <Check />
                  <span>Без предоплаты — сначала пробное занятие, потом решаешь</span>
                </li>
                <li className="flex items-start gap-3 text-[13.5px] text-muted-on-navy">
                  <Check />
                  <span>Заявка ни к чему не обязывает</span>
                </li>
                <li className="flex items-start gap-3 text-[13.5px] text-muted-on-navy">
                  <Check />
                  <span>Можно перенести поток если не подойдёт дата</span>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="lg:col-span-7">
            <Reveal delay={150}>
              <form
                onSubmit={handleSubmit}
                className="bg-white/[0.04] border border-white/10 rounded-[var(--radius-card)] p-6 sm:p-7 backdrop-blur-sm"
              >
                {!sent ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <Field label="Имя" value={name} onChange={setName} placeholder="Как тебя зовут" />
                      <Field label="Телефон или email" value={contact} onChange={setContact} placeholder="+995 / @ / e-mail" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <Select label="Поток" value={stream} onChange={setStream} options={streamOptions} />
                      <Select label="Формат" value={format} onChange={setFormat} options={formatOptions} />
                    </div>

                    <Field
                      label="Комментарий"
                      value={comment}
                      onChange={setComment}
                      placeholder="Что-то ещё хочешь сказать?"
                      textarea
                    />

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-5">
                      <p className="text-[11.5px] text-muted-on-navy/80 leading-[1.55] max-w-[280px]">
                        Отправляя, ты соглашаешься с обработкой контактных данных для ответа.
                      </p>
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 bg-orange text-white px-6 py-3 rounded-[var(--radius-btn)] text-[14px] font-medium transition-all hover:bg-[#EA670F] hover:translate-x-0.5"
                      >
                        Отправить заявку
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <div className="mx-auto w-14 h-14 rounded-full bg-orange/15 grid place-items-center mb-5">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
                        <path d="M5 12l5 5L20 6" />
                      </svg>
                    </div>
                    <div className="text-white text-[20px] font-medium mb-2">
                      Заявка принята, {name || "ученик"}!
                    </div>
                    <p className="text-[14px] text-muted-on-navy max-w-[360px] mx-auto leading-[1.6]">
                      Свяжемся с тобой в течение часа в рабочее время. Если срочно — телеграм{" "}
                      <a href="https://t.me/jedidrive" className="text-orange-soft underline underline-offset-2">@jedidrive</a>.
                    </p>
                  </div>
                )}
              </form>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Check() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" className="mt-1 shrink-0" aria-hidden>
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  textarea?: boolean;
}) {
  const baseClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-[var(--radius-btn)] px-3.5 py-2.5 text-[14px] text-white placeholder:text-muted-on-navy/50 outline-none transition-colors focus:border-orange/50 focus:bg-white/[0.06]";
  return (
    <label className="block">
      <span className="block text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={baseClass + " resize-none"}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={baseClass}
        />
      )}
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">{label}</span>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white/[0.04] border border-white/10 rounded-[var(--radius-btn)] px-3.5 py-2.5 pr-9 text-[14px] text-white outline-none transition-colors focus:border-orange/50 focus:bg-white/[0.06] cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-navy text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-on-navy"
          aria-hidden
        >
          <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    </label>
  );
}
