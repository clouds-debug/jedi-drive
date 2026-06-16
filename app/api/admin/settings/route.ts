import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { setTrustThresholdPractice } from "@/lib/admin/settings";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const u = await findUserById(session.userId);
  if (!u || u.role !== "admin") {
    return NextResponse.json({ error: "Только админ" }, { status: 403 });
  }

  let body: { practice?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const practice = Number(body.practice);
  if (!Number.isInteger(practice) || practice < 0 || practice > 100) {
    return NextResponse.json(
      { error: "Порог — целое число 0–100" },
      { status: 400 },
    );
  }

  await setTrustThresholdPractice(practice, u.id);
  return NextResponse.json({ ok: true });
}
