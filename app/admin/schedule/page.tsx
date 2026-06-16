import type { Metadata } from "next";
import Link from "next/link";
import { requireAdminRole } from "@/lib/auth/require";
import { markStaleConfirmedCompleted } from "@/lib/lessons";
import { getInstructorDay } from "@/lib/admin/schedule";
import { InstructorScheduleGrid } from "@/components/admin/InstructorScheduleGrid";

export const metadata: Metadata = { title: "Мой календарь — Jedi Drive" };
export const dynamic = "force-dynamic";

export default async function SchedulePage() {
  const user = await requireAdminRole(["instructor"]);

  if (!user.instructor_ref) {
    return (
      <div className="p-4 sm:p-8 lg:p-10">
        <h1 className="text-[20px] text-white mb-2">Профиль не привязан</h1>
        <p className="text-[13px] text-muted-on-navy">
          Свяжись с админом, чтобы привязали инструктора к твоему аккаунту.
        </p>
      </div>
    );
  }

  await markStaleConfirmedCompleted();

  const initialDay = 0;
  const rows = await getInstructorDay(user.instructor_ref, initialDay);
  const initialLessons = rows.map((l) => ({
    id: l.id,
    userId: l.user_id,
    userLogin: l.user_login,
    userFirstName: l.user_first_name,
    userLastName: l.user_last_name,
    userPhone: l.user_phone,
    userTelegram: l.user_telegram_username,
    kind: l.kind,
    format: l.format,
    hhmm: l.hhmm,
    durationMin: l.duration_min,
    status: l.status,
    notes: l.notes,
  }));

  const pendingCount = initialLessons.filter((l) => l.status === "pending").length;
  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || `@${user.login}`;

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-[1100px]">
      <div className="mb-2 text-[11px] font-mono text-orange tracking-[0.1em]">
        ИНСТРУКТОР
      </div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-1">
        <h1 className="text-[28px] font-medium tracking-[-0.015em]">Мой календарь</h1>
        {pendingCount > 0 && (
          <Link
            href={`#`}
            className="text-[12px] text-orange-soft border border-orange/40 bg-orange/[0.06] rounded px-2.5 py-1"
          >
            {pendingCount} {pendingCount === 1 ? "новая запись" : "новых записей"}
          </Link>
        )}
      </div>
      <p className="text-[13.5px] text-muted-on-navy mb-2">
        {displayName} · сетка с 08:45 до 19:15, по 45 минут на слот.
      </p>
      <div className="flex items-center gap-4 text-[11.5px] text-muted-on-navy mb-7">
        <Legend color="border-emerald-500/40 bg-emerald-500/[0.04]" label="Свободно" />
        <Legend color="border-orange/60 bg-orange/[0.06]" label="Запись" />
      </div>

      <InstructorScheduleGrid initialDay={initialDay} initialLessons={initialLessons} />
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`w-3 h-3 rounded border-2 ${color}`} aria-hidden />
      {label}
    </span>
  );
}
