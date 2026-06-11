"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
  matches: (path: string) => boolean;
};

const items: NavItem[] = [
  { label: "Главная", href: "/", matches: (p) => p === "/" },
  { label: "Услуги", href: "/services/theory", matches: (p) => p.startsWith("/services") },
  { label: "Билеты", href: "/tickets", matches: (p) => p.startsWith("/tickets") },
  { label: "Инструкторы", href: "/instructors", matches: (p) => p.startsWith("/instructors") },
  { label: "О нас", href: "/about", matches: (p) => p.startsWith("/about") },
];

export function Nav() {
  const pathname = usePathname() || "/";

  return (
    <header className="bg-navy text-white relative">
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex items-center justify-between gap-6 relative">
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.18em] uppercase text-white hover:text-orange-soft transition-colors flex items-center gap-2 shrink-0"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange" />
          Jedi Drive
        </Link>

        <nav className="hidden md:flex items-center gap-0.5 text-[12.5px]">
          {items.map((item) => {
            const isActive = item.matches(pathname);
            if (item.label === "Услуги") {
              return <ServicesItem key={item.href} isActive={isActive} pathname={pathname} />;
            }
            return <NavLink key={item.href} item={item} isActive={isActive} />;
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 bg-white/[0.05] border border-white/10 p-[3px] rounded-lg">
            <span className="bg-white text-navy px-2.5 py-1 rounded-md text-[11.5px] font-medium tracking-[0.04em]">ru</span>
            <span className="text-muted-on-navy px-2.5 py-1 text-[11.5px] tracking-[0.04em]">ge</span>
          </div>
          <Link
            href="/cabinet"
            className="flex items-center gap-1.5 bg-white/[0.04] border border-white/15 hover:bg-white/[0.08] hover:border-white/30 px-3 py-1.5 rounded-lg text-[12.5px] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
            Кабинет
          </Link>
        </div>
      </div>
    </header>
  );
}

function NavLink({ item, isActive }: { item: NavItem; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`group/link relative px-3.5 py-2.5 transition-colors ${
        isActive ? "text-white" : "text-muted-on-navy hover:text-white"
      }`}
    >
      <span className="relative flex items-center gap-2">
        <span
          className={`w-1 h-1 rounded-full transition-all ${
            isActive
              ? "bg-orange scale-100"
              : "bg-orange scale-0 group-hover/link:scale-100"
          }`}
          aria-hidden
        />
        {item.label}
      </span>
      <span
        className={`absolute left-3.5 right-3.5 -bottom-px h-px bg-orange origin-left transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-50"
        }`}
        aria-hidden
      />
    </Link>
  );
}

function ServicesItem({ isActive, pathname }: { isActive: boolean; pathname: string }) {
  const theoryActive = pathname.startsWith("/services/theory");
  const practiceActive = pathname.startsWith("/services/practice");

  return (
    <div className="relative group">
      <button
        type="button"
        className={`relative px-3.5 py-2.5 flex items-center gap-2 transition-colors ${
          isActive ? "text-white" : "text-muted-on-navy hover:text-white"
        }`}
      >
        <span className="relative flex items-center gap-2">
          <span
            className={`w-1 h-1 rounded-full transition-all ${
              isActive
                ? "bg-orange scale-100"
                : "bg-orange scale-0 group-hover:scale-100"
            }`}
            aria-hidden
          />
          Услуги
        </span>
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          className="opacity-60 transition-transform duration-300 group-hover:rotate-180"
          aria-hidden
        >
          <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
        <span
          className={`absolute left-3.5 right-7 -bottom-px h-px bg-orange origin-left transition-transform duration-300 ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"
          }`}
          aria-hidden
        />
      </button>

      <div className="absolute left-[-14px] top-[calc(100%+10px)] min-w-[268px] bg-navy border border-white/10 rounded-xl p-2 shadow-[0_18px_50px_rgba(0,0,0,0.55)] opacity-0 invisible translate-y-[-6px] group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-200 z-50 overflow-hidden">
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.15] rounded-full blur-[60px] pointer-events-none" aria-hidden />

        <Link
          href="/services/theory"
          className={`relative flex items-center gap-3 p-3 rounded-lg transition-colors ${
            theoryActive ? "bg-white/[0.06]" : "hover:bg-white/[0.05]"
          }`}
        >
          <span className="w-9 h-9 bg-orange/15 rounded-lg grid place-items-center shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FDBA74" strokeWidth="1.7">
              <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
              <path d="M4 17a3 3 0 0 1 3-3h12" />
            </svg>
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-medium text-white">Запись на теорию</span>
            <span className="block text-[11.5px] text-muted-on-navy">Группы и индивидуально</span>
          </span>
        </Link>

        <div className="h-px bg-white/[0.06] my-0.5" />

        <Link
          href="/services/practice"
          className={`relative flex items-center gap-3 p-3 rounded-lg transition-colors ${
            practiceActive ? "bg-white/[0.06]" : "hover:bg-white/[0.05]"
          }`}
        >
          <span className="w-9 h-9 bg-orange/15 rounded-lg grid place-items-center shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#FDBA74" strokeWidth="1.7">
              <circle cx="12" cy="12" r="8" />
              <circle cx="12" cy="12" r="3" />
              <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
            </svg>
          </span>
          <span className="flex-1">
            <span className="block text-[13.5px] font-medium text-white">Запись на практику</span>
            <span className="block text-[11.5px] text-muted-on-navy">Город и автодром</span>
          </span>
        </Link>
      </div>
    </div>
  );
}
