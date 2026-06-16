import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { markAllRead, markRead } from "@/lib/notifications";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { ids?: string[]; all?: boolean };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (body.all) {
    await markAllRead(session.userId);
  } else if (Array.isArray(body.ids) && body.ids.length > 0) {
    await markRead(session.userId, body.ids);
  }

  return NextResponse.json({ ok: true });
}
