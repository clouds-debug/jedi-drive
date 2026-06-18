import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { isLocale, type Locale } from "@/lib/i18n/config";
import {
  clearContentOverride,
  setContentOverride,
} from "@/lib/content/overrides";

export const runtime = "nodejs";

const KEY_RE = /^[a-z][a-z0-9._-]{1,99}$/;
const MAX_VALUE = 4000;

async function requireEditor() {
  const session = await readSession();
  if (!session) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const u = await findUserById(session.userId);
  if (!u || u.role !== "admin") {
    return { error: NextResponse.json({ error: "Только админ" }, { status: 403 }) };
  }
  return { user: u };
}

function pickLocale(input: unknown): Locale {
  if (typeof input === "string" && isLocale(input)) return input;
  return "ru";
}

export async function PUT(req: NextRequest) {
  const auth = await requireEditor();
  if (auth.error) return auth.error;

  let body: { key?: string; value?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const key = (body.key ?? "").trim();
  const value = body.value ?? "";
  const locale = pickLocale(body.locale);
  if (!KEY_RE.test(key)) {
    return NextResponse.json({ error: "Неверный ключ" }, { status: 400 });
  }
  if (typeof value !== "string" || value.length > MAX_VALUE) {
    return NextResponse.json(
      { error: `Текст до ${MAX_VALUE} символов` },
      { status: 400 },
    );
  }
  await setContentOverride(key, value, locale, auth.user!.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireEditor();
  if (auth.error) return auth.error;

  let body: { key?: string; locale?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }
  const key = (body.key ?? "").trim();
  const locale = pickLocale(body.locale);
  if (!KEY_RE.test(key)) {
    return NextResponse.json({ error: "Неверный ключ" }, { status: 400 });
  }
  await clearContentOverride(key, locale);
  return NextResponse.json({ ok: true });
}
