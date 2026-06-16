"use client";

import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { useT } from "@/lib/i18n/client";

type Pack = { key: string; icon: React.ReactNode; featuresCount: number };

export const tariffOptions = [
  { id: "platform", nameKey: "practice.tariff.platform", price: "₾ 500", lessons: "10" },
  { id: "city", nameKey: "practice.tariff.city", price: "₾ 650", lessons: "10" },
];

const packs: Pack[] = [
  {
    key: "pad",
    featuresCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="6" width="18" height="13" rx="1.5" />
        <path d="M3 11h18M7 6V4M17 6V4" />
      </svg>
    ),
  },
  {
    key: "city",
    featuresCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 21h18M5 21V8l7-5 7 5v13M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2" />
      </svg>
    ),
  },
];

export function PracticePricing() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[300px] bg-orange/[0.06] rounded-full blur-[130px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="03">
            <EditableText storageKey="practice.pricing.section.label">{t("practice.pricing.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[600px]">
            <EditableText storageKey="practice.pricing.title.lead">{t("practice.pricing.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="practice.pricing.title.accent">{t("practice.pricing.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[560px]">
            <EditableText storageKey="practice.pricing.subtitle" multiline>{t("practice.pricing.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="relative max-w-[900px] mx-auto">
          <div
            className="hidden lg:block absolute left-1/2 top-8 bottom-16 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent pointer-events-none -translate-x-1/2"
            aria-hidden
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {packs.map((pack, i) => (
              <Reveal key={pack.key} delay={i * 100}>
                <PackCard pack={pack} />
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={320}>
          <p className="text-center text-[12.5px] text-muted-on-navy/80 mt-10 max-w-[640px] mx-auto leading-[1.65]">
            <EditableText storageKey="practice.pricing.footer.note" multiline>{t("practice.pricing.footer.note")}</EditableText>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  const { t } = useT();
  const base = `practice.pricing.${pack.key}`;
  return (
    <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-7 sm:p-8 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1 flex flex-col">
      <div
        className="absolute -right-16 -top-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none bg-orange/[0.10]"
        aria-hidden
      />

      <div className="relative">
        <div className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase mb-6">
          <EditableText storageKey={`${base}.badge`}>{t(`${base}.badge`)}</EditableText>
        </div>

        <div className="flex items-start gap-4 mb-2">
          <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
            {pack.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[22px] font-medium text-white leading-tight mb-1">
              <EditableText storageKey={`${base}.title`}>{t(`${base}.title`)}</EditableText>
            </div>
            <div className="text-[12px] text-muted-on-navy tracking-[0.04em]">
              <EditableText storageKey={`${base}.lessonsLine`}>{t(`${base}.lessonsLine`)}</EditableText>
            </div>
          </div>
        </div>

        <p className="text-[13px] text-muted-on-navy leading-[1.55] mb-6 mt-3">
          <EditableText storageKey={`${base}.for`} multiline>{t(`${base}.for`)}</EditableText>
        </p>

        <div className="flex items-end justify-between gap-3 mb-6 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="text-[44px] font-medium text-white leading-none tracking-tight tabular-nums">
              <EditableText storageKey={`${base}.price`}>{t(`${base}.price`)}</EditableText>
            </div>
          </div>
        </div>

        <ul className="space-y-2.5 mb-7">
          {Array.from({ length: pack.featuresCount }).map((_, fi) => (
            <li
              key={fi}
              className="flex items-start gap-2.5 text-[13px] text-muted-on-navy"
            >
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
          href="#booking"
          className="block w-full text-center py-3.5 rounded-lg font-medium text-[14px] bg-orange hover:bg-[#EA670F] text-white transition-all hover:translate-y-[-1px] active:scale-[0.98]"
        >
          <EditableText storageKey={`${base}.cta`}>{t(`${base}.cta`)}</EditableText>
        </a>
      </div>
    </div>
  );
}
