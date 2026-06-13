"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { instructors, type Instructor } from "@/lib/instructors/data";

const avatarColors: Record<Instructor["avatarColor"], string> = {
  indigo: "bg-indigo-500/20 text-indigo-200",
  orange: "bg-orange/20 text-orange-soft",
  violet: "bg-violet-500/20 text-violet-200",
  emerald: "bg-emerald-500/20 text-emerald-200",
  rose: "bg-rose-500/20 text-rose-200",
};

export function InstructorsGrid() {
  const [selected, setSelected] = useState<Instructor | null>(null);

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <>
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
          <Reveal>
            <SectionLabel num="02">Команда</SectionLabel>
            <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
              Все, кто <span className="text-orange">учит</span>
            </h2>
            <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
              Кликни по карточке — расскажу про каждого подробно: характер, стиль преподавания, отзывы выпускников.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {instructors.map((inst, i) => (
              <Reveal key={inst.id} delay={i * 50}>
                <button
                  onClick={() => setSelected(inst)}
                  className="group relative w-full text-left bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.08] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                  <div className="relative flex items-center gap-3.5 mb-4">
                    <span className={`shrink-0 w-14 h-14 rounded-full grid place-items-center text-[15px] font-medium ${avatarColors[inst.avatarColor]}`}>
                      {inst.initials}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[15px] font-medium text-white truncate group-hover:text-orange-soft transition-colors">
                        {inst.name}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                          <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                        </svg>
                        <span className="text-[12.5px] text-white font-medium">{inst.rating}</span>
                        <span className="text-[11px] text-muted-on-navy">· {inst.reviewsCount} отзывов</span>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex flex-wrap gap-1.5 mb-4">
                    {inst.languages.map((l) => (
                      <span key={l} className="text-[10px] font-mono text-orange-soft tracking-[0.2em] uppercase bg-orange/10 px-2 py-0.5 rounded-full">
                        {l}
                      </span>
                    ))}
                  </div>

                  <div className="relative space-y-1 text-[12.5px] text-muted-on-navy mb-4">
                    <div className="flex items-center gap-2">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7" aria-hidden>
                        <circle cx="12" cy="12" r="9" />
                        <path d="M12 7v5l3 2" />
                      </svg>
                      Стаж {inst.experienceYears} лет
                    </div>
                    <div className="flex items-start gap-2">
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7" className="mt-0.5 shrink-0" aria-hidden>
                        <path d="M5 13l1.5-5.5A2 2 0 018.5 6h7a2 2 0 012 1.5L19 13M3 17h18M5 13v3m14-3v3" />
                      </svg>
                      {inst.car}
                    </div>
                  </div>

                  <div className="relative pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11.5px] text-muted-on-navy">
                    <span>Подробнее</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FDBA74" strokeWidth="2" className="-translate-x-1 group-hover:translate-x-0 transition-transform" aria-hidden>
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {selected && <InstructorModal instructor={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function InstructorModal({ instructor, onClose }: { instructor: Instructor; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-modal-fade">
      <button
        onClick={onClose}
        aria-label="Закрыть"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-navy border border-white/15 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-modal-rise">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-orange/[0.15] rounded-full blur-[80px] pointer-events-none" aria-hidden />

        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 text-white grid place-items-center hover:bg-white/[0.1] hover:border-white/30 active:scale-95 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 relative">
          <div className="flex items-start gap-5 mb-6 pr-10">
            <span className={`shrink-0 w-20 h-20 rounded-full grid place-items-center text-[22px] font-medium ${avatarColors[instructor.avatarColor]}`}>
              {instructor.initials}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[22px] sm:text-[24px] font-medium text-white leading-tight mb-2">
                {instructor.name}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                    <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                  </svg>
                  <span className="text-[14px] text-white font-medium">{instructor.rating}</span>
                  <span className="text-[12.5px] text-muted-on-navy">· {instructor.reviewsCount} отзывов</span>
                </div>
                <span className="text-muted-on-navy/50">·</span>
                <div className="flex gap-1.5">
                  {instructor.languages.map((l) => (
                    <span key={l} className="text-[10px] font-mono text-orange-soft tracking-[0.2em] uppercase bg-orange/10 px-2 py-0.5 rounded-full">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Stat
              label="Стаж"
              value={`${instructor.experienceYears} лет`}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              }
            />
            <Stat
              label="Машина"
              value={instructor.car}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M5 13l1.5-5.5A2 2 0 018.5 6h7a2 2 0 012 1.5L19 13M3 17h18" />
                </svg>
              }
            />
          </div>

          {instructor.bio && (
            <div className="mb-7">
              <div className="text-[11px] text-orange-soft tracking-[0.16em] uppercase mb-2">О себе</div>
              <p className="text-[14px] text-white leading-[1.65]">{instructor.bio}</p>
            </div>
          )}

          {instructor.reviews && instructor.reviews.length > 0 && (
            <div>
              <div className="text-[11px] text-orange-soft tracking-[0.16em] uppercase mb-3">
                Отзывы · {instructor.reviews.length}
              </div>
              <div className="space-y-3">
                {instructor.reviews.map((r, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <p className="text-[13.5px] text-white leading-[1.6] mb-3">«{r.text}»</p>
                    <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06]">
                      <span className="w-7 h-7 rounded-full grid place-items-center bg-white/[0.06] text-[11px] text-muted-on-navy font-medium">
                        {r.initials}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-medium text-white">{r.author}</span>
                        <span className="text-[11px] text-muted-on-navy">· {r.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-navy">
          <Link
            href={`/services/practice#booking`}
            className="block w-full text-center bg-orange hover:bg-[#EA670F] text-white py-3 rounded-lg text-[14px] font-medium transition-all hover:translate-y-[-1px]"
          >
            Записаться к {instructor.name.split(" ")[0]}
          </Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-lg px-3.5 py-3">
      <div className="text-[10px] text-muted-on-navy tracking-[0.14em] uppercase mb-1.5">{label}</div>
      <div className="flex items-start gap-2 text-orange-soft">
        {icon}
        <span className="text-[13px] text-white leading-tight">{value}</span>
      </div>
    </div>
  );
}
