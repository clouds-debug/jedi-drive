"use client";

import { Reveal } from "./Reveal";
import { L, useT } from "@/lib/i18n/client";

export function FinalCta() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute -right-12 -bottom-12 opacity-[0.07] pointer-events-none" aria-hidden>
        <svg width="320" height="240" viewBox="0 0 170 120">
          <path
            d="M10 78 Q12 50 38 46 L60 26 Q80 14 110 18 L138 32 L156 50 Q162 56 162 78 L148 80 A14 14 0 0 0 110 80 L70 80 A14 14 0 0 0 32 80 Z"
            fill="#F97316"
          />
          <circle cx="51" cy="82" r="13" fill="#F97316" />
          <circle cx="129" cy="82" r="13" fill="#F97316" />
        </svg>
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <div className="max-w-[520px]">
            <h2 className="text-[32px] sm:text-[40px] font-medium text-white tracking-[-0.01em] leading-[1.1] mb-3">
              {t("home.cta.title.lead")} <span className="text-orange">{t("home.cta.title.accent")}</span>
            </h2>
            <p className="text-[14.5px] text-muted-on-navy leading-[1.6] mb-7 max-w-[420px]">
              {t("home.cta.subtitle")}
            </p>
            <L
              href="/services/practice"
              className="inline-flex items-center gap-2 bg-orange text-white px-6 py-3.5 rounded-[var(--radius-btn)] text-[14px] font-medium transition-all hover:bg-[#EA670F] hover:translate-x-1"
            >
              {t("home.cta.button")}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </L>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
