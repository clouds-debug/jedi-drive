"use client";

import { useEffect, useState } from "react";
import { getMistakeIds } from "@/lib/tickets/progress";
import { useT } from "@/lib/i18n/client";

export function MistakesBadge() {
  const { t, locale } = useT();
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setCount(getMistakeIds().length);
    update();
    window.addEventListener("jd-tickets-progress", update);
    return () => window.removeEventListener("jd-tickets-progress", update);
  }, []);

  if (count === null) return null;

  if (count === 0) {
    return (
      <span className="text-[10.5px] text-muted-on-navy/80 tracking-[0.14em] uppercase">
        {t("tickets.quiz.mistakes.empty")}
      </span>
    );
  }

  let wordKey = "tickets.quiz.mistakes.word.many";
  if (locale === "ru") {
    if (count % 10 === 1 && count % 100 !== 11) wordKey = "tickets.quiz.mistakes.word.one";
    else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100))
      wordKey = "tickets.quiz.mistakes.word.few";
  }

  return (
    <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono tracking-[0.08em] px-2 py-0.5 rounded bg-orange/15 text-orange-soft border border-orange/30">
      {count} {t(wordKey)}
    </span>
  );
}
