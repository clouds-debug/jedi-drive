"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useT } from "@/lib/i18n/client";

export function LogoutButton() {
  const { t } = useT();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onClick() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/cabinet/login");
    router.refresh();
  }

  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center gap-2 bg-white/[0.04] border border-white/15 hover:bg-white/[0.08] hover:border-white/30 disabled:opacity-50 px-3 py-1.5 rounded-lg text-[12.5px] transition-colors"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M15 17l5-5-5-5" />
        <path d="M20 12H9" />
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      </svg>
      {pending ? t("cab.logout.pending") : t("cab.logout.idle")}
    </button>
  );
}
