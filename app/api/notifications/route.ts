import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import {
  countTotal,
  countUnread,
  listNotifications,
} from "@/lib/notifications";

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

  const [rows, unread, total] = await Promise.all([
    listNotifications(session.userId, limit, offset),
    countUnread(session.userId),
    countTotal(session.userId),
  ]);

  return NextResponse.json({
    unread,
    total,
    hasMore: offset + rows.length < total,
    items: rows.map((n) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      kind: n.kind,
      isRead: n.read_at !== null,
      createdAt: n.created_at,
    })),
  });
}
