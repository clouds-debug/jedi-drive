import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HistoryList } from "@/components/cabinet/HistoryList";
import {
  countHistory,
  listHistory,
  markStaleConfirmedCompleted,
} from "@/lib/lessons";
import { listActiveReviewedInstructors } from "@/lib/reviews";
import { readSession } from "@/lib/auth/session";
import { getT } from "@/lib/i18n/server";
import { L } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";

const PAGE_SIZE = 20;

function recordsWordKey(n: number, locale: Locale): string {
  if (locale === "ge") return "cab.history.records.many";
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "cab.history.records.one";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "cab.history.records.few";
  return "cab.history.records.many";
}

export const metadata: Metadata = { title: "История занятий — Jedi Drive" };

export default async function HistoryPage() {
  const session = await readSession();
  if (!session) redirect("/cabinet/login");

  await markStaleConfirmedCompleted();

  const [history, total, reviewedSet, { t, locale }] = await Promise.all([
    listHistory(session.userId, PAGE_SIZE),
    countHistory(session.userId),
    listActiveReviewedInstructors(session.userId),
    getT(),
  ]);

  const stats = history.reduce(
    (acc, l) => {
      if (l.status === "completed") acc.completed += 1;
      else if (l.status === "cancelled") acc.cancelled += 1;
      return acc;
    },
    { completed: 0, cancelled: 0 },
  );

  return (
    <div className="max-w-3xl">
      <div className="flex flex-wrap items-end justify-between gap-3 mb-1.5">
        <h2 className="text-[20px] font-medium text-white">{t("cab.history.heading")}</h2>
        <L
          href="/cabinet/lessons"
          className="text-[12.5px] text-muted-on-navy hover:text-white transition-colors"
        >
          {t("cab.history.toUpcoming")}
        </L>
      </div>
      <p className="text-[13px] text-muted-on-navy mb-7">
        {t("cab.history.subheading")}
        {total > 0 && <> {t("cab.history.total", { n: total, word: t(recordsWordKey(total, locale)) })}</>}
      </p>

      {history.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2">
            <span className="font-mono text-[14px] text-white tabular-nums">{stats.completed}</span>
            <span className="text-[11.5px] text-muted-on-navy">{t("cab.history.stat.completed")}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-lg px-3 py-2">
            <span className="font-mono text-[14px] text-white tabular-nums">{stats.cancelled}</span>
            <span className="text-[11.5px] text-muted-on-navy">{t("cab.history.stat.cancelled")}</span>
          </div>
        </div>
      )}

      <HistoryList
        initial={history}
        initialHasMore={history.length < total}
        reviewedInstructorIds={Array.from(reviewedSet)}
      />
    </div>
  );
}
