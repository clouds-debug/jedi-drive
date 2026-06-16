"use client";

import { usePathname } from "next/navigation";
import { L, useT } from "@/lib/i18n/client";
import { stripLocalePrefix } from "@/lib/i18n/config";

const tabs = [
  { href: "/cabinet/profile", key: "cab.tabs.profile" },
  { href: "/cabinet/lessons", key: "cab.tabs.lessons" },
  { href: "/cabinet/history", key: "cab.tabs.history" },
  { href: "/cabinet/tickets", key: "cab.tabs.tickets" },
  { href: "/cabinet/notifications", key: "cab.tabs.notifications" },
] as const;

export function CabinetTabs({ unread }: { unread: number }) {
  const { t } = useT();
  const full = usePathname() || "";
  const { rest: pathname } = stripLocalePrefix(full);

  return (
    <nav className="flex md:flex-wrap gap-1 border-b border-white/[0.08] overflow-x-auto md:overflow-visible -mx-4 px-4 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        const isNotif = tab.href === "/cabinet/notifications";
        return (
          <L
            key={tab.href}
            href={tab.href}
            className={`relative shrink-0 px-3 sm:px-4 py-3 text-[13.5px] transition-colors whitespace-nowrap ${
              active ? "text-white" : "text-muted-on-navy hover:text-white"
            }`}
          >
            <span className="relative flex items-center gap-2">
              {t(tab.key)}
              {isNotif && unread > 0 && (
                <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-[10.5px] font-medium bg-orange text-white rounded-full">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </span>
            <span
              className={`absolute left-3 right-3 -bottom-px h-px bg-orange origin-left transition-transform duration-300 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
              aria-hidden
            />
          </L>
        );
      })}
    </nav>
  );
}
