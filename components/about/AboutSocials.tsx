"use client";

import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { useContentCtx, useContentValue } from "../content/ContentProvider";
import { useT } from "@/lib/i18n/client";

type Social = {
  key: string;
  href: string;
  icon: React.ReactNode;
};

const socials: Social[] = [
  {
    key: "instagram",
    href: "https://instagram.com/jedidrive",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "telegram",
    href: "https://t.me/jedidrive",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21.5 4.2L2.5 11.5c-.9.3-.9 1.6.1 1.9l4.7 1.5 1.8 5.6c.2.7 1 .9 1.5.4l2.7-2.5 4.7 3.5c.6.4 1.4.1 1.6-.6l3.4-15c.2-.9-.7-1.6-1.5-1.1zM10.4 14.6l-.3 3.2-1.3-4 9.2-5.8-7.6 6.6z" />
      </svg>
    ),
  },
];

export function AboutSocials() {
  const { t } = useT();
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] rounded-full bg-orange/[0.08] blur-[120px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="04">
            <EditableText storageKey="about.socials.section.label">{t("about.socials.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="about.socials.title.lead">{t("about.socials.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="about.socials.title.accent">{t("about.socials.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            <EditableText storageKey="about.socials.subtitle" multiline>{t("about.socials.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl">
          {socials.map((s, i) => (
            <Reveal key={s.key} delay={i * 100}>
              <SocialCard s={s} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialCard({ s }: { s: Social }) {
  const { t } = useT();
  const hrefKey = `about.socials.${s.key}.href`;
  const href = useContentValue(hrefKey, s.href);
  const { isEditor } = useContentCtx();
  const base = `about.socials.${s.key}`;

  return (
    <div className="space-y-1">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.06] hover:border-white/25 hover:-translate-y-1"
      >
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.12] rounded-full blur-[60px] pointer-events-none" aria-hidden />

        <div className="relative flex items-start gap-4 mb-4">
          <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
            {s.icon}
          </span>
          <div className="flex-1 min-w-0">
            <div className="text-[17px] font-medium text-white mb-1">
              <EditableText storageKey={`${base}.name`}>{t(`${base}.name`)}</EditableText>
            </div>
            <div className="font-mono text-[12.5px] text-orange-soft tracking-[0.06em]">
              <EditableText storageKey={`${base}.handle`}>{t(`${base}.handle`)}</EditableText>
            </div>
          </div>
        </div>

        <p className="relative text-[13px] text-muted-on-navy leading-[1.6] mb-5">
          <EditableText storageKey={`${base}.desc`} multiline>{t(`${base}.desc`)}</EditableText>
        </p>

        <div className="relative pt-4 border-t border-white/[0.06] flex items-center justify-between text-[12px] text-white">
          <span>{t("about.socials.open")}</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FDBA74"
            strokeWidth="2"
            className="-translate-x-1 group-hover:translate-x-0 transition-transform"
            aria-hidden
          >
            <path d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
        </div>
      </a>
      {isEditor && (
        <div className="text-[11px] text-muted-on-navy/80 font-mono break-all px-2">
          {t("about.socials.editor.link")}: <EditableText storageKey={hrefKey}>{s.href}</EditableText>
        </div>
      )}
    </div>
  );
}
