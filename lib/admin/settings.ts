import { query } from "@/lib/db";

const KEY_PRACTICE = "settings.trust.practice";

export const DEFAULT_TRUST_PRACTICE = 1;

async function readNum(key: string, fallback: number): Promise<number> {
  try {
    const rows = await query<{ value: string }>(
      `SELECT value FROM content_overrides WHERE key = $1`,
      [key],
    );
    if (!rows[0]) return fallback;
    const n = parseInt(rows[0].value, 10);
    if (!Number.isFinite(n) || n < 0) return fallback;
    return n;
  } catch {
    return fallback;
  }
}

async function writeNum(key: string, value: number, by: string) {
  await query(
    `INSERT INTO content_overrides (key, value, updated_by, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (key) DO UPDATE
       SET value = EXCLUDED.value,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()`,
    [key, String(value), by],
  );
}

export async function getTrustThresholdPractice(): Promise<number> {
  return readNum(KEY_PRACTICE, DEFAULT_TRUST_PRACTICE);
}

export async function getTrustThreshold(
  kind: "theory" | "practice",
): Promise<number> {
  // Только практика имеет авто-подтверждение. Теория всегда ручная.
  if (kind === "theory") return Number.POSITIVE_INFINITY;
  return getTrustThresholdPractice();
}

export async function setTrustThresholdPractice(
  practice: number,
  by: string,
): Promise<void> {
  await writeNum(KEY_PRACTICE, practice, by);
}
