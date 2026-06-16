"use client";

import { L, useT } from "@/lib/i18n/client";

export function EnrollLoginGate({
  title,
  next,
}: {
  title: string;
  next: string;
}) {
  const { t } = useT();
  return (
    <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-7 max-w-[560px]">
      <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.15] rounded-full blur-[60px] pointer-events-none" aria-hidden />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <span className="w-10 h-10 rounded-lg bg-orange/15 grid place-items-center shrink-0">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </span>
          <div>
            <div className="text-[15px] text-white font-medium">{title}</div>
            <div className="text-[12.5px] text-muted-on-navy">{t("enrollGate.subtitle")}</div>
          </div>
        </div>
        <p className="text-[13.5px] text-muted-on-navy leading-[1.6] mb-5">
          {t("enrollGate.desc")}
        </p>
        <div className="flex flex-wrap gap-2">
          <L
            href={`/cabinet/login?next=${encodeURIComponent(next)}`}
            className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange/90 text-white text-[13px] font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {t("enrollGate.login")}
          </L>
          <L
            href={`/cabinet/register?next=${encodeURIComponent(next)}`}
            className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/15 hover:bg-white/[0.08] text-white text-[13px] px-4 py-2 rounded-lg transition-colors"
          >
            {t("enrollGate.register")}
          </L>
        </div>
      </div>
    </div>
  );
}
