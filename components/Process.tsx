"use client";

import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { EditableText } from "./content/EditableText";
import { useT } from "@/lib/i18n/client";

const steps = [
  { n: 1, key: "request" },
  { n: 2, key: "format" },
  { n: 3, key: "study" },
  { n: 4, key: "exam" },
];

export function Process() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute -right-32 top-1/3 w-[460px] h-[460px] bg-orange/[0.05] rounded-full blur-[140px] pointer-events-none" aria-hidden />
      <div className="absolute -left-32 bottom-1/4 w-[360px] h-[360px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="02">
            <EditableText storageKey="home.process.section.label">{t("home.process.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="home.process.section.title.lead">{t("home.process.section.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="home.process.section.title.accent">{t("home.process.section.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[540px]">
            <EditableText storageKey="home.process.section.subtitle" multiline>{t("home.process.section.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 relative">
          <div className="hidden lg:block absolute top-[22px] left-[7%] right-[7%] h-px bg-white/10" aria-hidden />
          {steps.map((step, i) => {
            const titleKey = `home.process.step.${step.key}.title`;
            const descKey = `home.process.step.${step.key}.desc`;
            return (
              <Reveal key={step.n} delay={i * 100}>
                <div className="relative">
                  <div
                    className={
                      "w-11 h-11 rounded-full grid place-items-center font-medium text-[17px] mb-3 transition-all duration-500 " +
                      (i === 0
                        ? "bg-orange text-white shadow-[0_8px_22px_-4px_rgba(249,115,22,0.6)]"
                        : "bg-white/[0.04] border-[1.5px] border-white/25 text-white")
                    }
                  >
                    {step.n}
                  </div>
                  <div className="text-[15px] font-medium text-white mb-1">
                    <EditableText storageKey={titleKey}>{t(titleKey)}</EditableText>
                  </div>
                  <div className="text-[12.5px] text-muted-on-navy leading-[1.6]">
                    <EditableText storageKey={descKey} multiline>{t(descKey)}</EditableText>
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
