"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useContentCtx } from "./ContentProvider";

export function EditorToggle() {
  const { canEdit, isEditor } = useContentCtx();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (!canEdit) return null;

  async function toggle() {
    setBusy(true);
    try {
      await fetch("/api/admin/editor-mode", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ on: !isEditor }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={isEditor ? "Выключить режим редактора" : "Включить режим редактора"}
      title={isEditor ? "Режим редактора включён" : "Режим редактора выключен"}
      className={`fixed bottom-5 right-5 z-50 inline-flex items-center gap-2.5 pl-3 pr-3.5 py-2 rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.35)] border text-[12px] font-medium transition-all active:scale-95 ${
        isEditor
          ? "bg-orange text-white border-orange/40 hover:bg-[#EA670F]"
          : "bg-navy/90 backdrop-blur text-muted-on-navy border-white/15 hover:text-white hover:border-white/30"
      } ${busy ? "opacity-60 cursor-wait" : ""}`}
    >
      <span
        className={`relative w-8 h-4 rounded-full transition-colors ${
          isEditor ? "bg-white/30" : "bg-white/15"
        }`}
      >
        <span
          className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${
            isEditor ? "left-[18px]" : "left-0.5"
          }`}
        />
      </span>
      <span>Редактор</span>
    </button>
  );
}
