"use client";

import { useEffect, useState } from "react";
import { readProgress } from "@/lib/tickets/progress";
import { useT } from "@/lib/i18n/client";

export function TicketsProgress({ total }: { total: number }) {
  const { t } = useT();
  const [solved, setSolved] = useState<number | null>(null);

  useEffect(() => {
    function recompute() {
      const data = readProgress();
      let sum = 0;
      for (const tp of Object.values(data.topics)) {
        sum += Math.min(tp.best, tp.total);
      }
      setSolved(Math.min(sum, total));
    }
    recompute();
    window.addEventListener("jd-tickets-progress", recompute);
    return () => window.removeEventListener("jd-tickets-progress", recompute);
  }, [total]);

  if (solved === null) {
    return (
      <div className="relative bg-white/[0.03] border border-white/10 rounded-[var(--radius-card)] p-5">
        <div className="text-[15px] text-white font-medium mb-1">{t("cab.tickets.progress.title")}</div>
        <p className="text-[12.5px] text-muted-on-navy">{t("cab.tickets.progress.desc")}</p>
      </div>
    );
  }

  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  const isEmpty = solved === 0;

  return (
    <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5 overflow-hidden">
      <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.08] rounded-full blur-[60px] pointer-events-none" aria-hidden />
      <div className="relative">
        <div className="text-[15px] text-white font-medium mb-1">{t("cab.tickets.progress.title")}</div>

        {isEmpty ? (
          <p className="text-[12.5px] text-muted-on-navy">{t("cab.tickets.progress.empty")}</p>
        ) : (
          <>
            <p className="text-[12.5px] text-muted-on-navy mb-3">
              {t("cab.tickets.progress.solved", { solved, total })}
            </p>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden mb-2">
              <div
                className="h-full bg-orange transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="text-right text-[11px] font-mono text-muted-on-navy tabular-nums">{pct}%</div>
          </>
        )}
      </div>
    </div>
  );
}
