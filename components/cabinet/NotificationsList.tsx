"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useT } from "@/lib/i18n/client";

type Item = {
  id: string;
  title: string;
  body: string | null;
  kind: string;
  isRead: boolean;
  createdAt: string;
};

function useFormatDate() {
  const { locale } = useT();
  const tag = locale === "ge" ? "ka-GE" : "ru-RU";
  return (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString(tag, {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
}

function kindIcon(kind: string) {
  if (kind === "booking")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 3v4M16 3v4" />
      </svg>
    );
  if (kind === "warning")
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 9v4M12 17h.01" />
        <path d="M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      </svg>
    );
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

export function NotificationsList({
  initial,
  initialHasMore,
}: {
  initial: Item[];
  initialHasMore: boolean;
}) {
  const { t, locale } = useT();
  const formatDate = useFormatDate();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [items, setItems] = useState(initial);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loadingMore, setLoadingMore] = useState(false);

  const hasUnread = items.some((i) => !i.isRead);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/notifications?offset=${items.length}&limit=20`);
      const data = await res.json();
      setItems((prev) => [...prev, ...(data.items ?? [])]);
      setHasMore(Boolean(data.hasMore));
    } finally {
      setLoadingMore(false);
    }
  }

  async function markAll() {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setItems((prev) => prev.map((i) => ({ ...i, isRead: true })));
    startTransition(() => router.refresh());
  }

  async function markOne(id: string) {
    await fetch("/api/notifications/mark-read", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: [id] }),
    });
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, isRead: true } : i)));
    startTransition(() => router.refresh());
  }

  if (items.length === 0) {
    return (
      <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6">
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
        <div className="relative text-[13.5px] text-muted-on-navy">
          {t("cab.notifications.empty")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-muted-on-navy">
          {t("cab.notifications.count", { n: items.length, word: t(notifWordKey(items.length, locale)) })}
        </span>
        <button
          type="button"
          onClick={markAll}
          disabled={!hasUnread || pending}
          className="text-[12.5px] text-muted-on-navy hover:text-white disabled:opacity-40 transition-colors"
        >
          {t("cab.notifications.markAll")}
        </button>
      </div>

      <ul className="space-y-2 mb-4">
        {items.map((n) => (
          <li
            key={n.id}
            className={`relative bg-white/[0.03] border ${
              n.isRead ? "border-white/8" : "border-orange/40"
            } border-l-[3px] ${
              n.isRead ? "border-l-white/15" : "border-l-orange"
            } rounded-lg p-4 transition-colors hover:bg-white/[0.05]`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`w-8 h-8 rounded-lg grid place-items-center shrink-0 ${
                  n.isRead ? "bg-white/[0.05] text-muted-on-navy" : "bg-orange/15 text-orange-soft"
                }`}
              >
                {kindIcon(n.kind)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[13.5px] text-white font-medium truncate">{n.title}</span>
                  {!n.isRead && <span className="w-1.5 h-1.5 bg-orange rounded-full shrink-0" aria-hidden />}
                </div>
                {n.body && (
                  <p className="text-[12.5px] text-muted-on-navy leading-[1.5]">{n.body}</p>
                )}
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[11px] text-muted-on-navy/80 font-mono tracking-[0.04em]">
                    {formatDate(n.createdAt)}
                  </span>
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => markOne(n.id)}
                      className="text-[11px] text-orange-soft hover:text-orange transition-colors"
                    >
                      {t("cab.notifications.markOne")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loadingMore}
          className="w-full text-[12.5px] text-muted-on-navy hover:text-white bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.08] hover:border-white/15 rounded-lg py-2.5 transition-colors disabled:opacity-50"
        >
          {loadingMore ? t("cab.lessons.loading") : t("cab.lessons.loadMore")}
        </button>
      )}
    </div>
  );
}

function notifWordKey(n: number, locale: string): string {
  if (locale === "ge") return "cab.notifications.word.many";
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "cab.notifications.word.one";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return "cab.notifications.word.few";
  return "cab.notifications.word.many";
}
