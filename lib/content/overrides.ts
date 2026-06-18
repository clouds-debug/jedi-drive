import { query } from "@/lib/db";
import type { Locale } from "@/lib/i18n/config";

export type ContentOverride = {
  key: string;
  value: string;
  locale: Locale;
  updated_at: string;
};

export async function getAllContentOverrides(
  locale: Locale,
): Promise<Record<string, string>> {
  const rows = await query<{ key: string; value: string }>(
    `SELECT key, value FROM content_overrides WHERE locale = $1`,
    [locale],
  );
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function setContentOverride(
  key: string,
  value: string,
  locale: Locale,
  by: string,
): Promise<void> {
  await query(
    `INSERT INTO content_overrides (key, value, locale, updated_by, updated_at)
     VALUES ($1, $2, $3, $4, now())
     ON CONFLICT (key, locale) DO UPDATE
       SET value = EXCLUDED.value,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()`,
    [key, value, locale, by],
  );
}

export async function clearContentOverride(
  key: string,
  locale: Locale,
): Promise<void> {
  await query(
    `DELETE FROM content_overrides WHERE key = $1 AND locale = $2`,
    [key, locale],
  );
}
