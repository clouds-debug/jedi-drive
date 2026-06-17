import { query } from "@/lib/db";

export type ReviewStatus = "pending" | "approved" | "rejected";

export type ReviewRow = {
  id: string;
  user_id: string;
  instructor_id: string;
  rating: number;
  body: string | null;
  status: ReviewStatus;
  reject_reason: string | null;
  created_at: string;
  decided_at: string | null;
  decided_by: string | null;
};

export type AdminReviewRow = ReviewRow & {
  user_login: string;
  user_first_name: string | null;
  user_last_name: string | null;
};

const SELECT_BASE = `id::text, user_id::text, instructor_id, rating, body, status,
  reject_reason, created_at, decided_at, decided_by::text`;


export async function hasCompletedLessonWith(
  userId: string,
  instructorId: string,
): Promise<boolean> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM lessons
     WHERE user_id = $1 AND instructor_id = $2 AND status = 'completed'`,
    [userId, instructorId],
  );
  return Number(rows[0].c) > 0;
}


export async function findActiveReview(
  userId: string,
  instructorId: string,
): Promise<ReviewRow | null> {
  const rows = await query<ReviewRow>(
    `SELECT ${SELECT_BASE} FROM reviews
     WHERE user_id = $1 AND instructor_id = $2
       AND status IN ('pending','approved')
     LIMIT 1`,
    [userId, instructorId],
  );
  return rows[0] ?? null;
}

export async function createReview(
  userId: string,
  instructorId: string,
  rating: number,
  body: string | null,
): Promise<ReviewRow> {
  const rows = await query<ReviewRow>(
    `INSERT INTO reviews (user_id, instructor_id, rating, body)
     VALUES ($1, $2, $3, $4)
     RETURNING ${SELECT_BASE}`,
    [userId, instructorId, rating, body],
  );
  return rows[0];
}

export async function listPendingReviews(
  limit = 50,
  offset = 0,
): Promise<AdminReviewRow[]> {
  return query<AdminReviewRow>(
    `SELECT r.id::text, r.user_id::text, r.instructor_id, r.rating, r.body, r.status,
            r.reject_reason, r.created_at, r.decided_at, r.decided_by::text,
            u.login AS user_login, u.first_name AS user_first_name, u.last_name AS user_last_name
     FROM reviews r JOIN users u ON u.id = r.user_id
     WHERE r.status = 'pending'
     ORDER BY r.created_at ASC
     LIMIT $1 OFFSET $2`,
    [limit, offset],
  );
}

export async function listDecidedReviews(
  status: "approved" | "rejected",
  limit = 50,
  offset = 0,
): Promise<AdminReviewRow[]> {
  return query<AdminReviewRow>(
    `SELECT r.id::text, r.user_id::text, r.instructor_id, r.rating, r.body, r.status,
            r.reject_reason, r.created_at, r.decided_at, r.decided_by::text,
            u.login AS user_login, u.first_name AS user_first_name, u.last_name AS user_last_name
     FROM reviews r JOIN users u ON u.id = r.user_id
     WHERE r.status = $1
     ORDER BY r.decided_at DESC NULLS LAST, r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [status, limit, offset],
  );
}

export async function findReviewById(id: string): Promise<ReviewRow | null> {
  const rows = await query<ReviewRow>(
    `SELECT ${SELECT_BASE} FROM reviews WHERE id = $1 LIMIT 1`,
    [id],
  );
  return rows[0] ?? null;
}

export async function decideReview(
  id: string,
  by: string,
  decision: "approve" | "reject",
  rejectReason?: string,
): Promise<void> {
  await query(
    `UPDATE reviews
     SET status = $2,
         decided_at = now(),
         decided_by = $3,
         reject_reason = $4
     WHERE id = $1 AND status = 'pending'`,
    [
      id,
      decision === "approve" ? "approved" : "rejected",
      by,
      decision === "reject" ? (rejectReason ?? null) : null,
    ],
  );
}

export type InstructorAggregate = {
  rating: number;
  count: number;
};


export async function getInstructorAggregates(): Promise<
  Map<string, InstructorAggregate>
> {
  const rows = await query<{
    instructor_id: string;
    avg: string | null;
    cnt: string;
  }>(
    `SELECT instructor_id,
            avg(rating)::text AS avg,
            count(*)::text AS cnt
     FROM reviews WHERE status = 'approved'
     GROUP BY instructor_id`,
  );
  const out = new Map<string, InstructorAggregate>();
  for (const r of rows) {
    out.set(r.instructor_id, {
      rating: r.avg ? Number(r.avg) : 0,
      count: Number(r.cnt),
    });
  }
  return out;
}


export async function listApprovedReviewsFor(
  instructorId: string,
  limit = 30,
): Promise<
  Array<{
    id: string;
    rating: number;
    body: string | null;
    created_at: string;
    user_login: string;
    user_first_name: string | null;
  }>
> {
  return query<{
    id: string;
    rating: number;
    body: string | null;
    created_at: string;
    user_login: string;
    user_first_name: string | null;
  }>(
    `SELECT r.id::text, r.rating, r.body, r.created_at,
            u.login AS user_login, u.first_name AS user_first_name
     FROM reviews r JOIN users u ON u.id = r.user_id
     WHERE r.instructor_id = $1 AND r.status = 'approved'
     ORDER BY r.created_at DESC LIMIT $2`,
    [instructorId, limit],
  );
}


export async function listActiveReviewedInstructors(
  userId: string,
): Promise<Set<string>> {
  const rows = await query<{ instructor_id: string }>(
    `SELECT DISTINCT instructor_id FROM reviews
     WHERE user_id = $1 AND status IN ('pending','approved')`,
    [userId],
  );
  return new Set(rows.map((r) => r.instructor_id));
}

export async function countPendingReviews(): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM reviews WHERE status = 'pending'`,
  );
  return Number(rows[0].c);
}

export async function countReviewsByStatus(
  status: "pending" | "approved" | "rejected",
): Promise<number> {
  const rows = await query<{ c: string }>(
    `SELECT count(*)::text AS c FROM reviews WHERE status = $1`,
    [status],
  );
  return Number(rows[0].c);
}
