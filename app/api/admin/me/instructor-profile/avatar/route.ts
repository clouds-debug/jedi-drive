import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import {
  setInstructorAvatar,
  clearInstructorAvatar,
} from "@/lib/admin/instructor-profile";

export const runtime = "nodejs";

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.role !== "instructor") {
    return NextResponse.json({ error: "Только для инструкторов" }, { status: 403 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "Bad form" }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof Blob)) {
    return NextResponse.json({ error: "Файл не передан" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "Пустой файл" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Файл больше 2 МБ — сожми перед загрузкой" },
      { status: 400 },
    );
  }
  const mime = file.type;
  if (!ALLOWED_MIME.has(mime)) {
    return NextResponse.json(
      { error: "Только JPG, PNG или WebP" },
      { status: 400 },
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  await setInstructorAvatar(me.id, buf, mime);

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.role !== "instructor") {
    return NextResponse.json({ error: "Только для инструкторов" }, { status: 403 });
  }

  await clearInstructorAvatar(me.id);
  return NextResponse.json({ ok: true });
}
