"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RescheduleModal } from "@/components/cabinet/RescheduleModal";

type Props = {
  lessonId: string;
  kind: "theory" | "practice";
  instructorId: string | null;
  scheduledAt: string;
  durationMin: number;
};

export function ConfirmedActions({
  lessonId,
  kind,
  instructorId,
  scheduledAt,
  durationMin,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState<"cancel" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);

  async function onCancel() {
    if (!confirm("Отменить занятие? Ученик получит уведомление.")) return;
    setBusy("cancel");
    setError(null);
    try {
      const res = await fetch(`/api/admin/lessons/${lessonId}/decision`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "reject", reason: "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Не получилось отменить");
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
        onClick={() => setShowReschedule(true)}
        disabled={busy !== null}
        className="text-[12px] text-muted-on-navy hover:text-white border border-white/15 hover:border-white/30 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        Перенести
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={busy !== null}
        className="text-[12px] text-orange-soft hover:text-orange border border-orange/30 hover:border-orange/50 px-3 py-1.5 rounded transition-colors disabled:opacity-50"
      >
        {busy === "cancel" ? "Отменяем..." : "Отменить"}
      </button>
      {error && (
        <span className="basis-full text-[11.5px] text-orange-soft mt-1">{error}</span>
      )}

      {showReschedule && (
        <RescheduleModal
          lessonId={lessonId}
          kind={kind}
          instructorId={instructorId}
          durationMin={durationMin}
          currentScheduledAt={scheduledAt}
          endpoint={`/api/admin/lessons/${lessonId}/reschedule`}
          onClose={() => setShowReschedule(false)}
          onDone={() => {
            setShowReschedule(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
