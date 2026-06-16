import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import {
  downgradeInstructorUsers,
  markInstructorDeleted,
} from "@/lib/admin/instructor-overrides";
import { instructors } from "@/lib/instructors/data";

export const runtime = "nodejs";

export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Только админ" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const isStatic = instructors.find((i) => i.id === id);
  const isLive = /^u-\d+$/.test(id);
  if (!isStatic && !isLive) {
    return NextResponse.json({ error: "Инструктор не найден" }, { status: 404 });
  }

  await markInstructorDeleted(id, me.id);
  const downgraded = await downgradeInstructorUsers(id);

  return NextResponse.json({ ok: true, downgradedUserIds: downgraded });
}
