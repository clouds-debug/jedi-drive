import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import {
  setInstructorAvatar,
  clearInstructorAvatar,
} from "@/lib/admin/instructor-profile";

export const runtime = "nodejs";

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB на вход — после пересжатия будет сильно меньше
const MAX_DIM = 1024;
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);
const ALLOWED_SHARP_FORMAT = new Set(["jpeg", "png", "webp"]);

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
      { error: "Файл больше 4 МБ — сожми перед загрузкой" },
      { status: 400 },
    );
  }
  // Заявленный MIME (Content-Type) — не доверяем, но если уж выставлен,
  // отсекаем явно неподходящие до тяжёлого декодирования через sharp.
  if (file.type && !ALLOWED_MIME.has(file.type)) {
    return NextResponse.json({ error: "Только JPG, PNG или WebP" }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());

  // Декодируем через sharp — проверяем magic-bytes по реальному формату,
  // а не Content-Type заголовку. Если sharp не распознал — это не картинка.
  let meta: sharp.Metadata;
  try {
    meta = await sharp(buf).metadata();
  } catch {
    return NextResponse.json({ error: "Файл не распознан как картинка" }, { status: 400 });
  }
  if (!meta.format || !ALLOWED_SHARP_FORMAT.has(meta.format)) {
    return NextResponse.json({ error: "Только JPG, PNG или WebP" }, { status: 400 });
  }
  // защита от decompression bombs
  if ((meta.width ?? 0) > 8000 || (meta.height ?? 0) > 8000) {
    return NextResponse.json({ error: "Слишком большое разрешение" }, { status: 400 });
  }

  // Пересжимаем — это стрипит EXIF, нормализует ориентацию, ограничивает размер
  // и гарантирует что вернётся валидная картинка (не байты-с-полезной-нагрузкой).
  const safeBuf = await sharp(buf)
    .rotate()
    .resize(MAX_DIM, MAX_DIM, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 88, mozjpeg: true })
    .toBuffer();

  await setInstructorAvatar(me.id, safeBuf, "image/jpeg");

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
