import { query } from "@/lib/db";

export type ContentOverride = {
  key: string;
  value: string;
  updated_at: string;
};

export async function getAllContentOverrides(): Promise<
  Record<string, string>
> {
  const rows = await query<{ key: string; value: string }>(
    `SELECT key, value FROM content_overrides`,
  );
  const out: Record<string, string> = {};
  for (const r of rows) out[r.key] = r.value;
  return out;
}

export async function setContentOverride(
  key: string,
  value: string,
  by: string,
): Promise<void> {
  await query(
    `INSERT INTO content_overrides (key, value, updated_by, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()`,
    [key, value, by],
  );
}

export async function clearContentOverride(key: string): Promise<void> {
  await query(`DELETE FROM content_overrides WHERE key = $1`, [key]);
}
