"use client";

import { useEffect, useState } from "react";

type Moderator = {
  chat_id: string;
  name: string;
  added_at: string;
  added_by: string | null;
};

export function ModeratorsForm({ initial }: { initial: Moderator[] }) {
  const [list, setList] = useState<Moderator[]>(initial);
  const [chatId, setChatId] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      const r = await fetch("/api/admin/moderators");
      const d = await r.json();
      if (r.ok) setList(d.moderators ?? []);
    } catch {}
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/admin/moderators", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ chatId, name }),
      });
      const d = await r.json();
      if (!r.ok) {
        setError(d?.error ?? "Не получилось");
        return;
      }
      setChatId("");
      setName("");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  async function remove(cid: string) {
    if (!confirm(`Удалить модератора с chat_id ${cid}?`)) return;
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/moderators?chatId=${cid}`, { method: "DELETE" });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        setError(d?.error ?? "Не получилось удалить");
        return;
      }
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="block text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">
            chat_id
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={chatId}
            onChange={(e) => setChatId(e.target.value)}
            placeholder="5795240800"
            className="w-44 bg-white/[0.04] border border-white/12 rounded-lg px-3 py-2 text-[14px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/60 tabular-nums"
          />
        </label>
        <label className="block flex-1 min-w-[180px]">
          <span className="block text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-1.5">
            Имя для заметки
          </span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Анри"
            className="w-full bg-white/[0.04] border border-white/12 rounded-lg px-3 py-2 text-[14px] text-white placeholder:text-muted-on-navy/60 focus:outline-none focus:border-orange/60"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="bg-orange hover:bg-orange/90 disabled:opacity-50 text-white text-[13.5px] font-medium px-4 py-2 rounded-lg transition-colors"
        >
          {busy ? "..." : "Добавить"}
        </button>
      </form>
      {error && <div className="text-[12.5px] text-orange-soft">{error}</div>}

      <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase">
        Активные модераторы ({list.length})
      </div>

      {list.length === 0 ? (
        <div className="text-[13px] text-muted-on-navy bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
          Пока никого. Добавь chat_id, который модератор получит от @JediDriveAdmin при /start.
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((m) => (
            <div
              key={m.chat_id}
              className="flex items-center justify-between gap-3 bg-white/[0.03] border border-white/10 rounded-lg px-4 py-2.5"
            >
              <div className="min-w-0">
                <div className="text-[14px] text-white truncate">{m.name}</div>
                <div className="text-[11.5px] text-muted-on-navy font-mono tabular-nums">
                  chat_id: {m.chat_id}
                  {m.added_by ? ` · добавил @${m.added_by}` : ""}
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(m.chat_id)}
                disabled={busy}
                className="text-[12px] text-red-300 hover:text-red-200 border border-red-500/30 hover:border-red-500/50 px-2.5 py-1 rounded transition-colors disabled:opacity-50"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
