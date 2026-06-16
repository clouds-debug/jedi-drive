import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById, updateProfile } from "@/lib/auth/users";
import {
  normalizeOptional,
  normalizeTelegram,
  validateName,
  validatePhone,
  validateTelegram,
} from "@/lib/auth/profile-validate";

export const runtime = "nodejs";

function toPublic(user: NonNullable<Awaited<ReturnType<typeof findUserById>>>) {
  return {
    id: user.id,
    login: user.login,
    firstName: user.first_name,
    lastName: user.last_name,
    phone: user.phone,
    telegramUsername: user.telegram_username,
    createdAt: user.created_at,
  };
}

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await findUserById(session.userId);
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ profile: toPublic(user) });
}

export async function PUT(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const errs = [
    validateName("firstName", body.firstName),
    validateName("lastName", body.lastName),
    validatePhone(body.phone),
    validateTelegram(body.telegramUsername),
  ].filter((e): e is NonNullable<typeof e> => e !== null);
  if (errs.length) return NextResponse.json({ errors: errs }, { status: 400 });

  const updated = await updateProfile(session.userId, {
    firstName: normalizeOptional(body.firstName),
    lastName: normalizeOptional(body.lastName),
    phone: normalizeOptional(body.phone),
    telegramUsername: normalizeTelegram(body.telegramUsername),
  });

  return NextResponse.json({ profile: toPublic(updated) });
}
