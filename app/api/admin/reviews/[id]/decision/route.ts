import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { canModerate } from "@/lib/auth/require";
import { decideReview, findReviewById } from "@/lib/reviews";
import { createNotification } from "@/lib/notifications";
import { instructors } from "@/lib/instructors/data";

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
  const review = await findReviewById(id);
  if (!review) return NextResponse.json({ error: "Не найдено" }, { status: 404 });
  if (review.status !== "pending") {
    return NextResponse.json({ error: "Отзыв уже обработан" }, { status: 400 });
  }

  let body: { action?: "approve" | "reject"; reason?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  if (body.action !== "approve" && body.action !== "reject") {
    return NextResponse.json({ error: "Неизвестное действие" }, { status: 400 });
  }

  const reason = (body.reason ?? "").trim();
  await decideReview(id, me.id, body.action, reason || undefined);

  const instructorName =
    instructors.find((i) => i.id === review.instructor_id)?.name ?? "инструктору";

  if (body.action === "approve") {
    await createNotification(
      review.user_id,
      "Отзыв опубликован",
      `Твой отзыв ${instructorName} опубликован. Спасибо за обратную связь!`,
      "system",
    );
  } else {
    await createNotification(
      review.user_id,
      "Отзыв отклонён",
      reason
        ? `Отзыв ${instructorName} отклонён. Причина: ${reason}. Ты можешь оставить новый.`
        : `Отзыв ${instructorName} отклонён. Ты можешь оставить новый.`,
      "warning",
    );
  }

  return NextResponse.json({ ok: true });
}
