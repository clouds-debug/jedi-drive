import { NextRequest, NextResponse } from "next/server";
import { findUserByLogin, verifyPassword } from "@/lib/auth/users";
import { normalizeLogin, validateLogin } from "@/lib/auth/validate";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import {
  getClientIp,
  rateLimit,
  rateLimitReset,
  tooManyResponse,
} from "@/lib/rate-limit";
import { isIpBlocked, touchUserIp } from "@/lib/admin/blocks";

export const runtime = "nodejs";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 30 * 60 * 1000;

const GENERIC_ERROR = "Неверный логин или пароль";

export async function POST(req: NextRequest) {
  let body: { login?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (typeof body.password !== "string" || body.password.length === 0) {
    return NextResponse.json(
      { errors: [{ field: "password", message: "Пароль обязателен" }] },
      { status: 400 },
    );
  }
  const errs = [validateLogin(body.login)].filter(
    (e): e is NonNullable<typeof e> => e !== null,
  );
  if (errs.length) return NextResponse.json({ errors: errs }, { status: 400 });

  const login = normalizeLogin(body.login as string);
  const ip = getClientIp(req);

  if (await isIpBlocked(ip)) {
    return NextResponse.json(
      { errors: [{ field: "form", message: GENERIC_ERROR }] },
      { status: 401 },
    );
  }

  // Per-login lockout (against brute-force on a known username)
  const byLogin = rateLimit({
    key: `login:user:${login.toLowerCase()}`,
    max: MAX_ATTEMPTS,
    windowMs: WINDOW_MS,
    lockoutMs: LOCKOUT_MS,
  });
  if (!byLogin.ok) {
    return tooManyResponse(
      byLogin,
      byLogin.locked
        ? `Слишком много попыток. Аккаунт временно заблокирован на ${Math.ceil(byLogin.retryAfterSec / 60)} мин.`
        : "Слишком много попыток. Подожди немного.",
    );
  }

  // Per-IP rate limit (against credential-stuffing across many usernames)
  const byIp = rateLimit({
    key: `login:ip:${ip}`,
    max: 20,
    windowMs: WINDOW_MS,
  });
  if (!byIp.ok) {
    return tooManyResponse(byIp, "Слишком много запросов с этого устройства.");
  }

  const user = await findUserByLogin(login);
  const ok = user !== null && (await verifyPassword(user, body.password as string));

  if (!ok || !user || user.is_blocked) {
    return NextResponse.json(
      { errors: [{ field: "form", message: GENERIC_ERROR }] },
      { status: 401 },
    );
  }

  // Successful login — clear the bad-attempt counter for this login.
  rateLimitReset(`login:user:${login.toLowerCase()}`);
  await touchUserIp(user.id, ip);

  const jwt = await createSession(user.id, {
    userAgent: req.headers.get("user-agent") ?? undefined,
    ip,
  });
  await setSessionCookie(jwt);

  return NextResponse.json({
    ok: true,
    user: { id: user.id, login: user.login, role: user.role },
  });
}
