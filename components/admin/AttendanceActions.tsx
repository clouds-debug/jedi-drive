"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";

export function AttendanceActions({
  lessonId,
  response,
}: {
  lessonId: string;
  response: "coming" | "not_coming" | null;
}) {
  const { t } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState<"handled" | "cancel" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "handled" | "cancel") {
    if (action === "cancel" && !confirm(t("admin.attendance.confirmCancel"))) return;
    setBusy(action);
    setError(null);
    try {
      const r = await fetch(`/api/admin/lessons/${lessonId}/attendance-action`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setError(d?.error ?? "Не получилось");
        return;
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => act("handled")}
        disabled={busy !== null}
        className="text-[12px] bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/60 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {busy === "handled" ? "..." : t("admin.attendance.handled")}
      </button>
      {response === "not_coming" && (
        <button
          type="button"
          onClick={() => act("cancel")}
          disabled={busy !== null}
          className="text-[12px] text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-500/50 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          {busy === "cancel" ? "..." : t("admin.attendance.cancel")}
        </button>
      )}
      {error && <span className="basis-full text-[11.5px] text-orange-soft">{error}</span>}
    </div>
  );
}
