import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import { query } from "@/lib/db";

const COOKIE_NAME = "jd_session";
const SESSION_TTL_DAYS = 30;

function getSecret(): Uint8Array {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 24) {
    throw new Error("JWT_SECRET is missing or too short (>=24 chars)");
  }
  return new TextEncoder().encode(s);
}

type Claims = { uid: string; sid: string };

export async function createSession(
  userId: string | number,
  meta: { userAgent?: string; ip?: string | null },
): Promise<string> {
  const rows = await query<{ id: string }>(
    `INSERT INTO sessions (user_id, expires_at, user_agent, ip)
     VALUES ($1, now() + ($2 || ' days')::interval, $3, $4::inet)
     RETURNING id`,
    [userId, SESSION_TTL_DAYS, meta.userAgent ?? null, meta.ip ?? null],
  );
  const sid = rows[0].id;

  const jwt = await new SignJWT({ uid: String(userId), sid } satisfies Claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_TTL_DAYS}d`)
    .sign(getSecret());

  return jwt;
}

export async function setSessionCookie(jwt: string): Promise<void> {
  const c = await cookies();
  c.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_DAYS * 24 * 60 * 60,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const c = await cookies();
  c.delete(COOKIE_NAME);
}

export async function readSession(): Promise<{
  userId: string;
  sessionId: string;
} | null> {
  const c = await cookies();
  const token = c.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    const claims = payload as Claims;
    if (!claims.uid || !claims.sid) return null;

    const rows = await query<{ id: string }>(
      `SELECT id FROM sessions WHERE id = $1 AND user_id = $2 AND expires_at > now()`,
      [claims.sid, claims.uid],
    );
    if (rows.length === 0) return null;

    return { userId: claims.uid, sessionId: claims.sid };
  } catch {
    return null;
  }
}

export async function destroySession(sessionId: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE id = $1`, [sessionId]);
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
