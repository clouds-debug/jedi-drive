"use client";

import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { MistakesBadge } from "./MistakesBadge";
import { L, useT } from "@/lib/i18n/client";

type Mode = {
  key: string;
  href: string;
  highlight?: boolean;
  comingSoon?: boolean;
  showMistakesBadge?: boolean;
  bulletsCount: number;
  icon: React.ReactNode;
};

const modes: Mode[] = [
  {
    key: "exam",
    href: "/tickets/quiz?mode=exam",
    bulletsCount: 3,
    highlight: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <path d="M14 3v6h6M9 13l2 2 4-4" />
      </svg>
    ),
  },
  {
    key: "topics",
    href: "#topics",
    bulletsCount: 3,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    key: "mistakes",
    href: "/tickets/quiz?mode=mistakes",
    bulletsCount: 3,
    showMistakesBadge: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5" />
      </svg>
    ),
  },
];

export function TicketsModes() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute top-0 left-[10%] w-[480px] h-[280px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="01">
            <EditableText storageKey="tickets.modes.section.label">{t("tickets.modes.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="tickets.modes.title.lead">{t("tickets.modes.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="tickets.modes.title.accent">{t("tickets.modes.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-10 max-w-[520px]">
            <EditableText storageKey="tickets.modes.subtitle" multiline>{t("tickets.modes.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {modes.map((mode, i) => (
            <Reveal key={mode.key} delay={i * 100}>
              <ModeCard mode={mode} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModeCard({ mode }: { mode: Mode }) {
  const { t } = useT();
  const base = mode.highlight
    ? "relative bg-white/[0.05] border border-orange/40 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(249,115,22,0.35)]"
    : "relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1";

  const tkey = `tickets.modes.${mode.key}`;

  const inner = (
    <>
      <div
        className={`absolute -right-12 -top-12 w-44 h-44 rounded-full blur-[60px] pointer-events-none ${
          mode.highlight ? "bg-orange/[0.18]" : "bg-orange/[0.10]"
        }`}
        aria-hidden
      />

      <div className="relative flex items-center justify-between mb-5">
        <span className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase">
          <EditableText storageKey={`${tkey}.badge`}>{t(`${tkey}.badge`)}</EditableText>
        </span>
        {mode.comingSoon && (
          <span className="text-[10.5px] text-muted-on-navy/80 tracking-[0.14em] uppercase">{t("tickets.modes.soon")}</span>
        )}
        {mode.showMistakesBadge && <MistakesBadge />}
      </div>

      <div className="relative flex items-start gap-4 mb-3">
        <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
          {mode.icon}
        </span>
        <div>
          <div className="text-[18px] font-medium text-white mb-1.5 leading-snug">
            <EditableText storageKey={`${tkey}.title`}>{t(`${tkey}.title`)}</EditableText>
          </div>
          <p className="text-[13px] text-muted-on-navy leading-[1.6]">
            <EditableText storageKey={`${tkey}.desc`} multiline>{t(`${tkey}.desc`)}</EditableText>
          </p>
        </div>
      </div>

      <ul className="relative mt-5 space-y-2 text-[12.5px] text-muted-on-navy">
        {Array.from({ length: mode.bulletsCount }).map((_, bi) => (
          <li key={bi} className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" aria-hidden>
              <path d="M5 12l5 5L20 6" />
            </svg>
            <EditableText storageKey={`${tkey}.bullet.${bi}`}>{t(`${tkey}.bullet.${bi}`)}</EditableText>
          </li>
        ))}
      </ul>
    </>
  );

  if (mode.comingSoon) {
    return <div className={base + " opacity-60 cursor-not-allowed"}>{inner}</div>;
  }

  return (
    <L href={mode.href} className={base + " block"}>
      {inner}
    </L>
  );
}
