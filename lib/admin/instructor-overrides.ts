import { query } from "@/lib/db";

export type InstructorOverride = {
  instructor_id: string;
  is_hidden: boolean;
  is_deleted: boolean;
};

/** Возвращает мапу overrides для всех известных инструкторов (где есть запись). */
export async function getInstructorOverrides(): Promise<
  Map<string, InstructorOverride>
> {
  const rows = await query<InstructorOverride>(
    `SELECT instructor_id, is_hidden, is_deleted FROM instructor_overrides`,
  );
  const out = new Map<string, InstructorOverride>();
  for (const r of rows) out.set(r.instructor_id, r);
  return out;
}

/** ID-шники инструкторов, которые не должны показываться на публичной части. */
export async function getInvisibleInstructorIds(): Promise<Set<string>> {
  const rows = await query<{ instructor_id: string }>(
    `SELECT instructor_id FROM instructor_overrides
     WHERE is_hidden = true OR is_deleted = true`,
  );
  return new Set(rows.map((r) => r.instructor_id));
}

export async function setInstructorHidden(
  instructorId: string,
  hidden: boolean,
  by: string,
): Promise<void> {
  await query(
    `INSERT INTO instructor_overrides (instructor_id, is_hidden, updated_by, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (instructor_id) DO UPDATE
       SET is_hidden = EXCLUDED.is_hidden,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()`,
    [instructorId, hidden, by],
  );
}

export async function markInstructorDeleted(
  instructorId: string,
  by: string,
): Promise<void> {
  await query(
    `INSERT INTO instructor_overrides (instructor_id, is_hidden, is_deleted, updated_by, updated_at)
     VALUES ($1, true, true, $2, now())
     ON CONFLICT (instructor_id) DO UPDATE
       SET is_hidden = true, is_deleted = true,
           updated_by = EXCLUDED.updated_by,
           updated_at = now()`,
    [instructorId, by],
  );
}

/** Сбрасывает роль всех пользователей с этим instructor_ref до student. */
export async function downgradeInstructorUsers(
  instructorId: string,
): Promise<string[]> {
  const rows = await query<{ id: string }>(
    `UPDATE users SET role = 'student', instructor_ref = NULL
     WHERE instructor_ref = $1
     RETURNING id::text`,
    [instructorId],
  );
  // Сессии этих пользователей убираем — чтобы они не остались в админке.
  for (const r of rows) {
    await query(`DELETE FROM sessions WHERE user_id = $1`, [r.id]);
  }
  return rows.map((r) => r.id);
}
