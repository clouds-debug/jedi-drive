"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function TheoryHandledButton({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onClick() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/theory-handled`, {
        method: "POST",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Не получилось");
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
        onClick={onClick}
        disabled={busy}
        className="text-[12px] bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 hover:border-emerald-500/60 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {busy ? "..." : "Обработана"}
      </button>
      {error && <span className="text-[11.5px] text-orange-soft">{error}</span>}
    </span>
  );
}
