"use client";

import { useState } from "react";
import { LessonCard } from "./LessonsList";
import type { LessonRow } from "@/lib/lessons";
import { useT } from "@/lib/i18n/client";

export function UpcomingList({
  initial,
  initialHasMore,
}: {
  initial: LessonRow[];
  initialHasMore: boolean;
}) {
  const { t } = useT();
  const [items, setItems] = useState(initial);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(`/api/lessons/upcoming?offset=${items.length}&limit=20`);
      const data = await res.json();
      setItems((prev) => [...prev, ...(data.items ?? [])]);
      setHasMore(Boolean(data.hasMore));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="space-y-3 mb-4">
        {items.map((lesson) => (
          <LessonCard key={lesson.id} lesson={lesson} accent />
        ))}
      </div>
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="w-full text-[12.5px] text-muted-on-navy hover:text-white bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/15 rounded-lg py-2.5 transition-colors disabled:opacity-50"
        >
          {loading ? t("cab.lessons.loading") : t("cab.lessons.loadMore")}
        </button>
      )}
    </div>
  );
}
