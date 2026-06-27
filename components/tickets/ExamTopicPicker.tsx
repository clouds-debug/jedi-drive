"use client";

import { useState, useMemo } from "react";
import { topics, questions } from "@/lib/tickets/data";
import { useT } from "@/lib/i18n/client";

const STORAGE_KEY = "jd:examTopics";

export function ExamTopicPicker({ onStart }: { onStart: (topicIds: string[]) => void }) {
  const { t } = useT();
  const counts = useMemo(() => {
    const m = new Map<string, number>();
    for (const q of questions) m.set(q.topicId, (m.get(q.topicId) ?? 0) + 1);
    return m;
  }, []);

  const [selected, setSelected] = useState<Set<string>>(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as string[];
          if (Array.isArray(parsed) && parsed.length > 0) return new Set(parsed);
        }
      } catch {}
    }
    return new Set(topics.map((tp) => tp.id));
  });

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(topics.map((tp) => tp.id)));
  }
  function clearAll() {
    setSelected(new Set());
  }

  const availableCount = useMemo(
    () => topics.filter((tp) => selected.has(tp.id)).reduce((acc, tp) => acc + (counts.get(tp.id) ?? 0), 0),
    [selected, counts],
  );
  const canStart = selected.size > 0 && availableCount >= 1;

  function start() {
    if (!canStart) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...selected]));
    } catch {}
    onStart([...selected]);
  }

  return (
    <div className="space-y-6">
      <div className="relative bg-white/[0.04] border border-white/15 border-l-[3px] border-l-orange rounded-2xl p-6 sm:p-8 overflow-hidden">
        <div className="absolute -right-12 -top-12 w-56 h-56 bg-orange/[0.10] rounded-full blur-[80px] pointer-events-none" aria-hidden />

        <div className="relative flex items-start justify-between gap-4 flex-wrap mb-6">
          <div>
            <div className="text-[11px] text-orange-soft tracking-[0.14em] uppercase mb-2">
              {t("tickets.exam.picker.kicker")}
            </div>
            <h1 className="text-[24px] sm:text-[28px] font-medium text-white tracking-[-0.01em] leading-tight mb-1.5">
              {t("tickets.exam.picker.title")}
            </h1>
            <p className="text-[13px] text-muted-on-navy leading-[1.6] max-w-[520px]">
              {t("tickets.exam.picker.subtitle")}
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              type="button"
              onClick={selectAll}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 text-white px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
            >
              {t("tickets.exam.picker.selectAll")}
            </button>
            <button
              type="button"
              onClick={clearAll}
              className="bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 text-white px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors"
            >
              {t("tickets.exam.picker.clear")}
            </button>
          </div>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 gap-2">
          {topics.map((tp) => {
            const isOn = selected.has(tp.id);
            const count = counts.get(tp.id) ?? 0;
            return (
              <label
                key={tp.id}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  isOn
                    ? "bg-orange/[0.08] border-orange/40 hover:bg-orange/[0.12]"
                    : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isOn}
                  onChange={() => toggle(tp.id)}
                  className="sr-only"
                />
                <span
                  className={`shrink-0 w-5 h-5 rounded-md border grid place-items-center transition-colors ${
                    isOn ? "bg-orange border-orange" : "bg-transparent border-white/30"
                  }`}
                  aria-hidden
                >
                  {isOn && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <path d="M5 12l5 5L20 6" />
                    </svg>
                  )}
                </span>
                <span className="flex-1 min-w-0 text-[13.5px] text-white leading-snug">
                  {t(`tickets.topic.${tp.id}.title`)}
                </span>
                <span className="shrink-0 text-[11px] text-muted-on-navy tabular-nums">{count}</span>
              </label>
            );
          })}
        </div>

        <div className="relative mt-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="text-[12.5px] text-muted-on-navy">
            {t("tickets.exam.picker.selectedCount", { n: selected.size, q: availableCount })}
          </div>
          <button
            type="button"
            onClick={start}
            disabled={!canStart}
            className="inline-flex items-center gap-2 bg-orange text-white px-6 py-3 rounded-lg text-[13.5px] font-medium hover:bg-[#EA670F] hover:translate-x-0.5 transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {t("tickets.exam.picker.start")}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
