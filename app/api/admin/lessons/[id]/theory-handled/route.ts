import { NextRequest, NextResponse } from "next/server";
import { findUserById } from "@/lib/auth/users";
import { readSession } from "@/lib/auth/session";
import { canModerate } from "@/lib/auth/require";
import {
  findAdminLessonById,
  setLessonStatus,
} from "@/lib/admin/bookings";

export const runtime = "nodejs";

// POST /api/admin/lessons/[id]/theory-handled
export async function POST(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || !canModerate(me.role)) {
    return NextResponse.json({ error: "Нет прав" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const lesson = await findAdminLessonById(id);
  if (!lesson) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  if (lesson.kind !== "theory") {
    return NextResponse.json({ error: "Только для заявок на теорию" }, { status: 400 });
  }

  await setLessonStatus(lesson.id, "completed");
  return NextResponse.json({ ok: true });
}
