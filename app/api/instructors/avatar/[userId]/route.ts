import { NextRequest, NextResponse } from "next/server";
import { getInstructorAvatar } from "@/lib/admin/instructor-profile";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;
  if (!/^\d+$/.test(userId)) {
    return NextResponse.json({ error: "Bad id" }, { status: 400 });
  }
  const avatar = await getInstructorAvatar(userId);
  if (!avatar) {
    return NextResponse.json({ error: "No avatar" }, { status: 404 });
  }
  const body = new Uint8Array(avatar.data);
  return new NextResponse(body, {
    status: 200,
    headers: {
      "content-type": avatar.mime,
      "content-length": String(body.byteLength),
      "cache-control": "public, max-age=300, stale-while-revalidate=86400",
    },
  });
}
