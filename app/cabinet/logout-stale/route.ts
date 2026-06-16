import { NextResponse } from "next/server";
import { clearSessionCookie, destroySession, readSession } from "@/lib/auth/session";

export const runtime = "nodejs";

/** GET-эндпоинт, на который layout редиректит, если сессия инвалидирована.
 *  Чистит куку (это можно делать только в route handler / server action,
 *  а не прямо в layout — ограничение Next.js 16) и возвращает на /cabinet/login. */
export async function GET(req: Request) {
  const session = await readSession();
  if (session) await destroySession(session.sessionId);
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/cabinet/login", req.url));
}
