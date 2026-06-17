import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { query } from "@/lib/db";
import {
  getInstructorProfile,
  upsertInstructorProfile,
} from "@/lib/admin/instructor-profile";

export const runtime = "nodejs";

const NAME_RE = /^[\p{L}\p{M} '\-]{1,60}$/u;
const AVATAR_COLORS = ["indigo", "orange", "violet", "emerald", "rose"] as const;
const LANG_CODES = ["ru", "ge", "en"] as const;

function clamp(s: string, max: number): string {
  return s.trim().slice(0, max);
}

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.role !== "instructor") {
    return NextResponse.json({ error: "Только для инструкторов" }, { status: 403 });
  }

  const profile = await getInstructorProfile(me.id);
  return NextResponse.json({
    user: { firstName: me.first_name, lastName: me.last_name },
    profile: profile ?? {
      bio: null,
      car: null,
      experience_years: null,
      languages: [],
      is_published: false,
      avatar_color: null,
    },
  });
}

export async function PUT(req: NextRequest) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const me = await findUserById(session.userId);
  if (!me || me.role !== "instructor") {
    return NextResponse.json({ error: "Только для инструкторов" }, { status: 403 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const errors: { field: string; message: string }[] = [];
  const firstName =
    typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName =
    typeof body.lastName === "string" ? body.lastName.trim() : "";
  if (firstName && !NAME_RE.test(firstName))
    errors.push({ field: "firstName", message: "Неверное имя" });
  if (lastName && !NAME_RE.test(lastName))
    errors.push({ field: "lastName", message: "Неверная фамилия" });

  const bio =
    typeof body.bio === "string" ? clamp(body.bio, 1500) : "";
  const car =
    typeof body.car === "string" ? clamp(body.car, 120) : "";

  let experienceYears: number | null = null;
  if (body.experienceYears !== null && body.experienceYears !== undefined && body.experienceYears !== "") {
    const n = Number(body.experienceYears);
    if (!Number.isInteger(n) || n < 0 || n > 60) {
      errors.push({ field: "experienceYears", message: "Стаж — целое число 0–60" });
    } else {
      experienceYears = n;
    }
  }

  const langsInput = Array.isArray(body.languages) ? body.languages : [];
  const languages = langsInput
    .filter((l): l is string => typeof l === "string")
    .filter((l) => (LANG_CODES as readonly string[]).includes(l));

  const avatarColorInput =
    typeof body.avatarColor === "string" ? body.avatarColor : null;
  const avatarColor =
    avatarColorInput && (AVATAR_COLORS as readonly string[]).includes(avatarColorInput)
      ? avatarColorInput
      : null;

  const isPublished = Boolean(body.isPublished);

  if (errors.length) {
    return NextResponse.json({ errors }, { status: 400 });
  }

  // Update users.first_name/last_name
  await query(
    `UPDATE users SET first_name = $1, last_name = $2, updated_at = now() WHERE id = $3`,
    [firstName || null, lastName || null, me.id],
  );

  // Upsert profile
  const profile = await upsertInstructorProfile(me.id, {
    bio: bio || null,
    car: car || null,
    experienceYears,
    languages,
    isPublished,
    avatarColor,
  });

  return NextResponse.json({ ok: true, profile });
}
