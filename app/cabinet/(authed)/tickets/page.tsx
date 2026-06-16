import type { Metadata } from "next";
import { L } from "@/lib/i18n/client";
import { getT } from "@/lib/i18n/server";
import { TicketsProgress } from "@/components/cabinet/TicketsProgress";

const TOTAL_QUESTIONS = 921;

export const metadata: Metadata = { title: "Билеты — Jedi Drive" };

export const dynamic = "force-dynamic";

export default async function TicketsCabinetPage() {
  const { t } = await getT();
  const total = TOTAL_QUESTIONS;
  return (
    <div className="max-w-3xl">
      <h2 className="text-[20px] font-medium text-white mb-1.5">{t("cab.tickets.heading")}</h2>
      <p className="text-[13px] text-muted-on-navy mb-7">{t("cab.tickets.subheading")}</p>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5">
          <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
          <div className="relative">
            <div className="text-[15px] text-white font-medium mb-1">{t("cab.tickets.trainer.title")}</div>
            <p className="text-[12.5px] text-muted-on-navy mb-4">{t("cab.tickets.trainer.desc")}</p>
            <L
              href="/tickets"
              className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange/90 text-white text-[12.5px] px-3 py-1.5 rounded-lg transition-colors"
            >
              {t("cab.tickets.trainer.cta")}
            </L>
          </div>
        </div>

        <TicketsProgress total={total} />
      </div>
    </div>
  );
}
