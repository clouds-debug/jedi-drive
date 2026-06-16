"use client";

import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { EditableText } from "./content/EditableText";
import { useT } from "@/lib/i18n/client";

const blocks = [
  { key: "w1", topicsCount: 3 },
  { key: "w2", topicsCount: 3 },
  { key: "w3", topicsCount: 3 },
  { key: "w4", topicsCount: 3 },
  { key: "w5", topicsCount: 3 },
  { key: "w6", topicsCount: 3 },
];

export function TheoryProgram() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "30px 30px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="02">
            <EditableText storageKey="theory.program.section.label">{t("theory.program.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="theory.program.title.lead">{t("theory.program.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="theory.program.title.accent">{t("theory.program.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            <EditableText storageKey="theory.program.subtitle" multiline>{t("theory.program.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {blocks.map((block, i) => {
            const base = `theory.program.${block.key}`;
            return (
              <Reveal key={block.key} delay={i * 80}>
                <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:border-l-orange hover:-translate-y-1">
                  <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.08] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                  <div className="relative flex items-start justify-between mb-4">
                    <span className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase">
                      <EditableText storageKey={`${base}.week`}>{t(`${base}.week`)}</EditableText>
                    </span>
                    <span className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase">
                      <EditableText storageKey={`${base}.lessons`}>{t(`${base}.lessons`)}</EditableText>
                    </span>
                  </div>

                  <h3 className="relative text-[17px] font-medium text-white mb-4 leading-snug">
                    <EditableText storageKey={`${base}.title`}>{t(`${base}.title`)}</EditableText>
                  </h3>

                  <ul className="relative space-y-1.5">
                    {Array.from({ length: block.topicsCount }).map((_, ti) => (
                      <li key={ti} className="flex items-start gap-2 text-[13px] text-muted-on-navy">
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#F97316"
                          strokeWidth="2.5"
                          className="mt-1.5 shrink-0"
                          aria-hidden
                        >
                          <path d="M5 12l5 5L20 6" />
                        </svg>
                        <EditableText storageKey={`${base}.topic.${ti}`}>{t(`${base}.topic.${ti}`)}</EditableText>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
