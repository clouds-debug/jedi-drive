"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";

type Role = "student" | "instructor" | "moderator" | "admin";

const ROLES: { value: Role; labelKey: string }[] = [
  { value: "student", labelKey: "admin.role.student" },
  { value: "instructor", labelKey: "admin.role.instructor" },
  { value: "moderator", labelKey: "admin.role.moderator" },
  { value: "admin", labelKey: "admin.role.admin" },
];

export function UserRoleActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
  const { t } = useT();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<Role>(currentRole);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("admin.error.generic"));
        return;
      }
      setOpen(false);
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-[12px] text-muted-on-navy hover:text-white border border-white/15 hover:border-white/30 px-2.5 py-1 rounded transition-colors"
      >
        {t("admin.role.change")}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as Role)}
        className="bg-white/[0.04] border border-white/12 rounded px-2 py-1.5 text-[12.5px] text-white focus:outline-none focus:border-orange/60"
      >
        {ROLES.map((r) => (
          <option key={r.value} value={r.value} className="bg-navy">
            {t(r.labelKey)}
          </option>
        ))}
      </select>

      <button
        onClick={save}
        disabled={busy}
        className="text-[12px] bg-orange hover:bg-orange/90 text-white px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {busy ? "..." : t("common.save")}
      </button>
      <button
        onClick={() => setOpen(false)}
        disabled={busy}
        className="text-[12px] text-muted-on-navy hover:text-white px-2 py-1.5"
      >
        {t("common.cancel")}
      </button>
      {error && (
        <span className="basis-full text-[11.5px] text-orange-soft">{error}</span>
      )}
    </div>
  );
}
