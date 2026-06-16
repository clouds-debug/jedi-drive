import { NextRequest, NextResponse } from "next/server";
import {
  createUser,
  findUserByLogin,
} from "@/lib/auth/users";
import {
  normalizeLogin,
  validateDob,
  validateLogin,
  validatePassword,
} from "@/lib/auth/validate";
import { createSession, setSessionCookie } from "@/lib/auth/session";
import { getClientIp, rateLimit, tooManyResponse } from "@/lib/rate-limit";
import { isIpBlocked, touchUserIp } from "@/lib/admin/blocks";

export const runtime = "nodejs";

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_IP = 3;

export async function POST(req: NextRequest) {
  let body: {
    login?: string;
    password?: string;
    dob?: string;
    // Honeypot — настоящие пользователи не видят это поле.
    // Если оно заполнено — почти 100% бот.
    company?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  // Honeypot trip — отвечаем 200 чтобы бот думал что всё прошло, но юзера не создаём.
  if (typeof body.company === "string" && body.company.trim().length > 0) {
    return NextResponse.json({ ok: true });
  }

  const errs = [
    validateLogin(body.login),
    validatePassword(body.password),
    validateDob(body.dob),
  ].filter((e): e is NonNullable<typeof e> => e !== null);
  if (errs.length) return NextResponse.json({ errors: errs }, { status: 400 });

  const ip = getClientIp(req);

  if (await isIpBlocked(ip)) {
    // Тихо отвечаем «ok», чтобы бот не понял что отрезан.
    return NextResponse.json({ ok: true });
  }

  const byIp = rateLimit({
    key: `register:ip:${ip}`,
    max: MAX_PER_IP,
    windowMs: WINDOW_MS,
  });
  if (!byIp.ok) {
    return tooManyResponse(
      byIp,
      "Слишком много регистраций с этого устройства. Попробуй позже.",
    );
  }

  const login = normalizeLogin(body.login as string);

  const existing = await findUserByLogin(login);
  if (existing) {
    return NextResponse.json(
      { errors: [{ field: "login", message: "Такой логин уже занят" }] },
      { status: 409 },
    );
  }

  const user = await createUser(login, body.password as string, body.dob as string);
  await touchUserIp(user.id, ip);

  const jwt = await createSession(user.id, {
    userAgent: req.headers.get("user-agent") ?? undefined,
    ip,
  });
  await setSessionCookie(jwt);

  return NextResponse.json({ ok: true, user: { id: user.id, login: user.login } });
}
