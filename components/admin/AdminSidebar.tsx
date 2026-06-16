"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { UserRole } from "@/lib/auth/roles";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: ReadonlyArray<UserRole>;
};

const items: NavItem[] = [
  {
    href: "/admin",
    label: "Дашборд",
    roles: ["admin"],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: "/admin/bookings",
    label: "Заявки",
    roles: ["admin", "moderator"],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
  {
    href: "/admin/bio",
    label: "Биография",
    roles: ["instructor"],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    ),
  },
  {
    href: "/admin/schedule",
    label: "Мой календарь",
    roles: ["instructor"],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v6l4 2" />
      </svg>
    ),
  },
  {
    href: "/admin/reviews",
    label: "Отзывы",
    roles: ["admin", "moderator"],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    ),
  },
  {
    href: "/admin/users",
    label: "Пользователи",
    roles: ["admin"],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="8" r="4" />
        <path d="M2 21c0-4 3.5-7 7-7s7 3 7 7" />
        <circle cx="17" cy="6" r="3" />
        <path d="M22 19c0-3-2.5-5-5-5" />
      </svg>
    ),
  },
  {
    href: "/admin/settings",
    label: "Настройки",
    roles: ["admin"],
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
      </svg>
    ),
  },
];

export function AdminSidebar({ role, login }: { role: UserRole; login: string }) {
  const pathname = usePathname() || "";
  const [open, setOpen] = useState(false);
  const visible = items.filter((i) => i.roles.includes(role));

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  const roleLabel =
    role === "admin"
      ? "Супер-админ"
      : role === "moderator"
        ? "Модератор"
        : role === "instructor"
          ? "Инструктор"
          : "Гость";

  const activeItem = visible.find((it) =>
    it.href === "/admin" ? pathname === "/admin" : pathname === it.href || pathname.startsWith(it.href + "/"),
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-3 bg-navy-deep border-b border-white/[0.06]">
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.18em] uppercase text-white hover:text-orange-soft transition-colors inline-flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange" />
          Jedi Drive
        </Link>
        <div className="flex-1 text-right truncate">
          <span className="text-[12.5px] text-white">{activeItem?.label ?? "Админка"}</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Меню"
          className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
      </div>

      {/* Overlay (mobile open) */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <aside
        className={`bg-navy-deep border-r border-white/[0.06] flex-col fixed md:sticky inset-y-0 left-0 top-0 z-50 w-[260px] md:w-auto h-screen md:h-screen transform transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 flex`}
      >
        <div className="px-5 py-5 border-b border-white/[0.06] flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link
              href="/"
              className="font-mono text-[11px] tracking-[0.18em] uppercase text-white hover:text-orange-soft transition-colors flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange" />
              Jedi Drive
            </Link>
            <div className="mt-4">
              <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase">{roleLabel}</div>
              <div className="text-[13.5px] text-white mt-0.5 truncate">@{login}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Закрыть"
            className="md:hidden -mr-1 -mt-1 inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {visible.map((it) => {
            const active = it.href === "/admin"
              ? pathname === "/admin"
              : pathname === it.href || pathname.startsWith(it.href + "/");
            return (
              <Link
                key={it.href}
                href={it.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-colors ${
                  active
                    ? "bg-orange/15 text-white border-l-2 border-l-orange pl-[10px]"
                    : "text-muted-on-navy hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                <span className={active ? "text-orange-soft" : ""}>{it.icon}</span>
                {it.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/[0.06] px-3 py-4 space-y-0.5">
          <Link
            href="/cabinet/profile"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] text-muted-on-navy hover:text-white hover:bg-white/[0.04] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
            Личный кабинет
          </Link>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}

function LogoutButton() {
  const [pending, setPending] = useState(false);
  async function onLogout() {
    if (pending) return;
    setPending(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {}
    window.location.href = "/cabinet/login";
  }
  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={pending}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12.5px] text-muted-on-navy hover:text-orange-soft hover:bg-white/[0.04] disabled:opacity-50 transition-colors"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M15 17l5-5-5-5" />
        <path d="M20 12H9" />
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      </svg>
      {pending ? "Выходим…" : "Выйти"}
    </button>
  );
}
