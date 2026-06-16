export const LOCALES = ["ru", "ge"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ru";
export const LOCALE_COOKIE = "jd_locale";

export function isLocale(value: string | undefined | null): value is Locale {
  return value === "ru" || value === "ge";
}

export function stripLocalePrefix(pathname: string): { locale: Locale | null; rest: string } {
  if (pathname === "/ge" || pathname.startsWith("/ge/")) {
    const rest = pathname === "/ge" ? "/" : pathname.slice(3);
    return { locale: "ge", rest: rest || "/" };
  }
  return { locale: null, rest: pathname };
}

export function withLocalePrefix(pathname: string, locale: Locale): string {
  if (locale === DEFAULT_LOCALE) return pathname;
  // Hash-only (#anchor), external (http(s)://), mailto/tel — leave as-is
  if (pathname.startsWith("#") || /^[a-z]+:/i.test(pathname)) return pathname;
  // Already locale-prefixed
  if (pathname === "/ge" || pathname.startsWith("/ge/")) return pathname;
  if (pathname === "/") return "/ge";
  return `/ge${pathname}`;
}
