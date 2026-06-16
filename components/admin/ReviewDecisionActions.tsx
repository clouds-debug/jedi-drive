"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ReviewDecisionActions({ reviewId }: { reviewId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");

  async function decide(action: "approve" | "reject", payload?: { reason?: string }) {
    setBusy(action);
    setError(null);
    try {
      const res = await fetch(`/api/admin/reviews/${reviewId}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Не получилось");
        return;
      }
      router.refresh();
    } finally {
      setBusy(null);
    }
  }

  if (rejectMode) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Причина (необязательно)"
          className="bg-white/[0.04] border border-white/12 rounded px-2.5 py-1.5 text-[12.5px] text-white focus:outline-none focus:border-orange/60 w-[240px]"
        />
        <button
          onClick={() => decide("reject", { reason })}
          disabled={busy !== null}
          className="text-[12px] bg-orange/20 hover:bg-orange/30 text-orange-soft border border-orange/40 px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
        >
          {busy === "reject" ? "..." : "Отклонить"}
        </button>
        <button
          onClick={() => setRejectMode(false)}
          disabled={busy !== null}
          className="text-[12px] text-muted-on-navy hover:text-white px-2 py-1.5"
        >
          Назад
        </button>
        {error && <span className="basis-full text-[11.5px] text-orange-soft">{error}</span>}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={() => decide("approve")}
        disabled={busy !== null}
        className="text-[12px] bg-orange hover:bg-orange/90 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {busy === "approve" ? "..." : "Одобрить"}
      </button>
      <button
        onClick={() => setRejectMode(true)}
        disabled={busy !== null}
        className="text-[12px] text-muted-on-navy hover:text-orange-soft border border-white/15 hover:border-orange/40 px-2.5 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        Отклонить
      </button>
      {error && <span className="basis-full text-[11.5px] text-orange-soft">{error}</span>}
    </div>
  );
}
