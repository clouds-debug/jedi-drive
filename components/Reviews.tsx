"use client";

import { useRef } from "react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const reviews = [
  {
    text: "Сдала с первого раза. Инструктор Гиоргий очень спокойный, объяснял на двух языках, чтобы я точно поняла. Спасибо!",
    name: "Анна К.",
    when: "Выпуск март 2025",
    initials: "АК",
  },
  {
    text: "Брал только практику. Площадка прямо как на экзамене, а в городе инструктор показал все маршруты МВД. Сдал с первого раза.",
    name: "Давид М.",
    when: "Выпуск январь 2026",
    initials: "ДМ",
  },
  {
    text: "Теорию проходила онлайн в группе — удобно, что не нужно было ехать в офис. Преподаватель отвечал на все глупые вопросы без раздражения.",
    name: "Мариам Г.",
    when: "Выпуск февраль 2026",
    initials: "МГ",
  },
  {
    text: "Сначала боялся вождения в Тбилиси, но инструктор быстро снял страх. Через месяц уже спокойно ездил по центру в час пик.",
    name: "Никита В.",
    when: "Выпуск ноябрь 2025",
    initials: "НВ",
  },
  {
    text: "Брал индивидуально — собирали программу под мой график. Учился по выходным утром, всё подошло. Сдал теорию и практику подряд.",
    name: "Лука Б.",
    when: "Выпуск апрель 2026",
    initials: "ЛБ",
  },
  {
    text: "Отдельное спасибо за разбор сложных билетов. После трёх занятий с инструктором перестала путаться в приоритетах на перекрёстках.",
    name: "София Т.",
    when: "Выпуск декабрь 2025",
    initials: "СТ",
  },
];

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
    </svg>
  );
}

function ArrowButton({ dir, onClick }: { dir: "left" | "right"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={dir === "left" ? "Предыдущие отзывы" : "Следующие отзывы"}
      className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/15 text-white grid place-items-center transition-all hover:bg-white/[0.08] hover:border-white/30 hover:text-orange-soft active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

export function Reviews() {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("article");
    const step = card ? card.offsetWidth + 16 : 360;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }

  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute right-[10%] bottom-0 w-[420px] h-[320px] bg-orange/[0.06] rounded-full blur-[130px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="flex items-end justify-between gap-6 mb-10">
          <Reveal className="flex-1">
            <SectionLabel num="03">Отзывы</SectionLabel>
            <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] max-w-[540px]">
              Что говорят <span className="text-orange">выпускники</span>
            </h2>
          </Reveal>

          <Reveal delay={80} className="hidden sm:flex gap-2 shrink-0 pb-1">
            <ArrowButton dir="left" onClick={() => scroll("left")} />
            <ArrowButton dir="right" onClick={() => scroll("right")} />
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-6 px-6 lg:-mx-10 lg:px-10 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-4">
              {reviews.map((r) => (
                <article
                  key={r.name}
                  className="snap-start shrink-0 w-[300px] sm:w-[340px] lg:w-[calc((100%-32px)/3)] bg-white/[0.03] border border-white/10 rounded-[var(--radius-card)] p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20"
                >
                  <div className="flex gap-0.5 text-orange mb-4">
                    <Star /><Star /><Star /><Star /><Star />
                  </div>
                  <p className="text-[14px] text-white leading-[1.65] mb-5 min-h-[110px]">«{r.text}»</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <span className="w-9 h-9 rounded-full grid place-items-center font-medium text-[13px] bg-orange/15 text-orange-soft">
                      {r.initials}
                    </span>
                    <div>
                      <div className="text-[13px] font-medium text-white">{r.name}</div>
                      <div className="text-[11.5px] text-muted-on-navy">{r.when}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="sm:hidden flex gap-2 mt-6 justify-center">
          <ArrowButton dir="left" onClick={() => scroll("left")} />
          <ArrowButton dir="right" onClick={() => scroll("right")} />
        </div>
      </div>
    </section>
  );
}
