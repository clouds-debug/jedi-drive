import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import { decryptDob, encryptDob } from "./crypto";
import { homePathForRole, type UserRole } from "./roles";

export type { UserRole };
export { homePathForRole };

const BCRYPT_COST = 12;

export type UserRow = {
  id: string;
  login: string;
  password_hash: string;
  dob_encrypted: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  telegram_username: string | null;
  role: UserRole;
  instructor_ref: string | null;
  is_blocked: boolean;
  last_ip: string | null;
  created_at: string;
};

const SELECT_USER = `id::text, login, password_hash, dob_encrypted,
  first_name, last_name, phone, telegram_username, role, instructor_ref,
  is_blocked, last_ip::text AS last_ip, created_at`;

export async function findUserByLogin(login: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    `SELECT ${SELECT_USER} FROM users WHERE login = $1 LIMIT 1`,
    [login],
  );
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    `SELECT ${SELECT_USER} FROM users WHERE id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function createUser(
  login: string,
  password: string,
  dobIso: string,
): Promise<UserRow> {
  const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
  const dobEncrypted = encryptDob(dobIso);
  const rows = await query<UserRow>(
    `INSERT INTO users (login, password_hash, dob_encrypted)
     VALUES ($1, $2, $3)
     RETURNING ${SELECT_USER}`,
    [login, passwordHash, dobEncrypted],
  );
  return rows[0];
}

export async function verifyPassword(
  user: UserRow,
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, user.password_hash);
}

export async function verifyDob(
  user: UserRow,
  dobIso: string,
): Promise<boolean> {
  try {
    return decryptDob(user.dob_encrypted) === dobIso;
  } catch {
    return false;
  }
}

export async function updatePassword(
  userId: string,
  newPassword: string,
): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_COST);
  await query(
    `UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2`,
    [passwordHash, userId],
  );
  await query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
}

export type ProfileUpdate = {
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  telegramUsername: string | null;
};

export async function updateProfile(
  userId: string,
  p: ProfileUpdate,
): Promise<UserRow> {
  const rows = await query<UserRow>(
    `UPDATE users
     SET first_name = $1, last_name = $2, phone = $3, telegram_username = $4,
         updated_at = now()
     WHERE id = $5
     RETURNING ${SELECT_USER}`,
    [p.firstName, p.lastName, p.phone, p.telegramUsername, userId],
  );
  return rows[0];
}
