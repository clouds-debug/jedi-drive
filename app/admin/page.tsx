import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/auth/require";
import { homePathForRole } from "@/lib/auth/users";
import {
  getKindBreakdown,
  getMonthly,
  getStatusBreakdown,
  getUserGrowth,
} from "@/lib/admin/stats";
import { DonutChart } from "@/components/admin/DonutChart";
import { BarChart } from "@/components/admin/BarChart";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("admin.dashboard.metaTitle") };
}

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; mode?: string }>;
}) {
  const user = await requireAdminRole(["admin", "moderator", "instructor"]);
  if (user.role !== "admin") redirect(homePathForRole(user.role));

  const { t } = await getT();
  const sp = await searchParams;
  const now = new Date();
  const currentYear = now.getUTCFullYear();
  const mode = sp.mode === "year" ? "year" : "recent";
  const selectedYear = sp.year ? Number(sp.year) : currentYear;
  const validYear =
    Number.isFinite(selectedYear) && selectedYear >= 2023 && selectedYear <= currentYear + 1
      ? selectedYear
      : currentYear;

  const [growth, status, kind, monthly] = await Promise.all([
    getUserGrowth(),
    getStatusBreakdown(),
    getKindBreakdown(),
    mode === "year"
      ? getMonthly({ year: validYear })
      : getMonthly({ months: 6 }),
  ]);

  function monthLabel(iso: string, withMonthOnly: boolean): string {
    const d = new Date(iso);
    const m = t(`admin.months.short.${d.getUTCMonth()}`);
    if (withMonthOnly) return m;
    const y = d.getUTCFullYear().toString().slice(2);
    return `${m} '${y}`;
  }

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-[1200px]">
      <div className="mb-2 text-[11px] font-mono text-orange tracking-[0.1em]">
        {t("admin.dashboard.kicker")}
      </div>
      <h1 className="text-[28px] font-medium tracking-[-0.015em] mb-1">
        {t("admin.dashboard.title")}
      </h1>
      <p className="text-[13.5px] text-muted-on-navy mb-8">
        {t("admin.dashboard.subtitle")}
      </p>

      {/* Section 1: User growth */}
      <section className="mb-10">
        <h2 className="text-[14px] text-white font-medium mb-4">{t("admin.dashboard.newStudents")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <GrowthCard label={t("admin.dashboard.growth.day")} value={growth.day} accent="orange" />
          <GrowthCard label={t("admin.dashboard.growth.week")} value={growth.week} />
          <GrowthCard label={t("admin.dashboard.growth.month")} value={growth.month} />
          <GrowthCard label={t("admin.dashboard.growth.total")} value={growth.total} />
        </div>
      </section>

      {/* Section 2: Status + Kind donuts */}
      <section className="mb-10">
        <h2 className="text-[14px] text-white font-medium mb-4">{t("admin.dashboard.lessons.title")}</h2>
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-4">
              {t("admin.dashboard.lessons.byStatus")}
            </div>
            <DonutChart
              centerLabel={t("admin.dashboard.center.total")}
              centerValue={status.total}
              segments={[
                { label: t("admin.status.pending"), value: status.pending, color: "#F97316" },
                { label: t("admin.status.confirmed"), value: status.confirmed, color: "#34D399" },
                { label: t("admin.status.completed"), value: status.completed, color: "#60A5FA" },
                { label: t("admin.status.cancelled"), value: status.cancelled, color: "rgba(248,113,113,0.6)" },
              ]}
            />
          </Card>
          <Card>
            <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-4">
              {t("admin.dashboard.lessons.byKind")}
            </div>
            <DonutChart
              centerLabel={t("admin.dashboard.center.bookings")}
              centerValue={kind.theory + kind.practice}
              segments={[
                { label: t("admin.kind.theory"), value: kind.theory, color: "#FDBA74" },
                { label: t("admin.kind.practice"), value: kind.practice, color: "#A78BFA" },
              ]}
            />
          </Card>
        </div>
      </section>

      {/* Section 3: Monthly bar chart */}
      <section>
        <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
          <h2 className="text-[14px] text-white font-medium">
            {t("admin.dashboard.monthly.title")}
          </h2>
          <MonthRangeControl
            mode={mode}
            year={validYear}
            currentYear={currentYear}
            label6m={t("admin.dashboard.monthly.6months")}
          />
        </div>
        <Card>
          <BarChart
            rows={monthly.map((m) => ({
              label: monthLabel(m.month, mode === "year"),
              bookings: m.bookings,
              completed: m.completed,
              cancelled: m.cancelled,
            }))}
          />
        </Card>
        <p className="text-[11.5px] text-muted-on-navy mt-3">
          {t("admin.dashboard.monthly.note")}
        </p>
      </section>
    </div>
  );
}

function GrowthCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "orange";
}) {
  return (
    <div
      className={`relative bg-white/[0.03] border border-white/10 rounded-[var(--radius-card)] p-5 ${
        accent === "orange" ? "border-l-[3px] border-l-orange" : ""
      }`}
    >
      {accent === "orange" && (
        <div
          className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none"
          aria-hidden
        />
      )}
      <div className="relative">
        <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-2">
          {label}
        </div>
        <div className="text-[32px] font-medium text-white tabular-nums leading-none">
          {value}
        </div>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-[var(--radius-card)] p-5">
      {children}
    </div>
  );
}

function MonthRangeControl({
  mode,
  year,
  currentYear,
  label6m,
}: {
  mode: "recent" | "year";
  year: number;
  currentYear: number;
  label6m: string;
}) {
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i);
  return (
    <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.08] rounded-lg p-1 text-[11.5px]">
      <Link
        href="/admin?mode=recent"
        className={`px-3 py-1 rounded transition-colors ${
          mode === "recent"
            ? "bg-orange text-white"
            : "text-muted-on-navy hover:text-white"
        }`}
      >
        {label6m}
      </Link>
      {years.map((y) => (
        <Link
          key={y}
          href={`/admin?mode=year&year=${y}`}
          className={`px-3 py-1 rounded transition-colors ${
            mode === "year" && year === y
              ? "bg-orange text-white"
              : "text-muted-on-navy hover:text-white"
          }`}
        >
          {y}
        </Link>
      ))}
    </div>
  );
}
