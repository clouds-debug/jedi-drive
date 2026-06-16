"use client";

import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { useT } from "@/lib/i18n/client";

const standards = [
  {
    key: "routes",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    key: "exp",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    key: "calm",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 12c0 4-4 8-9 8-1.5 0-3-.3-4.3-.9L3 21l1.9-4.7C4.3 15.1 4 13.6 4 12c0-4 4-8 9-8s8 4 8 8z" />
        <circle cx="9" cy="12" r="0.5" fill="currentColor" />
        <circle cx="12" cy="12" r="0.5" fill="currentColor" />
        <circle cx="15" cy="12" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "match",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="9" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 7a3 3 0 010 6M21 20c0-2.7-1.8-5-4-5.7" />
      </svg>
    ),
  },
  {
    key: "debrief",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 12c0 4-4 8-9 8-1.5 0-3-.3-4.3-.9L3 21l1.9-4.7C4.3 15.1 4 13.6 4 12c0-4 4-8 9-8s8 4 8 8z" />
        <path d="M8 11l3 3 5-5" />
      </svg>
    ),
  },
  {
    key: "langs",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
      </svg>
    ),
  },
];

export function InstructorsStandards() {
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
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="01">
            <EditableText storageKey="instructors.standards.section.label">{t("instructors.standards.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="instructors.standards.title.lead">{t("instructors.standards.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="instructors.standards.title.accent">{t("instructors.standards.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            <EditableText storageKey="instructors.standards.subtitle" multiline>{t("instructors.standards.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {standards.map((s, i) => {
            const base = `instructors.standards.${s.key}`;
            return (
              <Reveal key={s.key} delay={i * 70}>
                <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1">
                  <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
                  <div className="relative flex items-start gap-4">
                    <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
                      {s.icon}
                    </span>
                    <div>
                      <div className="text-[16px] font-medium text-white mb-1.5">
                        <EditableText storageKey={`${base}.title`}>{t(`${base}.title`)}</EditableText>
                      </div>
                      <p className="text-[13px] text-muted-on-navy leading-[1.6]">
                        <EditableText storageKey={`${base}.desc`} multiline>{t(`${base}.desc`)}</EditableText>
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
