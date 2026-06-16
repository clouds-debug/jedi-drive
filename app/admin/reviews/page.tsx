import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminRole } from "@/lib/auth/require";
import {
  listDecidedReviews,
  listPendingReviews,
  countReviewsByStatus,
} from "@/lib/reviews";
import { instructors } from "@/lib/instructors/data";
import { ReviewDecisionActions } from "@/components/admin/ReviewDecisionActions";
import { Pagination } from "@/components/admin/Pagination";

const PAGE_SIZE = 10;

export const metadata: Metadata = { title: "Отзывы — админка Jedi Drive" };

const TABS = [
  { key: "pending", label: "На проверке" },
  { key: "approved", label: "Одобренные" },
  { key: "rejected", label: "Отклонённые" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill={i < rating ? "#F97316" : "none"}
          stroke={i < rating ? "#F97316" : "rgba(255,255,255,0.25)"}
          strokeWidth="1.5"
        >
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
        </svg>
      ))}
      <span className="ml-1 text-[11.5px] text-muted-on-navy font-mono tabular-nums">
        {rating}/5
      </span>
    </span>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("ru-RU", {
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tbilisi",
  });
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdminRole(["admin", "moderator"]);

  const sp = await searchParams;
  const status: TabKey = (TABS.find((t) => t.key === sp.status)?.key ?? "pending") as TabKey;

  const total = await countReviewsByStatus(status);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, parseInt(sp.page ?? "1", 10) || 1));
  const offset = (page - 1) * PAGE_SIZE;

  const items =
    status === "pending"
      ? await listPendingReviews(PAGE_SIZE, offset)
      : await listDecidedReviews(status, PAGE_SIZE, offset);

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-[1100px]">
      <div className="mb-2 text-[11px] font-mono text-orange tracking-[0.1em]">
        МОДЕРАЦИЯ
      </div>
      <h1 className="text-[28px] font-medium tracking-[-0.015em] mb-1">Отзывы</h1>
      <p className="text-[13.5px] text-muted-on-navy mb-8">
        Одобряй правдивые, отклоняй обидные или ложные. Отказ можно сопроводить причиной — она уйдёт ученику в уведомлении.
      </p>

      <nav className="flex md:flex-wrap gap-1 border-b border-white/[0.08] mb-6 overflow-x-auto md:overflow-visible overscroll-x-contain touch-pan-x -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const active = t.key === status;
          return (
            <Link
              key={t.key}
              href={`/admin/reviews?status=${t.key}`}
              className={`relative shrink-0 px-3 sm:px-4 py-3 text-[13px] whitespace-nowrap transition-colors ${
                active ? "text-white" : "text-muted-on-navy hover:text-white"
              }`}
            >
              {t.label}
              <span
                className={`absolute left-3 right-3 -bottom-px h-px bg-orange origin-left transition-transform ${
                  active ? "scale-x-100" : "scale-x-0"
                }`}
                aria-hidden
              />
            </Link>
          );
        })}
      </nav>

      {items.length === 0 ? (
        <div className="text-[13px] text-muted-on-navy bg-white/[0.02] border border-white/[0.06] rounded-lg p-6">
          В этом разделе пока пусто.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((r) => {
            const fullName =
              [r.user_first_name, r.user_last_name].filter(Boolean).join(" ") ||
              r.user_login;
            const inst = instructors.find((i) => i.id === r.instructor_id);
            return (
              <div
                key={r.id}
                className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-9 h-9 rounded-lg bg-orange/15 text-orange-soft grid place-items-center font-mono text-[11px] shrink-0">
                      {r.user_login.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="text-[14px] text-white font-medium truncate">
                        {fullName}
                      </div>
                      <div className="text-[11.5px] text-muted-on-navy truncate">
                        @{r.user_login} · оценка для{" "}
                        <span className="text-white">{inst?.name ?? r.instructor_id}</span>
                      </div>
                    </div>
                  </div>
                  <Stars rating={r.rating} />
                </div>

                {r.body && (
                  <div className="text-[13px] text-muted-on-navy leading-[1.55] mb-3 italic border-l-2 border-white/[0.08] pl-3">
                    «{r.body}»
                  </div>
                )}

                <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-white/[0.05]">
                  <span className="text-[11.5px] text-muted-on-navy/80 font-mono">
                    {fmtDate(r.created_at)}
                  </span>
                  {r.status === "pending" ? (
                    <ReviewDecisionActions reviewId={r.id} />
                  ) : r.status === "approved" ? (
                    <span className="text-[10.5px] font-mono uppercase tracking-[0.1em] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded px-2 py-0.5">
                      Опубликован
                    </span>
                  ) : (
                    <span className="text-[10.5px] font-mono uppercase tracking-[0.1em] text-red-300 border border-red-500/30 bg-red-500/[0.08] rounded px-2 py-0.5">
                      Отклонён
                      {r.reject_reason ? ` · ${r.reject_reason}` : ""}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        baseHref={`/admin/reviews?status=${status}`}
      />
    </div>
  );
}
