"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "student" | "instructor" | "moderator" | "admin";

const ROLES: { value: Role; label: string }[] = [
  { value: "student", label: "Ученик" },
  { value: "instructor", label: "Инструктор" },
  { value: "moderator", label: "Модератор" },
  { value: "admin", label: "Админ" },
];

export function UserRoleActions({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: Role;
}) {
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
        setError(data?.error ?? "Не получилось");
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
        Сменить роль
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
            {r.label}
          </option>
        ))}
      </select>

      <button
        onClick={save}
        disabled={busy}
        className="text-[12px] bg-orange hover:bg-orange/90 text-white px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {busy ? "..." : "Сохранить"}
      </button>
      <button
        onClick={() => setOpen(false)}
        disabled={busy}
        className="text-[12px] text-muted-on-navy hover:text-white px-2 py-1.5"
      >
        Отмена
      </button>
      {error && (
        <span className="basis-full text-[11.5px] text-orange-soft">{error}</span>
      )}
    </div>
  );
}
