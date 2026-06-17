import { NextResponse } from "next/server";
import { clearSessionCookie, destroySession, readSession } from "@/lib/auth/session";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await readSession();
  if (session) await destroySession(session.sessionId);
  await clearSessionCookie();
  return NextResponse.redirect(new URL("/cabinet/login", req.url));
}
