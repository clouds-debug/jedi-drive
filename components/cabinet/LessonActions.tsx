"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RescheduleModal } from "./RescheduleModal";
import { useT } from "@/lib/i18n/client";

const MIN_HOURS = 24;

type Props = {
  lessonId: string;
  scheduledAtIso: string;
  kind: "theory" | "practice";
  instructorId: string | null;
  durationMin: number;
};

export function LessonActions({ lessonId, scheduledAtIso, kind, instructorId, durationMin }: Props) {
  const { t } = useT();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);

  if (kind === "theory") {
    return null;
  }

  const hoursLeft = (new Date(scheduledAtIso).getTime() - Date.now()) / 36e5;
  const canEdit = hoursLeft >= MIN_HOURS;

  if (!canEdit) {
    return (
      <div className="text-[11px] text-muted-on-navy/70 italic">
        {t("cab.lesson.tooLate", { h: MIN_HOURS })}
      </div>
    );
  }

  async function onCancel() {
    if (!confirm(t("cab.lesson.confirmCancel"))) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/lessons/${lessonId}/cancel`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("cab.lesson.cancelError"));
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => setShowReschedule(true)}
        disabled={busy}
        className="text-[12px] text-muted-on-navy hover:text-white border border-white/10 hover:border-white/25 px-2.5 py-1 rounded transition-colors disabled:opacity-50"
      >
        {t("cab.lesson.reschedule")}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={busy}
        className="text-[12px] text-orange-soft hover:text-orange border border-orange/25 hover:border-orange/50 px-2.5 py-1 rounded transition-colors disabled:opacity-50"
      >
        {busy ? t("cab.lesson.cancelling") : t("cab.lesson.cancel")}
      </button>
      {error && (
        <span className="text-[11.5px] text-orange-soft basis-full mt-1">{error}</span>
      )}

      {showReschedule && (
        <RescheduleModal
          lessonId={lessonId}
          kind={kind}
          instructorId={instructorId}
          durationMin={durationMin}
          currentScheduledAt={scheduledAtIso}
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
