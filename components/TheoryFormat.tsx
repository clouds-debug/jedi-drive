"use client";

import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { EditableText } from "./content/EditableText";
import { useT } from "@/lib/i18n/client";

const features = [
  {
    key: "zoom",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <circle cx="12" cy="10.5" r="2" />
      </svg>
    ),
  },
  {
    key: "group",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="9" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 7a3 3 0 010 6M21 20c0-2.7-1.8-5-4-5.7" />
      </svg>
    ),
  },
  {
    key: "record",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "chat",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 12a8 8 0 11-3.5-6.6L21 4l-1.4 3.5A7.96 7.96 0 0121 12z" />
        <path d="M8 12h8M8 9h5" />
      </svg>
    ),
  },
  {
    key: "sim",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    key: "hw",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <path d="M14 3v6h6M8 13l2 2 4-4" />
      </svg>
    ),
  },
];

export function TheoryFormat() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute -right-32 top-1/4 w-[460px] h-[460px] bg-orange/[0.05] rounded-full blur-[140px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="03">
            <EditableText storageKey="theory.format.section.label">{t("theory.format.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="theory.format.title.lead">{t("theory.format.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="theory.format.title.accent">{t("theory.format.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            <EditableText storageKey="theory.format.subtitle" multiline>{t("theory.format.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => {
            const titleKey = `theory.format.${f.key}.title`;
            const descKey = `theory.format.${f.key}.desc`;
            return (
              <Reveal key={f.key} delay={i * 80}>
                <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1">
                  <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                  <div className="relative flex items-start gap-4">
                    <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
                      {f.icon}
                    </span>
                    <div>
                      <div className="text-[16px] font-medium text-white mb-1.5">
                        <EditableText storageKey={titleKey}>{t(titleKey)}</EditableText>
                      </div>
                      <p className="text-[13px] text-muted-on-navy leading-[1.6]">
                        <EditableText storageKey={descKey} multiline>{t(descKey)}</EditableText>
                      </p>
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
