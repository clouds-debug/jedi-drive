"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/lib/i18n/client";

type Props = {
  instructorId: string;
  instructorName: string;
  onClose: () => void;
};

export function ReviewModal({ instructorId, instructorName, onClose }: Props) {
  const { t } = useT();
  const router = useRouter();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState<number | null>(null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const shown = hover ?? rating;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          instructorId,
          rating,
          body: body.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? t("cab.review.modal.error"));
        return;
      }
      setDone(true);
      setTimeout(() => {
        onClose();
        router.refresh();
      }, 1400);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-navy-deep/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[520px] bg-navy border border-white/12 rounded-[var(--radius-card)] p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 mb-5">
            <div>
              <div className="text-[11px] font-mono text-orange tracking-[0.1em] mb-1">
                {t("cab.review.modal.kicker")}
              </div>
              <h3 className="text-[20px] text-white font-medium">
                {t("cab.review.modal.title.lead")} <span className="text-orange">{instructorName}</span>
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 grid place-items-center text-muted-on-navy hover:text-white transition-colors"
              aria-label={t("cab.review.modal.close")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          {done ? (
            <div className="py-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-orange/15 grid place-items-center mb-3">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2">
                  <path d="M5 12l5 5L20 6" />
                </svg>
              </div>
              <div className="text-white text-[16px] mb-1">{t("cab.review.modal.sent.title")}</div>
              <p className="text-[12.5px] text-muted-on-navy">
                {t("cab.review.modal.sent.desc")}
              </p>
            </div>
          ) : (
            <form onSubmit={submit}>
              <div className="mb-5">
                <div className="text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase mb-2">
                  {t("cab.review.modal.rating")}
                </div>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHover(n)}
                      onMouseLeave={() => setHover(null)}
                      className="p-1 transition-transform hover:scale-110"
                      aria-label={t("cab.review.modal.starsAria", { n })}
                    >
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill={n <= shown ? "#F97316" : "none"}
                        stroke={n <= shown ? "#F97316" : "rgba(255,255,255,0.25)"}
                        strokeWidth="1.5"
                      >
                        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-[13px] text-muted-on-navy font-mono tabular-nums">
                    {shown}/5
                  </span>
                </div>
              </div>

              <label className="block mb-5">
                <span className="block text-[10.5px] text-muted-on-navy tracking-[0.16em] uppercase mb-2">
                  {t("cab.review.modal.comment")}
                </span>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={4}
                  maxLength={800}
                  placeholder={t("cab.review.modal.placeholder")}
                  className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-3.5 py-2.5 text-[13.5px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/60 resize-none"
                />
                <span className="block text-right mt-1 text-[11px] text-muted-on-navy/70 font-mono">
                  {body.length}/800
                </span>
              </label>

              {error && (
                <div className="mb-4 text-[12.5px] text-orange-soft border border-orange/30 bg-orange/[0.06] rounded-lg px-3 py-2">
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={busy}
                  className="text-[13px] px-4 py-2 rounded-lg text-muted-on-navy hover:text-white transition-colors"
                >
                  {t("cab.review.modal.cancel")}
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="text-[13px] bg-orange hover:bg-orange/90 text-white px-4 py-2 rounded-lg disabled:opacity-60 transition-colors"
                >
                  {busy ? t("cab.review.modal.sending") : t("cab.review.modal.submit")}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
