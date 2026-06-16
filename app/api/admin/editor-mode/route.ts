import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { EDITOR_MODE_COOKIE } from "@/lib/content/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const u = await findUserById(session.userId);
  if (!u || u.role !== "admin") {
    return NextResponse.json({ error: "Только админ" }, { status: 403 });
  }

  let body: { on?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const c = await cookies();
  if (body.on) {
    c.set(EDITOR_MODE_COOKIE, "on", {
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  } else {
    c.delete(EDITOR_MODE_COOKIE);
  }
  return NextResponse.json({ ok: true });
}
