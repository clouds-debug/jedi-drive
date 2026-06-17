import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { UpcomingList } from "@/components/cabinet/UpcomingList";
import {
  countUpcoming,
  listUpcoming,
} from "@/lib/lessons";
import { readSession } from "@/lib/auth/session";
import { getT } from "@/lib/i18n/server";
import { L } from "@/lib/i18n/client";

export const metadata: Metadata = { title: "Мои занятия — Jedi Drive" };

const PAGE_SIZE = 20;

export default async function LessonsPage() {
  const session = await readSession();
  if (!session) redirect("/cabinet/login");

  const [upcoming, total, { t }] = await Promise.all([
    listUpcoming(session.userId, PAGE_SIZE),
    countUpcoming(session.userId),
    getT(),
  ]);

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-1.5">
        <h2 className="text-[20px] font-medium text-white">{t("cab.lessons.heading")}</h2>
        <L
          href="/cabinet/history"
          className="text-[12.5px] text-muted-on-navy hover:text-white transition-colors"
        >
          {t("cab.lessons.history")}
        </L>
      </div>
      <p className="text-[13px] text-muted-on-navy mb-7">{t("cab.lessons.subheading")}</p>

      {upcoming.length === 0 ? (
        <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5">
          <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
          <div className="relative">
            <div className="text-[14px] text-white mb-1">{t("cab.lessons.empty.title")}</div>
            <p className="text-[12.5px] text-muted-on-navy mb-4">{t("cab.lessons.empty.desc")}</p>
            <div className="flex flex-wrap gap-2">
              <L
                href="/services/theory"
                className="inline-flex items-center gap-1.5 bg-orange hover:bg-orange/90 text-white text-[12.5px] px-3 py-1.5 rounded-lg transition-colors"
              >
                {t("cab.lessons.empty.theory")}
              </L>
              <L
                href="/services/practice"
                className="inline-flex items-center gap-1.5 bg-white/[0.04] border border-white/15 hover:bg-white/[0.08] text-white text-[12.5px] px-3 py-1.5 rounded-lg transition-colors"
              >
                {t("cab.lessons.empty.practice")}
              </L>
            </div>
          </div>
        </div>
      ) : (
        <UpcomingList initial={upcoming} initialHasMore={upcoming.length < total} />
      )}
    </div>
  );
}
