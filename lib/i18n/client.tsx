"use client";

import { createContext, useContext, useMemo } from "react";
import NextLink from "next/link";
import type { ComponentProps } from "react";
import { DEFAULT_LOCALE, type Locale, withLocalePrefix } from "./config";
import { translate } from "./dictionary";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

export function useT() {
  const locale = useLocale();
  return useMemo(
    () => ({
      locale,
      t: (key: string, params?: Record<string, string | number>) => translate(locale, key, params),
    }),
    [locale],
  );
}

type LinkProps = ComponentProps<typeof NextLink>;

export function L(props: LinkProps) {
  const locale = useLocale();
  const href = typeof props.href === "string" ? withLocalePrefix(props.href, locale) : props.href;
  return <NextLink {...props} href={href} />;
}
