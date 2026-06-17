import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { canModerate } from "@/lib/auth/require";
import { blockUser, unblockUser } from "@/lib/admin/blocks";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || !canModerate(me.role)) {
    return NextResponse.json({ error: "Нет прав" }, { status: 403 });
  }

  const { id } = await ctx.params;
  if (id === me.id) {
    return NextResponse.json({ error: "Сам себя нельзя" }, { status: 400 });
  }

  if (me.role !== "admin") {
    const target = await findUserById(id);
    if (target && (target.role === "admin" || target.role === "moderator")) {
      return NextResponse.json({ error: "Недостаточно прав для этой роли" }, { status: 403 });
    }
  }

  let body: { action?: "block" | "unblock"; reason?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  if (body.action === "unblock") {
    await unblockUser(id);
    return NextResponse.json({ ok: true });
  }

  const reason = (body.reason ?? "").trim() || "Заблокирован администратором";
  const result = await blockUser(id, me.id, reason);

  try {
    await createNotification(
      id,
      "Аккаунт заблокирован",
      reason,
      "warning",
    );
  } catch {
    /* ignore */
  }

  return NextResponse.json({ ok: true, ipAdded: result.ipAdded });
}
