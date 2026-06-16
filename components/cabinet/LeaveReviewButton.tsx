"use client";

import { useState } from "react";
import { ReviewModal } from "./ReviewModal";
import { useT } from "@/lib/i18n/client";

type Props = {
  instructorId: string;
  instructorName: string;
  alreadyReviewed: boolean;
};

export function LeaveReviewButton({
  instructorId,
  instructorName,
  alreadyReviewed,
}: Props) {
  const { t } = useT();
  const [open, setOpen] = useState(false);

  if (alreadyReviewed) {
    return (
      <span className="text-[11.5px] text-muted-on-navy/70 italic">
        {t("cab.review.already")}
      </span>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-[12px] text-orange-soft hover:text-orange border border-orange/25 hover:border-orange/50 px-2.5 py-1 rounded transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
        </svg>
        {t("cab.review.leave")}
      </button>
      {open && (
        <ReviewModal
          instructorId={instructorId}
          instructorName={instructorName}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
