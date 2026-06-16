import type { ReactNode } from "react";
import { L } from "@/lib/i18n/client";

export function AuthShell({
  num,
  label,
  title,
  subtitle,
  children,
  footer,
}: {
  num: string;
  label: string;
  title: ReactNode;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-navy text-white relative overflow-hidden flex flex-col">
      <div className="absolute top-[-160px] left-[-120px] w-[460px] h-[460px] bg-orange/[0.10] rounded-full blur-[110px] pointer-events-none" aria-hidden />
      <div className="absolute bottom-[-200px] right-[-120px] w-[420px] h-[420px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

      <div className="px-6 lg:px-10 py-5">
        <L
          href="/"
          className="font-mono text-[11px] tracking-[0.18em] uppercase text-white hover:text-orange-soft transition-colors inline-flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange" />
          Jedi Drive
        </L>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-10 relative">
        <div className="w-full max-w-[440px]">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-mono text-[11px] text-orange tracking-[0.1em]">{num}</span>
            <span className="h-px flex-1 bg-gradient-to-r from-orange/55 to-transparent" />
            <span className="text-[12px] text-muted-on-navy tracking-[0.04em]">{label}</span>
          </div>

          <h1 className="text-[28px] sm:text-[32px] font-medium tracking-[-0.015em] leading-[1.1] mb-2">
            {title}
          </h1>
          <p className="text-[13.5px] text-muted-on-navy mb-7">{subtitle}</p>

          <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 sm:p-7">
            <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
            <div className="relative">{children}</div>
          </div>

          <div className="mt-5 text-[12.5px] text-muted-on-navy">{footer}</div>
        </div>
      </div>
    </main>
  );
}
