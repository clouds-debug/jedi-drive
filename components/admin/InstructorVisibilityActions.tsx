"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  instructorId: string;
  instructorName: string;
  isHidden: boolean;
  isDeleted: boolean;
};

export function InstructorVisibilityActions({
  instructorId,
  instructorName,
  isHidden,
  isDeleted,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (isDeleted) {
    return (
      <span className="text-[11.5px] font-mono uppercase tracking-[0.1em] text-red-300 border border-red-500/30 bg-red-500/[0.08] rounded px-2 py-0.5">
        Удалён с сайта
      </span>
    );
  }

  async function toggleHidden() {
    setBusy("hide");
    setError(null);
    try {
      const res = await fetch(`/api/admin/instructors/${instructorId}/visibility`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ hidden: !isHidden }),
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

  async function permanentDelete() {
    if (
      !confirm(
        `Удалить инструктора ${instructorName} с сайта?\n\nКарточка исчезнет, и привязанный к ней пользователь будет понижен до обычного ученика. Действие сложно откатить.`,
      )
    )
      return;
    setBusy("delete");
    setError(null);
    try {
      const res = await fetch(`/api/admin/instructors/${instructorId}/delete`, {
        method: "POST",
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

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        onClick={toggleHidden}
        disabled={busy !== null}
        className={`text-[12px] border px-2.5 py-1 rounded transition-colors disabled:opacity-50 ${
          isHidden
            ? "text-emerald-300 hover:text-emerald-200 border-emerald-500/40 hover:border-emerald-500/60"
            : "text-muted-on-navy hover:text-white border-white/15 hover:border-white/30"
        }`}
      >
        {busy === "hide" ? "..." : isHidden ? "Показать" : "Скрыть"}
      </button>
      <button
        onClick={permanentDelete}
        disabled={busy !== null}
        className="text-[12px] text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-500/50 px-2.5 py-1 rounded transition-colors disabled:opacity-50"
      >
        {busy === "delete" ? "..." : "Удалить инструктора"}
      </button>
      {error && (
        <span className="basis-full text-[11.5px] text-orange-soft">{error}</span>
      )}
    </div>
  );
}
