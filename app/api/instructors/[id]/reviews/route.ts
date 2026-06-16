import { NextRequest, NextResponse } from "next/server";
import { listApprovedReviewsFor } from "@/lib/reviews";
import { instructors } from "@/lib/instructors/data";

export const runtime = "nodejs";

const MAX_LIMIT = 50;

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
) {
  const { id } = await ctx.params;
  if (!instructors.find((i) => i.id === id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const url = new URL(req.url);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, Number(url.searchParams.get("limit") ?? 20)),
  );

  const rows = await listApprovedReviewsFor(id, limit);
  return NextResponse.json({
    items: rows.map((r) => ({
      id: r.id,
      rating: r.rating,
      body: r.body,
      createdAt: r.created_at,
      authorLogin: r.user_login,
      authorFirstName: r.user_first_name,
    })),
  });
}
