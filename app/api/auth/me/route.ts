import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";

export const runtime = "nodejs";

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ user: null }, { status: 200 });

  const user = await findUserById(session.userId);
  if (!user) return NextResponse.json({ user: null }, { status: 200 });

  return NextResponse.json({
    user: { id: user.id, login: user.login, createdAt: user.created_at },
  });
}
