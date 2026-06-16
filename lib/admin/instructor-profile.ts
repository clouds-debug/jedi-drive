import { query } from "@/lib/db";

export type InstructorProfile = {
  user_id: string;
  bio: string | null;
  car: string | null;
  experience_years: number | null;
  languages: string[];
  is_published: boolean;
  avatar_color: string | null;
  updated_at: string;
  has_avatar: boolean;
  avatar_updated_at: string | null;
};

export type InstructorPublicCard = {
  user_id: string;
  ref: string; // = "u-<user_id>"
  first_name: string | null;
  last_name: string | null;
  bio: string | null;
  car: string | null;
  experience_years: number | null;
  languages: string[];
  avatar_color: string | null;
  avatar_url: string | null;
};

const PROFILE_SELECT = `user_id::text, bio, car, experience_years, languages,
  is_published, avatar_color, updated_at,
  (avatar_data IS NOT NULL) AS has_avatar,
  avatar_updated_at`;

export async function getInstructorProfile(
  userId: string,
): Promise<InstructorProfile | null> {
  const rows = await query<InstructorProfile>(
    `SELECT ${PROFILE_SELECT} FROM instructor_profiles WHERE user_id = $1`,
    [userId],
  );
  return rows[0] ?? null;
}

export type ProfileUpdate = {
  bio: string | null;
  car: string | null;
  experienceYears: number | null;
  languages: string[];
  isPublished: boolean;
  avatarColor: string | null;
};

export async function upsertInstructorProfile(
  userId: string,
  p: ProfileUpdate,
): Promise<InstructorProfile> {
  const rows = await query<InstructorProfile>(
    `INSERT INTO instructor_profiles
       (user_id, bio, car, experience_years, languages, is_published, avatar_color)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (user_id) DO UPDATE SET
       bio              = EXCLUDED.bio,
       car              = EXCLUDED.car,
       experience_years = EXCLUDED.experience_years,
       languages        = EXCLUDED.languages,
       is_published     = EXCLUDED.is_published,
       avatar_color     = EXCLUDED.avatar_color,
       updated_at       = now()
     RETURNING ${PROFILE_SELECT}`,
    [
      userId,
      p.bio,
      p.car,
      p.experienceYears,
      p.languages,
      p.isPublished,
      p.avatarColor,
    ],
  );
  return rows[0];
}

export function avatarUrlFor(
  userId: string,
  hasAvatar: boolean,
  avatarUpdatedAt: string | null,
): string | null {
  if (!hasAvatar) return null;
  const v = avatarUpdatedAt ? new Date(avatarUpdatedAt).getTime() : 0;
  return `/api/instructors/avatar/${userId}?v=${v}`;
}

export type InstructorAvatar = {
  data: Buffer;
  mime: string;
  updated_at: string;
};

export async function getInstructorAvatar(
  userId: string,
): Promise<InstructorAvatar | null> {
  const rows = await query<{
    avatar_data: Buffer | null;
    avatar_mime: string | null;
    avatar_updated_at: string | null;
  }>(
    `SELECT avatar_data, avatar_mime, avatar_updated_at
     FROM instructor_profiles WHERE user_id = $1`,
    [userId],
  );
  const row = rows[0];
  if (!row || !row.avatar_data || !row.avatar_mime) return null;
  return {
    data: row.avatar_data,
    mime: row.avatar_mime,
    updated_at: row.avatar_updated_at ?? new Date(0).toISOString(),
  };
}

export async function setInstructorAvatar(
  userId: string,
  data: Buffer,
  mime: string,
): Promise<void> {
  await query(
    `INSERT INTO instructor_profiles (user_id, avatar_data, avatar_mime, avatar_updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id) DO UPDATE SET
       avatar_data = EXCLUDED.avatar_data,
       avatar_mime = EXCLUDED.avatar_mime,
       avatar_updated_at = now(),
       updated_at = now()`,
    [userId, data, mime],
  );
}

export async function clearInstructorAvatar(userId: string): Promise<void> {
  await query(
    `UPDATE instructor_profiles
     SET avatar_data = NULL, avatar_mime = NULL, avatar_updated_at = now(), updated_at = now()
     WHERE user_id = $1`,
    [userId],
  );
}

/** Опубликованные инструкторы для публичной части сайта. */
export async function listPublishedInstructors(): Promise<InstructorPublicCard[]> {
  const rows = await query<{
    user_id: string;
    first_name: string | null;
    last_name: string | null;
    bio: string | null;
    car: string | null;
    experience_years: number | null;
    languages: string[];
    avatar_color: string | null;
    has_avatar: boolean;
    avatar_updated_at: string | null;
  }>(
    `SELECT u.id::text AS user_id, u.first_name, u.last_name,
            p.bio, p.car, p.experience_years, p.languages, p.avatar_color,
            (p.avatar_data IS NOT NULL) AS has_avatar, p.avatar_updated_at
     FROM instructor_profiles p
     JOIN users u ON u.id = p.user_id
     WHERE p.is_published = true
       AND u.role = 'instructor'
       AND u.is_blocked = false
     ORDER BY u.created_at ASC`,
  );
  return rows.map((r) => ({
    user_id: r.user_id,
    ref: `u-${r.user_id}`,
    first_name: r.first_name,
    last_name: r.last_name,
    bio: r.bio,
    car: r.car,
    experience_years: r.experience_years,
    languages: r.languages ?? [],
    avatar_color: r.avatar_color,
    avatar_url: avatarUrlFor(r.user_id, r.has_avatar, r.avatar_updated_at),
  }));
}
