"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";

type Props = {
  userId: string;
  userLogin: string;
  isBlocked: boolean;
};

export function BlockUserButton({ userId, userLogin, isBlocked }: Props) {
  const { t } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    if (isBlocked) {
      if (!confirm(t("admin.block.confirmUnblock", { login: userLogin }))) return;
      setBusy(true);
      try {
        const res = await fetch(`/api/admin/users/${userId}/block`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "unblock" }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(data?.error ?? t("admin.error.generic"));
          return;
        }
        router.refresh();
      } finally {
        setBusy(false);
      }
      return;
    }

    const reason = prompt(
      t("admin.block.confirmBlock", { login: userLogin }),
      t("admin.block.defaultReason"),
    );
    if (reason === null) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/users/${userId}/block`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "block", reason }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("admin.error.generic"));
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={toggle}
        disabled={busy}
        className={`text-[12px] border rounded transition-colors disabled:opacity-50 ${
          isBlocked
            ? "text-emerald-300 hover:text-emerald-200 border-emerald-500/40 hover:border-emerald-500/60 px-2.5 py-1.5"
            : "text-red-300 hover:text-red-200 border-red-500/30 hover:border-red-500/50 px-2.5 py-1.5"
        }`}
      >
        {busy ? "..." : isBlocked ? t("admin.block.unblock") : t("admin.block.block")}
      </button>
      {error && (
        <span className="text-[11.5px] text-orange-soft">{error}</span>
      )}
    </span>
  );
}
