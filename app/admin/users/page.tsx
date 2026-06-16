import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/auth/require";
import { homePathForRole, type UserRole } from "@/lib/auth/roles";
import {
  countByRole,
  countAdminUsers,
  getUserLessonStats,
  listAdminUsers,
  type AdminUserRow,
} from "@/lib/admin/users";
import { getInstructorOverrides } from "@/lib/admin/instructor-overrides";
import { instructors } from "@/lib/instructors/data";
import { UserRoleActions } from "@/components/admin/UserRoleActions";
import { BlockUserButton } from "@/components/admin/BlockUserButton";
import { InstructorVisibilityActions } from "@/components/admin/InstructorVisibilityActions";
import { Pagination } from "@/components/admin/Pagination";

const PAGE_SIZE = 10;

export const metadata: Metadata = { title: "Пользователи — админка Jedi Drive" };
export const dynamic = "force-dynamic";

const TABS: { key: UserRole; label: string }[] = [
  { key: "student", label: "Пользователи" },
  { key: "moderator", label: "Модераторы" },
  { key: "instructor", label: "Инструкторы" },
  { key: "admin", label: "Администраторы" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Tbilisi",
  });
}

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string; q?: string; page?: string }>;
}) {
  const me = await requireAdminRole(["admin", "moderator", "instructor"]);
  if (me.role !== "admin") redirect(homePathForRole(me.role));

  const sp = await searchParams;
  const tab: UserRole = (TABS.find((t) => t.key === sp.tab)?.key ?? "student") as UserRole;
  const search = (sp.q ?? "").trim();

  const total = await countAdminUsers({ role: tab, search });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(totalPages, Math.max(1, parseInt(sp.page ?? "1", 10) || 1));
  const offset = (page - 1) * PAGE_SIZE;

  const [items, counts, overrides] = await Promise.all([
    listAdminUsers({ role: tab, search, limit: PAGE_SIZE, offset }),
    countByRole(),
    getInstructorOverrides(),
  ]);

  const stats = await Promise.all(items.map((u) => getUserLessonStats(u.id)));

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-[1200px]">
      <div className="mb-2 text-[11px] font-mono text-orange tracking-[0.1em]">
        ПОЛЬЗОВАТЕЛИ
      </div>
      <h1 className="text-[28px] font-medium tracking-[-0.015em] mb-1">
        Все аккаунты
      </h1>
      <p className="text-[13.5px] text-muted-on-navy mb-7">
        Меняй роли, блокируй спамеров. Для инструкторов — скрытие из публичной части и полное удаление.
      </p>

      <nav className="flex md:flex-wrap gap-1 border-b border-white/[0.08] mb-5 overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => {
          const active = t.key === tab;
          const cnt = counts[t.key] ?? 0;
          return (
            <Link
              key={t.key}
              href={`/admin/users?tab=${t.key}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
              className={`relative shrink-0 px-3 sm:px-4 py-3 text-[13px] whitespace-nowrap transition-colors ${
                active ? "text-white" : "text-muted-on-navy hover:text-white"
              }`}
            >
              <span className="flex items-center gap-2">
                {t.label}
                <span className="text-[10.5px] font-mono tabular-nums px-1.5 py-px rounded bg-white/[0.06] text-muted-on-navy">
                  {cnt}
                </span>
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

      <form className="mb-6 max-w-[420px]" action="/admin/users" method="GET">
        <input type="hidden" name="tab" value={tab} />
        <div className="relative">
          <input
            type="search"
            name="q"
            defaultValue={search}
            placeholder="Поиск по логину…"
            className="w-full bg-white/[0.04] border border-white/12 rounded-lg pl-9 pr-3 py-2 text-[13.5px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/60"
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-on-navy pointer-events-none"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
      </form>

      {items.length === 0 ? (
        <div className="text-[13px] text-muted-on-navy bg-white/[0.02] border border-white/[0.06] rounded-lg p-6">
          {search ? `Ничего не нашли по «${search}».` : "В этом разделе пока пусто."}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((user, idx) => (
            <UserCard
              key={user.id}
              user={user}
              stats={stats[idx]}
              instructorOverride={
                user.role === "instructor" && user.instructor_ref
                  ? overrides.get(user.instructor_ref) ?? {
                      instructor_id: user.instructor_ref,
                      is_hidden: false,
                      is_deleted: false,
                    }
                  : null
              }
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        baseHref={`/admin/users?tab=${tab}${search ? `&q=${encodeURIComponent(search)}` : ""}`}
      />
    </div>
  );
}

function UserCard({
  user,
  stats,
  instructorOverride,
}: {
  user: AdminUserRow;
  stats: { pending: number; confirmed: number; completed: number; cancelled: number };
  instructorOverride: { is_hidden: boolean; is_deleted: boolean } | null;
}) {
  const fullName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.login;
  // Для legacy-привязок к data.ts всё ещё показываем имя карточки.
  const linkedInstructor =
    user.role === "instructor" && user.instructor_ref
      ? instructors.find((i) => i.id === user.instructor_ref)
      : null;

  return (
    <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-10 h-10 rounded-lg bg-orange/15 text-orange-soft grid place-items-center font-mono text-[12px] shrink-0 uppercase">
            {user.login.slice(0, 2)}
          </span>
          <div className="min-w-0">
            <div className="text-[14.5px] text-white font-medium truncate">
              {fullName}
            </div>
            <div className="text-[11.5px] text-muted-on-navy truncate">
              @{user.login}
              {user.phone ? ` · ${user.phone}` : ""}
              {linkedInstructor ? ` · ${linkedInstructor.name}` : ""}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {user.is_blocked && (
            <span className="text-[10.5px] font-mono uppercase tracking-[0.1em] border border-red-500/40 bg-red-500/[0.1] text-red-300 rounded px-2 py-0.5">
              Заблокирован
            </span>
          )}
          {instructorOverride?.is_hidden && !instructorOverride?.is_deleted && (
            <span className="text-[10.5px] font-mono uppercase tracking-[0.1em] border border-white/15 bg-white/[0.04] text-muted-on-navy rounded px-2 py-0.5">
              Скрыт с сайта
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[12px] text-muted-on-navy mb-4">
        <span>Регистрация: <span className="text-white">{fmtDate(user.created_at)}</span></span>
        {user.last_ip && <span>· IP: <span className="text-white font-mono text-[11.5px]">{user.last_ip}</span></span>}
      </div>

      <div className="flex flex-wrap gap-2 mb-4 text-[11.5px]">
        <StatChip label="На проверке" value={stats.pending} accent={stats.pending > 0} />
        <StatChip label="Подтверждено" value={stats.confirmed} />
        <StatChip label="Проведено" value={stats.completed} />
        <StatChip label="Отменено" value={stats.cancelled} />
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-white/[0.05]">
        <UserRoleActions userId={user.id} currentRole={user.role} />
        <BlockUserButton
          userId={user.id}
          userLogin={user.login}
          isBlocked={user.is_blocked}
        />
        {user.role === "instructor" && user.instructor_ref && (
          <InstructorVisibilityActions
            instructorId={user.instructor_ref}
            instructorName={linkedInstructor?.name ?? fullName}
            isHidden={instructorOverride?.is_hidden ?? false}
            isDeleted={instructorOverride?.is_deleted ?? false}
          />
        )}
      </div>
    </div>
  );
}

function StatChip({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border rounded px-2 py-0.5 ${
        accent
          ? "border-orange/40 bg-orange/[0.06] text-orange-soft"
          : "border-white/10 bg-white/[0.03] text-muted-on-navy"
      }`}
    >
      <span className="font-mono tabular-nums text-white">{value}</span>
      {label}
    </span>
  );
}
