"use client";

import { useRef } from "react";
import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { instructors as staticInstructors, type Instructor } from "@/lib/instructors/data";
import { L, useT } from "@/lib/i18n/client";

const avatarColors: Record<Instructor["avatarColor"], string> = {
  indigo: "bg-indigo-500/20 text-indigo-200",
  orange: "bg-orange/20 text-orange-soft",
  violet: "bg-violet-500/20 text-violet-200",
  emerald: "bg-emerald-500/20 text-emerald-200",
  rose: "bg-rose-500/20 text-rose-200",
};

type Props = {
  hiddenIds?: string[];
  extraInstructors?: Instructor[];
};

export function InstructorsPreview({ hiddenIds = [], extraInstructors = [] }: Props) {
  const { t } = useT();
  const scrollRef = useRef<HTMLDivElement>(null);
  const hidden = new Set(hiddenIds);
  const instructors: Instructor[] = [
    ...extraInstructors.filter((i) => !hidden.has(i.id)),
    ...staticInstructors.filter((i) => !hidden.has(i.id)),
  ];

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -260 : 260, behavior: "smooth" });
  }

  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="flex items-end justify-between gap-6 mb-10">
          <Reveal className="flex-1">
            <SectionLabel num="01">
              <EditableText storageKey="practice.instructors.section.label">{t("practice.instructors.section.label")}</EditableText>
            </SectionLabel>
            <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] max-w-[540px]">
              <EditableText storageKey="practice.instructors.title.lead">{t("practice.instructors.title.lead")}</EditableText>{" "}
              <span className="text-orange">
                <EditableText storageKey="practice.instructors.title.accent">{t("practice.instructors.title.accent")}</EditableText>
              </span>
            </h2>
            <p className="text-[14px] text-muted-on-navy leading-[1.65] mt-3 max-w-[480px]">
              <EditableText storageKey="practice.instructors.subtitle" multiline>{t("practice.instructors.subtitle")}</EditableText>{" "}
              <L href="/instructors" className="text-orange-soft hover:text-orange transition-colors underline underline-offset-2">
                {t("practice.instructors.fullPage")}
              </L>
              .
            </p>
          </Reveal>

          <Reveal delay={80} className="hidden sm:flex gap-2 shrink-0 pb-1">
            <ArrowButton dir="left" onClick={() => scroll("left")} label={t("common.prev")} />
            <ArrowButton dir="right" onClick={() => scroll("right")} label={t("common.next")} />
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div
            ref={scrollRef}
            className="overflow-x-auto overscroll-x-contain touch-pan-x scroll-smooth snap-x snap-mandatory -mx-6 px-6 lg:-mx-10 lg:px-10 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-3">
              {instructors.map((inst) => (
                <a
                  key={inst.id}
                  href={`#book-${inst.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.history.replaceState(null, "", `#book-${inst.id}`);
                    window.dispatchEvent(new HashChangeEvent("hashchange"));
                    document
                      .getElementById("booking")
                      ?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="group snap-start shrink-0 w-[240px] flex items-center gap-3.5 p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300 cursor-pointer"
                >
                  {inst.avatarUrl ? (
                    <img
                      src={inst.avatarUrl}
                      alt={inst.name}
                      className="shrink-0 w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <span
                      className={`shrink-0 w-14 h-14 rounded-full grid place-items-center text-[15px] font-medium ${
                        avatarColors[inst.avatarColor]
                      }`}
                    >
                      {inst.initials}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium text-white truncate group-hover:text-orange-soft transition-colors">
                      {inst.name.split(" ")[0]} {inst.name.split(" ")[1]?.[0]}.
                    </div>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                        <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                      </svg>
                      <span className="text-[12px] text-white">{inst.rating}</span>
                      <span className="text-[11px] text-muted-on-navy">· {inst.reviewsCount}</span>
                    </div>
                    <div className="text-[10px] text-muted-on-navy/80 tracking-[0.16em] uppercase mt-1.5">
                      {inst.languages.join(" · ")}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ArrowButton({ dir, onClick, label }: { dir: "left" | "right"; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/15 text-white grid place-items-center transition-all hover:bg-white/[0.08] hover:border-white/30 hover:text-orange-soft active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
