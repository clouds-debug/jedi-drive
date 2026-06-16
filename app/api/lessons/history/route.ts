import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { countHistory, listHistory } from "@/lib/lessons";

export const runtime = "nodejs";

const MAX_LIMIT = 50;

export async function GET(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(url.searchParams.get("limit") ?? 20)),
  );
  const offset = Math.max(0, Number(url.searchParams.get("offset") ?? 0));

  const [rows, total] = await Promise.all([
    listHistory(session.userId, limit, offset),
    countHistory(session.userId),
  ]);

  return NextResponse.json({
    total,
    hasMore: offset + rows.length < total,
    items: rows,
  });
}
