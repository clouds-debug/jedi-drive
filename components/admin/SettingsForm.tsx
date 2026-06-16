"use client";

import { useState } from "react";

type Initial = {
  practice: number;
};

export function SettingsForm({ initial }: { initial: Initial }) {
  const [practice, setPractice] = useState(String(initial.practice));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ practice: Number(practice) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Не получилось сохранить");
        return;
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label htmlFor="practice" className="block">
        <span className="block text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">
          Порог автоподтверждения
        </span>
        <input
          id="practice"
          type="number"
          min={0}
          max={100}
          step={1}
          value={practice}
          onChange={(e) => setPractice(e.target.value)}
          className="w-32 bg-white/[0.04] border border-white/12 rounded-lg px-3.5 py-2.5 text-[15px] text-white focus:outline-none focus:border-orange/70 transition-colors tabular-nums"
        />
        <span className="block mt-1.5 text-[11.5px] text-muted-on-navy/80 leading-[1.55]">
          0 — авто-подтверждать всегда, 1 — после первого проведённого занятия, и т.д.
        </span>
      </label>

      <div className="flex items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={busy}
          className="bg-orange hover:bg-orange/90 disabled:opacity-50 text-white font-medium text-[13.5px] px-5 py-2.5 rounded-lg transition-colors"
        >
          {busy ? "Сохраняем..." : "Сохранить"}
        </button>
        {saved && (
          <span className="text-[12.5px] text-orange-soft inline-flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12l4 4L19 7" />
            </svg>
            Сохранено
          </span>
        )}
        {error && (
          <span className="text-[12.5px] text-orange-soft">{error}</span>
        )}
      </div>
    </form>
  );
}
