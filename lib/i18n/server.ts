import { cookies, headers } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, type Locale, isLocale } from "./config";
import { translate } from "./dictionary";

export async function getLocale(): Promise<Locale> {
  const h = await headers();
  const fromHeader = h.get("x-locale");
  if (isLocale(fromHeader)) return fromHeader;

  const c = await cookies();
  const fromCookie = c.get(LOCALE_COOKIE)?.value;
  if (isLocale(fromCookie)) return fromCookie;

  return DEFAULT_LOCALE;
}

export async function getT() {
  const locale = await getLocale();
  return {
    locale,
    t: (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
  };
}
