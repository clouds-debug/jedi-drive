"use client";

import { useEffect, useRef, useState } from "react";
import { useContentCtx } from "./ContentProvider";
import { useLocale } from "@/lib/i18n/client";

type Props = {
  storageKey: string;
  children: string;
  as?: "span" | "div" | "p";
  multiline?: boolean;
  className?: string;
};

export function EditableText({
  storageKey,
  children: defaultText,
  as: Tag = "span",
  multiline = false,
  className,
}: Props) {
  const { overrides, isEditor, setLocalOverride } = useContentCtx();
  const locale = useLocale();
  const current = overrides[storageKey] ?? defaultText;

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(current);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement | null>(null);

  useEffect(() => {
    if (!editing) setDraft(current);
  }, [current, editing]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [editing]);

  if (!isEditor) {
    return <Tag className={className}>{current}</Tag>;
  }

  async function save() {
    const value = draft.trim();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/content", {
        method: value === defaultText ? "DELETE" : "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(
          value === defaultText
            ? { key: storageKey, locale }
            : { key: storageKey, value, locale },
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.error ?? "Не сохранилось");
        return;
      }
      setLocalOverride(storageKey, value === defaultText ? null : value);
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  function cancel() {
    setDraft(current);
    setEditing(false);
    setError(null);
  }

  if (editing) {
    const isOverridden = overrides[storageKey] !== undefined;
    return (
      <Tag className={`${className ?? ""} inline-block relative`}>
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) save();
            }}
            rows={4}
            className="bg-white/[0.08] border border-orange/60 rounded px-2 py-1 text-inherit font-inherit w-full min-w-[280px] focus:outline-none resize-y"
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
              if (e.key === "Enter") save();
            }}
            className="bg-white/[0.08] border border-orange/60 rounded px-2 py-0.5 text-inherit font-inherit min-w-[200px] focus:outline-none"
            style={{ width: `${Math.max(draft.length + 2, 20)}ch` }}
          />
        )}
        <span className="inline-flex items-center gap-1 ml-2 align-middle">
          <button
            type="button"
            disabled={busy}
            onClick={save}
            className="text-[10.5px] font-mono uppercase tracking-[0.1em] bg-orange hover:bg-[#EA670F] disabled:opacity-50 text-white px-2 py-0.5 rounded"
          >
            {busy ? "…" : "OK"}
          </button>
          <button
            type="button"
            onClick={cancel}
            className="text-[10.5px] font-mono uppercase tracking-[0.1em] bg-white/[0.06] hover:bg-white/[0.12] text-muted-on-navy px-2 py-0.5 rounded"
          >
            Esc
          </button>
          {isOverridden && (
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setDraft(defaultText);
                save();
              }}
              title="Сбросить к дефолту"
              className="text-[10.5px] font-mono uppercase tracking-[0.1em] bg-white/[0.04] hover:bg-white/[0.1] text-muted-on-navy px-2 py-0.5 rounded"
            >
              Сброс
            </button>
          )}
        </span>
        {error && (
          <span className="absolute -bottom-5 left-0 text-[11px] text-orange-soft whitespace-nowrap">
            {error}
          </span>
        )}
      </Tag>
    );
  }

  return (
    <Tag
      className={`${className ?? ""} group/edit relative inline cursor-text ${
        overrides[storageKey] !== undefined
          ? "outline outline-1 outline-orange/30 outline-offset-2 rounded-sm"
          : ""
      } hover:outline hover:outline-1 hover:outline-orange/60 hover:outline-offset-2 hover:rounded-sm`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setEditing(true);
      }}
      title="Кликни, чтобы изменить"
    >
      {current}
      <span
        aria-hidden
        className="inline-flex items-center justify-center w-4 h-4 ml-1 align-middle bg-orange/15 text-orange-soft rounded opacity-0 group-hover/edit:opacity-100 transition-opacity"
      >
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 20h4l10-10-4-4L4 16v4z" />
        </svg>
      </span>
    </Tag>
  );
}
