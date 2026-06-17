import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminRole } from "@/lib/auth/require";
import { listAdminBookings, countAdminBookings } from "@/lib/admin/bookings";
import { BookingCard } from "@/components/admin/BookingCard";
import { Pagination } from "@/components/admin/Pagination";
import { getT } from "@/lib/i18n/server";

const PAGE_SIZE = 10;

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("admin.bookings.metaTitle") };
}

const TABS = [
  { key: "pending", labelKey: "admin.bookings.tab.pending", kind: "practice" as const },
  { key: "confirmed", labelKey: "admin.bookings.tab.confirmed", kind: "practice" as const },
  { key: "attendance", labelKey: "admin.bookings.tab.attendance", kind: "practice" as const },
  { key: "completed", labelKey: "admin.bookings.tab.completed", kind: "practice" as const },
  { key: "cancelled", labelKey: "admin.bookings.tab.cancelled", kind: "practice" as const },
  { key: "theory", labelKey: "admin.bookings.tab.theory", kind: "theory" as const },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  await requireAdminRole(["admin", "moderator"]);
  const { t } = await getT();

  const sp = await searchParams;
  const tab: TabKey = (TABS.find((t) => t.key === sp.status)?.key ?? "pending") as TabKey;
  const activeTab = TABS.find((t) => t.key === tab)!;
  const isAttendance = tab === "attendance";
  const status = !isAttendance && activeTab.kind === "practice"
    ? (tab as "pending" | "confirmed" | "completed" | "cancelled")
    : undefined;
  const opts = isAttendance
    ? { kind: "practice" as const, attendancePending: true }
    : { status, kind: activeTab.kind };

  const total = await countAdminBookings(opts);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, parseInt(sp.page ?? "1", 10) || 1));
  const offset = (page - 1) * PAGE_SIZE;

  const [items, counts] = await Promise.all([
    listAdminBookings({ ...opts, limit: PAGE_SIZE, offset }),
    Promise.all(
      TABS.map(async (t) => ({
        key: t.key,
        count: await countAdminBookings(
          t.key === "attendance"
            ? { kind: "practice", attendancePending: true }
            : t.kind === "practice"
              ? { status: t.key as "pending" | "confirmed" | "completed" | "cancelled", kind: "practice" }
              : { kind: "theory" },
        ),
      })),
    ),
  ]);

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-[1200px]">
      <div className="mb-2 text-[11px] font-mono text-orange tracking-[0.1em]">
        {t("admin.bookings.kicker")}
      </div>
      <h1 className="text-[28px] font-medium tracking-[-0.015em] mb-1">
        {t("admin.bookings.title")}
      </h1>
      <p className="text-[13.5px] text-muted-on-navy mb-8">
        {t("admin.bookings.subtitle")}
      </p>

      <nav className="flex md:flex-wrap gap-1 border-b border-white/[0.08] mb-6 overflow-x-auto md:overflow-visible overscroll-x-contain touch-pan-x -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab2) => {
          const active = tab2.key === tab;
          const cnt = counts.find((c) => c.key === tab2.key)?.count ?? 0;
          return (
            <Link
              key={tab2.key}
              href={`/admin/bookings?status=${tab2.key}`}
              className={`relative shrink-0 px-3 sm:px-4 py-3 text-[13px] whitespace-nowrap transition-colors ${
                active ? "text-white" : "text-muted-on-navy hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                {t(tab2.labelKey)}
                {cnt > 0 && (
                  <span
                    className={`text-[10.5px] font-mono tabular-nums px-1.5 py-px rounded ${
                      tab2.key === "pending"
                        ? "bg-orange text-white"
                        : "bg-white/[0.08] text-muted-on-navy"
                    }`}
                  >
                    {cnt}
                  </span>
                )}
              </span>
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
          {t("admin.bookings.empty")}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((lesson) => (
            <BookingCard
              key={lesson.id}
              lesson={lesson}
              showActions={
                isAttendance ||
                (activeTab.kind === "practice" &&
                  (status === "pending" || status === "confirmed")) ||
                activeTab.kind === "theory"
              }
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        baseHref={`/admin/bookings?status=${tab}`}
      />
    </div>
  );
}
