"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { L, useT, useLocale } from "@/lib/i18n/client";
import { stripLocalePrefix, withLocalePrefix, type Locale } from "@/lib/i18n/config";

type NavItem = {
  key: string;
  href: string;
  matches: (path: string) => boolean;
};

const items: NavItem[] = [
  { key: "nav.home", href: "/", matches: (p) => p === "/" },
  { key: "nav.services", href: "/services/theory", matches: (p) => p.startsWith("/services") },
  { key: "nav.exam", href: "/exam", matches: (p) => p.startsWith("/exam") },
  { key: "nav.tickets", href: "/tickets", matches: (p) => p.startsWith("/tickets") },
  { key: "nav.instructors", href: "/instructors", matches: (p) => p.startsWith("/instructors") },
  { key: "nav.about", href: "/about", matches: (p) => p.startsWith("/about") },
];

export function Nav() {
  const fullPath = usePathname() || "/";
  const { rest: pathname } = stripLocalePrefix(fullPath);
  const { t } = useT();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [fullPath]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  return (
    <header className="bg-navy text-white relative">
      <div className="absolute inset-x-0 bottom-0 h-px bg-white/[0.06]" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-3 sm:gap-6 relative">
        <L
          href="/"
          className="shrink-0 flex items-center hover:opacity-90 transition-opacity"
          aria-label="Jedi Drive"
        >
          <img src="/logo.svg" alt="Jedi Drive" className="h-14 sm:h-20 w-auto sm:translate-y-4" />
        </L>

        <nav className="hidden md:flex items-center gap-0.5 text-[12.5px]">
          {items.map((item) => {
            const isActive = item.matches(pathname);
            if (item.key === "nav.services") {
              return <ServicesItem key={item.href} isActive={isActive} pathname={pathname} />;
            }
            return <NavLink key={item.href} item={item} isActive={isActive} label={t(item.key)} />;
          })}
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <LangSwitch />
          <CabinetLink active={pathname.startsWith("/cabinet")} label={t("nav.cabinet")} />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            aria-expanded={open}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08] transition-colors"
          >
            {open ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden fixed inset-0 z-[60] bg-navy/95 backdrop-blur-sm animate-modal-fade">
          <div className="absolute inset-x-0 top-0 px-4 py-3 flex items-center justify-between border-b border-white/10">
            <L href="/" className="shrink-0 flex items-center" aria-label="Jedi Drive" onClick={() => setOpen(false)}>
              <img src="/logo.svg" alt="Jedi Drive" className="h-12 w-auto" />
            </L>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/15 bg-white/[0.04] text-white hover:bg-white/[0.08]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          <nav className="absolute inset-x-0 top-[64px] bottom-0 overflow-y-auto px-5 py-6">
            <div className="space-y-1">
              {items.map((item) => {
                if (item.key === "nav.services") {
                  return (
                    <div key={item.href} className="px-2 pt-3 pb-1 text-[11px] text-muted-on-navy tracking-[0.16em] uppercase">
                      {t("nav.services")}
                    </div>
                  );
                }
                const isActive = item.matches(pathname);
                return (
                  <L
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-[15px] transition-colors ${
                      isActive ? "bg-orange/15 text-white border-l-2 border-l-orange pl-[14px]" : "text-muted-on-navy hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    {t(item.key)}
                  </L>
                );
              })}
              <L
                href="/services/theory"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] text-muted-on-navy hover:bg-white/[0.04] hover:text-white transition-colors`}
              >
                <span className="w-8 h-8 bg-orange/15 rounded-lg grid place-items-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FDBA74" strokeWidth="1.7">
                    <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
                    <path d="M4 17a3 3 0 0 1 3-3h12" />
                  </svg>
                </span>
                {t("nav.services.theory.title")}
              </L>
              <L
                href="/services/practice"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[14px] text-muted-on-navy hover:bg-white/[0.04] hover:text-white transition-colors`}
              >
                <span className="w-8 h-8 bg-orange/15 rounded-lg grid place-items-center shrink-0">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FDBA74" strokeWidth="1.7">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
                  </svg>
                </span>
                {t("nav.services.practice.title")}
              </L>

              <div className="h-px bg-white/[0.06] my-3" />

              <L
                href="/cabinet/profile"
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-lg text-[15px] transition-colors ${
                  pathname.startsWith("/cabinet")
                    ? "bg-orange/15 text-white border-l-2 border-l-orange pl-[14px]"
                    : "bg-white/[0.04] border border-white/15 text-white hover:bg-white/[0.08]"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
                {t("nav.cabinet")}
              </L>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

function LangSwitch() {
  const router = useRouter();
  const fullPath = usePathname() || "/";
  const { rest: internal } = stripLocalePrefix(fullPath);
  const locale = useLocale();

  const go = (next: Locale) => {
    if (next === locale) return;
    document.cookie = `jd_locale=${next}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
    router.push(withLocalePrefix(internal, next));
    router.refresh();
  };

  return (
    <div className="flex items-center gap-0.5 bg-white/[0.05] border border-white/10 p-[3px] rounded-lg">
      <button
        type="button"
        onClick={() => go("ru")}
        className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium tracking-[0.04em] transition-colors ${
          locale === "ru" ? "bg-white text-navy" : "text-muted-on-navy hover:text-white"
        }`}
      >
        ru
      </button>
      <button
        type="button"
        onClick={() => go("ge")}
        className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium tracking-[0.04em] transition-colors ${
          locale === "ge" ? "bg-white text-navy" : "text-muted-on-navy hover:text-white"
        }`}
      >
        ge
      </button>
    </div>
  );
}

function CabinetLink({ active, label }: { active: boolean; label: string }) {
  return (
    <L
      href="/cabinet/profile"
      aria-current={active ? "page" : undefined}
      className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] transition-colors border ${
        active
          ? "bg-orange/15 border-orange/40 text-white"
          : "bg-white/[0.04] border-white/15 text-white hover:bg-white/[0.08] hover:border-white/30"
      }`}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
      {label}
    </L>
  );
}

function NavLink({ item, isActive, label }: { item: NavItem; isActive: boolean; label: string }) {
  return (
    <L
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
        {label}
      </span>
      <span
        className={`absolute left-3.5 right-3.5 -bottom-px h-px bg-orange origin-left transition-transform duration-300 ${
          isActive ? "scale-x-100" : "scale-x-0 group-hover/link:scale-x-50"
        }`}
        aria-hidden
      />
    </L>
  );
}

function ServicesItem({ isActive, pathname }: { isActive: boolean; pathname: string }) {
  const { t } = useT();
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
          {t("nav.services")}
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

        <L
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
            <span className="block text-[13.5px] font-medium text-white">{t("nav.services.theory.title")}</span>
            <span className="block text-[11.5px] text-muted-on-navy">{t("nav.services.theory.desc")}</span>
          </span>
        </L>

        <div className="h-px bg-white/[0.06] my-0.5" />

        <L
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
            <span className="block text-[13.5px] font-medium text-white">{t("nav.services.practice.title")}</span>
            <span className="block text-[11.5px] text-muted-on-navy">{t("nav.services.practice.desc")}</span>
          </span>
        </L>
      </div>
    </div>
  );
}
