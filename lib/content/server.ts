import { cookies } from "next/headers";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { getAllContentOverrides } from "./overrides";

export const EDITOR_MODE_COOKIE = "jd_editor_mode";

export async function loadContentForLayout(): Promise<{
  overrides: Record<string, string>;
  isEditor: boolean;
  canEdit: boolean;
}> {
  const [overrides, session, cookieStore] = await Promise.all([
    getAllContentOverrides().catch(() => ({})),
    readSession(),
    cookies(),
  ]);
  let canEdit = false;
  if (session) {
    const u = await findUserById(session.userId).catch(() => null);
    if (u && u.role === "admin") canEdit = true;
  }
  const editorOn = cookieStore.get(EDITOR_MODE_COOKIE)?.value === "on";
  return { overrides, canEdit, isEditor: canEdit && editorOn };
}
