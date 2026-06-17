"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";

export function DecisionActions({ lessonId }: { lessonId: string }) {
  const { t } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState<"confirm" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  async function decide(action: "confirm" | "reject", payload?: { reason?: string }) {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("admin.error.generic"));
        return;
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (showReject) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder={t("admin.decision.reasonPlaceholder")}
          className="bg-white/[0.04] border border-white/12 rounded px-2.5 py-1.5 text-[12.5px] text-white focus:outline-none focus:border-orange/60 w-[220px]"
        />
        <button
          onClick={() => decide("reject", { reason })}
          disabled={busy !== null}
          className="text-[12px] bg-orange/20 hover:bg-orange/30 text-orange-soft border border-orange/40 px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          {busy === "reject" ? "..." : t("admin.decision.reject")}
        </button>
        <button
          onClick={() => setShowReject(false)}
          disabled={busy !== null}
          className="text-[12px] text-muted-on-navy hover:text-white px-2 py-1.5"
        >
          {t("admin.decision.back")}
        </button>
        {error && <span className="basis-full text-[11.5px] text-orange-soft">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => decide("confirm")}
        disabled={busy !== null}
        className="text-[12px] bg-orange hover:bg-orange/90 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {busy === "confirm" ? "..." : t("admin.decision.confirm")}
      </button>
      <button
        onClick={() => setShowReject(true)}
        disabled={busy !== null}
        className="text-[12px] text-muted-on-navy hover:text-orange-soft border border-white/15 hover:border-orange/40 px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {t("admin.decision.reject")}
      </button>
      {error && <span className="basis-full text-[11.5px] text-orange-soft">{error}</span>}
    </div>
  );
}
