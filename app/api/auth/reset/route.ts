import { NextRequest, NextResponse } from "next/server";
import { findUserByLogin, updatePassword, verifyDob } from "@/lib/auth/users";
import {
  normalizeLogin,
  validateDob,
  validateLogin,
  validatePassword,
} from "@/lib/auth/validate";
import {
  getClientIp,
  rateLimit,
  rateLimitReset,
  tooManyResponse,
} from "@/lib/rate-limit";
import { isIpBlocked } from "@/lib/admin/blocks";

export const runtime = "nodejs";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const LOCKOUT_MS = 60 * 60 * 1000;

const GENERIC_ERROR = "Логин и дата рождения не совпадают";

export async function POST(req: NextRequest) {
  let body: { login?: string; dob?: string; newPassword?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const errs = [
    validateLogin(body.login),
    validateDob(body.dob),
    validatePassword(body.newPassword),
  ].filter((e): e is NonNullable<typeof e> => e !== null);
  if (errs.length) return NextResponse.json({ errors: errs }, { status: 400 });

  const login = normalizeLogin(body.login as string);
  const ip = getClientIp(req);

  if (await isIpBlocked(ip)) {
    return NextResponse.json(
      { errors: [{ field: "form", message: GENERIC_ERROR }] },
      { status: 401 },
    );
  }

  // DOB-brute-force is the most dangerous attack — keep this tight.
  const byLogin = rateLimit({
    key: `reset:user:${login.toLowerCase()}`,
    max: MAX_ATTEMPTS,
    windowMs: WINDOW_MS,
    lockoutMs: LOCKOUT_MS,
  });
  if (!byLogin.ok) {
    return tooManyResponse(
      byLogin,
      `Слишком много попыток сброса. Жди ${Math.ceil(byLogin.retryAfterSec / 60)} мин.`,
    );
  }

  const byIp = rateLimit({
    key: `reset:ip:${ip}`,
    max: 10,
    windowMs: WINDOW_MS,
  });
  if (!byIp.ok) {
    return tooManyResponse(byIp, "Слишком много запросов с этого устройства.");
  }

  const user = await findUserByLogin(login);
  const ok = user !== null && (await verifyDob(user, body.dob as string));

  if (!ok || !user) {
    return NextResponse.json(
      { errors: [{ field: "form", message: GENERIC_ERROR }] },
      { status: 401 },
    );
  }

  rateLimitReset(`reset:user:${login.toLowerCase()}`);

  await updatePassword(user.id, body.newPassword as string);

  return NextResponse.json({ ok: true });
}
