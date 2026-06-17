"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  initialLinked: boolean;
};

export function TelegramLinkButton({ initialLinked }: Props) {
  const [linked, setLinked] = useState(initialLinked);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  async function startLink() {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/profile/tg-token", { method: "POST" });
      const data = await r.json();
      if (!r.ok || !data?.deepLink) {
        setError(data?.error ?? "Не получилось");
        return;
      }
      setToken(data.token);
      window.open(data.deepLink, "_blank", "noopener");
      const started = Date.now();
      pollRef.current = window.setInterval(async () => {
        if (Date.now() - started > 5 * 60 * 1000) {
          if (pollRef.current) window.clearInterval(pollRef.current);
          pollRef.current = null;
          return;
        }
        try {
          const s = await fetch("/api/profile/tg-token");
          const sd = await s.json();
          if (sd?.linked) {
            setLinked(true);
            setToken(null);
            if (pollRef.current) window.clearInterval(pollRef.current);
            pollRef.current = null;
          }
        } catch {}
      }, 2000);
    } finally {
      setBusy(false);
    }
  }

  async function unlink() {
    if (!confirm("Отвязать Telegram? Уведомления приходить не будут.")) return;
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/profile/tg-token", { method: "DELETE" });
      if (!r.ok) {
        setError("Не получилось");
        return;
      }
      setLinked(false);
    } finally {
      setBusy(false);
    }
  }

  if (linked) {
    return (
      <div className="flex items-center gap-3 flex-wrap">
        <span className="inline-flex items-center gap-2 text-[12.5px] text-emerald-300 border border-emerald-500/40 bg-emerald-500/[0.08] rounded-lg px-3 py-1.5">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l4 4L19 7" />
          </svg>
          Telegram привязан
        </span>
        <button
          type="button"
          onClick={unlink}
          disabled={busy}
          className="text-[12px] text-muted-on-navy hover:text-red-300 border border-white/15 hover:border-red-500/40 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {busy ? "..." : "Отвязать"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={startLink}
        disabled={busy}
        className="inline-flex items-center gap-2 text-[13px] bg-[#229ED9] hover:bg-[#1d8cc1] text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.5 4.5L2.5 12l5.4 1.7L17 7l-7.4 8 .5 5.3 3.7-3.6 4.7 3.4 3-15.6z" />
        </svg>
        {busy ? "Подождите..." : "Привязать Telegram"}
      </button>
      {token && (
        <div className="text-[11.5px] text-muted-on-navy">
          Не открылся Telegram? Перейди вручную и отправь боту: <code className="text-orange-soft">/start {token}</code>
        </div>
      )}
      {error && <div className="text-[12px] text-orange-soft">{error}</div>}
    </div>
  );
}
