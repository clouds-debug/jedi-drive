import { redirect } from "next/navigation";
import { readSession } from "./session";
import { findUserById, UserRole, UserRow } from "./users";

export async function requireUser(): Promise<UserRow> {
  const session = await readSession();
  if (!session) redirect("/cabinet/logout-stale");
  const user = await findUserById(session.userId);
  if (!user || user.is_blocked) redirect("/cabinet/logout-stale");
  return user;
}

export async function requireAdminRole(
  allowed: ReadonlyArray<UserRole>,
): Promise<UserRow> {
  const user = await requireUser();
  if (!allowed.includes(user.role)) {
    redirect("/cabinet/profile");
  }
  return user;
}

export function canModerate(role: UserRole): boolean {
  return role === "admin" || role === "moderator";
}

export function canViewStats(role: UserRole): boolean {
  return role === "admin";
}
