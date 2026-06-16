import { Pool } from "pg";

declare global {
  var __pgPool: Pool | undefined;
}

export const pool: Pool =
  global.__pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: 5,
    connectionTimeoutMillis: 5_000,
    idleTimeoutMillis: 30_000,
    statement_timeout: 10_000,
    query_timeout: 10_000,
  });

if (process.env.NODE_ENV !== "production") {
  global.__pgPool = pool;
}

export async function query<T = unknown>(
  text: string,
  params?: unknown[],
): Promise<T[]> {
  const res = await pool.query(text, params as never[]);
  return res.rows as T[];
}
