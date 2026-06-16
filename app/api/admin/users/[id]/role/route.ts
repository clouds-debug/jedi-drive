import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById, type UserRole } from "@/lib/auth/users";
import { query } from "@/lib/db";
import { createNotification } from "@/lib/notifications";

export const runtime = "nodejs";

const ALLOWED: UserRole[] = ["student", "instructor", "moderator", "admin"];

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.role !== "admin") {
    return NextResponse.json({ error: "Только админ" }, { status: 403 });
  }

  const { id } = await ctx.params;
  if (id === me.id) {
    return NextResponse.json({ error: "Сам себе роль не меняем" }, { status: 400 });
  }

  let body: { role?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const role = body.role as UserRole;
  if (!ALLOWED.includes(role)) {
    return NextResponse.json({ error: "Неизвестная роль" }, { status: 400 });
  }

  // Для инструктора используем стабильный ref на user.id (без привязки к data.ts).
  // Для других ролей чистим instructor_ref.
  const instructorRef = role === "instructor" ? `u-${id}` : null;

  await query(
    `UPDATE users SET role = $1, instructor_ref = $2, updated_at = now()
     WHERE id = $3`,
    [role, instructorRef, id],
  );

  // Сбрасываем сессии — пусть зайдёт заново с новой ролью.
  await query(`DELETE FROM sessions WHERE user_id = $1`, [id]);

  try {
    const ruRole =
      role === "admin"
        ? "администратор"
        : role === "moderator"
          ? "модератор"
          : role === "instructor"
            ? "инструктор"
            : "ученик";
    await createNotification(
      id,
      "Изменена роль аккаунта",
      `Твоя роль изменена на «${ruRole}». При следующем входе зайдёшь в обновлённый интерфейс.`,
      "system",
    );
  } catch {
    /* ignore */
  }

  return NextResponse.json({ ok: true });
}
