"use client";

import { useEffect, useState } from "react";
import { getTopicProgress, type TopicProgress } from "@/lib/tickets/progress";

export function TopicProgressBadge({ topicId, total }: { topicId: string; total: number }) {
  const [progress, setProgress] = useState<TopicProgress | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setProgress(getTopicProgress(topicId));
    const onChange = () => setProgress(getTopicProgress(topicId));
    window.addEventListener("jd-tickets-progress", onChange);
    return () => window.removeEventListener("jd-tickets-progress", onChange);
  }, [topicId]);

  if (!hydrated || !progress) return null;
  void total;

  const pct = progress.total > 0 ? Math.round((progress.best / progress.total) * 100) : 0;
  const isMastered = pct >= 90;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[10.5px] font-mono tracking-[0.08em] px-2 py-0.5 rounded ${
        isMastered
          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
          : "bg-orange/10 text-orange-soft border border-orange/25"
      }`}
      title={`Лучший: ${progress.best}/${progress.total} · попыток: ${progress.attempts}`}
    >
      {progress.best}/{progress.total}
      {isMastered && (
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden>
          <path d="M5 12l5 5L20 6" />
        </svg>
      )}
    </span>
  );
}

export function TopicProgressBar({ topicId }: { topicId: string }) {
  const [progress, setProgress] = useState<TopicProgress | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setProgress(getTopicProgress(topicId));
    const onChange = () => setProgress(getTopicProgress(topicId));
    window.addEventListener("jd-tickets-progress", onChange);
    return () => window.removeEventListener("jd-tickets-progress", onChange);
  }, [topicId]);

  if (!hydrated || !progress) return null;

  const pct = progress.total > 0 ? (progress.best / progress.total) * 100 : 0;
  const isMastered = pct >= 90;

  return (
    <div className="mt-2 h-1 bg-white/[0.06] rounded-full overflow-hidden">
      <div
        className={`h-full transition-all duration-700 ${
          isMastered ? "bg-emerald-400" : "bg-orange"
        }`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
