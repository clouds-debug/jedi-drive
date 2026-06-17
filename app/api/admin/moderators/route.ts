import { NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import {
  addTgModerator,
  listTgModerators,
  removeTgModerator,
} from "@/lib/admin/moderators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await readSession();
  if (!session) return null;
  const me = await findUserById(session.userId);
  if (!me || me.role !== "admin") return null;
  return me;
}

export async function GET() {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const list = await listTgModerators();
  return NextResponse.json({ moderators: list });
}

export async function POST(req: Request) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: { chatId?: number | string; name?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }
  const chatId = Number(body.chatId);
  const name = (body.name ?? "").trim();
  if (!Number.isFinite(chatId) || chatId === 0) {
    return NextResponse.json({ error: "chat_id некорректный" }, { status: 400 });
  }
  if (!name) {
    return NextResponse.json({ error: "Имя не может быть пустым" }, { status: 400 });
  }
  await addTgModerator(chatId, name, me.login);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const me = await requireAdmin();
  if (!me) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const chatId = Number(url.searchParams.get("chatId"));
  if (!Number.isFinite(chatId)) {
    return NextResponse.json({ error: "bad chatId" }, { status: 400 });
  }
  await removeTgModerator(chatId);
  return NextResponse.json({ ok: true });
}
