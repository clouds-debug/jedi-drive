"use client";

import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { useT } from "@/lib/i18n/client";

const STAT_KEYS = ["passed", "alumni", "team", "rating"];

export function AboutStats() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="02">
            <EditableText storageKey="about.stats.section.label">{t("about.stats.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="about.stats.title.lead">{t("about.stats.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="about.stats.title.accent">{t("about.stats.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            <EditableText storageKey="about.stats.subtitle" multiline>{t("about.stats.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STAT_KEYS.map((k, i) => {
            const base = `about.stats.${k}`;
            return (
              <Reveal key={k} delay={i * 90}>
                <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1">
                  <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
                  <div className="relative">
                    <div className="text-[42px] sm:text-[48px] font-medium text-white leading-none tracking-tight mb-2">
                      <EditableText storageKey={`${base}.value`}>{t(`${base}.value`)}</EditableText>
                    </div>
                    <div className="text-[14px] text-white font-medium mb-1.5">
                      <EditableText storageKey={`${base}.label`}>{t(`${base}.label`)}</EditableText>
                    </div>
                    <div className="text-[11.5px] text-muted-on-navy">
                      <EditableText storageKey={`${base}.note`}>{t(`${base}.note`)}</EditableText>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
