"use client";

import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { EditableText } from "./content/EditableText";
import { useT } from "@/lib/i18n/client";

type Plan = {
  key: string;
  featuresCount: number;
  ctaHref: string;
  highlight?: boolean;
  icon: React.ReactNode;
};

const plans: Plan[] = [
  {
    key: "group",
    featuresCount: 6,
    ctaHref: "#enroll-group",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="9" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 7a3 3 0 010 6M21 20c0-2.7-1.8-5-4-5.7" />
      </svg>
    ),
  },
  {
    key: "solo",
    featuresCount: 6,
    ctaHref: "#enroll-solo",
    highlight: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    ),
  },
];

export function TheoryPricing() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[300px] bg-orange/[0.06] rounded-full blur-[130px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="04">
            <EditableText storageKey="theory.pricing.section.label">{t("theory.pricing.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="theory.pricing.title.lead">{t("theory.pricing.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="theory.pricing.title.accent">{t("theory.pricing.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            <EditableText storageKey="theory.pricing.subtitle" multiline>{t("theory.pricing.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Reveal key={plan.key} delay={i * 120}>
              <PricingCard plan={plan} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <p className="text-center text-[12.5px] text-muted-on-navy/80 mt-8 max-w-[640px] mx-auto leading-[1.65]">
            <EditableText storageKey="theory.pricing.footer.note" multiline>{t("theory.pricing.footer.note")}</EditableText>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  const { t } = useT();
  const base = `theory.pricing.${plan.key}`;
  const baseClass = plan.highlight
    ? "relative bg-white/[0.05] border border-orange/40 border-l-[3px] border-l-orange rounded-2xl p-7 sm:p-8 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(249,115,22,0.35)]"
    : "relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-2xl p-7 sm:p-8 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1";

  return (
    <div className={baseClass}>
      <div
        className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none ${
          plan.highlight ? "bg-orange/[0.18]" : "bg-orange/[0.10]"
        }`}
        aria-hidden
      />

      <div className="relative flex items-center gap-3 mb-6">
        <span className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase">
          <EditableText storageKey={`${base}.badge`}>{t(`${base}.badge`)}</EditableText>
        </span>
        {plan.highlight && (
          <span className="text-[10.5px] text-orange-soft tracking-[0.14em] uppercase font-medium">
            {t("theory.pricing.premium")}
          </span>
        )}
      </div>

      <div className="relative flex items-start gap-4 mb-6">
        <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
          {plan.icon}
        </span>
        <div>
          <div className="text-[20px] font-medium text-white mb-1 leading-snug">
            <EditableText storageKey={`${base}.title`}>{t(`${base}.title`)}</EditableText>
          </div>
          <p className="text-[13px] text-muted-on-navy leading-[1.55]">
            <EditableText storageKey={`${base}.subtitle`} multiline>{t(`${base}.subtitle`)}</EditableText>
          </p>
        </div>
      </div>

      <div className="relative mb-7 pb-6 border-b border-white/[0.08]">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-[44px] font-medium text-white leading-none tracking-tight">
            <EditableText storageKey={`${base}.price`}>{t(`${base}.price`)}</EditableText>
          </span>
          <span className="text-[13px] text-muted-on-navy pb-2">
            <EditableText storageKey={`${base}.priceNote`}>{t(`${base}.priceNote`)}</EditableText>
          </span>
        </div>
      </div>

      <ul className="relative space-y-2.5 mb-7">
        {Array.from({ length: plan.featuresCount }).map((_, fi) => (
          <li key={fi} className="flex items-start gap-2.5 text-[13px] text-muted-on-navy">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F97316"
              strokeWidth="2.5"
              className="mt-1 shrink-0"
              aria-hidden
            >
              <path d="M5 12l5 5L20 6" />
            </svg>
            <span>
              <EditableText storageKey={`${base}.feature.${fi}`}>{t(`${base}.feature.${fi}`)}</EditableText>
            </span>
          </li>
        ))}
      </ul>

      <a
        href={plan.ctaHref}
        className={`relative block w-full text-center py-3.5 rounded-lg font-medium text-[14px] transition-all hover:translate-y-[-1px] active:scale-[0.98] ${
          plan.highlight
            ? "bg-orange hover:bg-[#EA670F] text-white"
            : "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/15 hover:border-white/30"
        }`}
      >
        <EditableText storageKey={`${base}.cta`}>{t(`${base}.cta`)}</EditableText>
      </a>
    </div>
  );
}
