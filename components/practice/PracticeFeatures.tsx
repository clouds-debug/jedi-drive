"use client";

import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { useT } from "@/lib/i18n/client";

type Feature = { key: string; bulletsCount: number; icon: React.ReactNode };

const features: Feature[] = [
  {
    key: "fleet",
    bulletsCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 13l1.5-5.5A2 2 0 018.5 6h7a2 2 0 012 1.5L19 13M3 17h18M5 13v3m14-3v3M7 17v1.5a1.5 1.5 0 003 0V17m4 0v1.5a1.5 1.5 0 003 0V17" />
      </svg>
    ),
  },
  {
    key: "pad",
    bulletsCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="6" width="18" height="13" rx="1.5" />
        <path d="M3 11h18M7 6V4M17 6V4" />
      </svg>
    ),
  },
  {
    key: "loc",
    bulletsCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    key: "ppl",
    bulletsCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="5" />
        <path d="M8 13l-2 8 6-3 6 3-2-8" />
      </svg>
    ),
  },
  {
    key: "routes",
    bulletsCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
      </svg>
    ),
  },
  {
    key: "sched",
    bulletsCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
];

export function PracticeFeatures() {
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
          <SectionLabel num="02">
            <EditableText storageKey="practice.features.section.label">{t("practice.features.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="practice.features.title.lead">{t("practice.features.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="practice.features.title.accent">{t("practice.features.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            <EditableText storageKey="practice.features.subtitle" multiline>{t("practice.features.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => {
            const base = `practice.features.${f.key}`;
            return (
              <Reveal key={f.key} delay={i * 70}>
                <div className="group relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1 flex flex-col">
                  <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                  <div className="relative flex items-start gap-4 mb-3">
                    <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
                      {f.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-muted-on-navy tracking-[0.14em] uppercase mb-1">
                        <EditableText storageKey={`${base}.badge`}>{t(`${base}.badge`)}</EditableText>
                      </div>
                      <div className="text-[16px] font-medium text-white mb-1.5 leading-snug">
                        <EditableText storageKey={`${base}.title`}>{t(`${base}.title`)}</EditableText>
                      </div>
                      <p className="text-[13px] text-muted-on-navy leading-[1.6]">
                        <EditableText storageKey={`${base}.desc`} multiline>{t(`${base}.desc`)}</EditableText>
                      </p>
                    </div>
                  </div>

                  <ul className="relative mt-auto pt-5 space-y-2 text-[12.5px] text-muted-on-navy">
                    {Array.from({ length: f.bulletsCount }).map((_, bi) => (
                      <li key={bi} className="flex items-center gap-2">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" aria-hidden>
                          <path d="M5 12l5 5L20 6" />
                        </svg>
                        <EditableText storageKey={`${base}.bullet.${bi}`}>{t(`${base}.bullet.${bi}`)}</EditableText>
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
