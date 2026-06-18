"use client";

import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { EditableText } from "../content/EditableText";
import { topics, questions } from "@/lib/tickets/data";
import { TopicProgressBadge, TopicProgressBar } from "./TopicProgressBadge";
import { L, useT } from "@/lib/i18n/client";

export function TicketsTopics() {
  const { t } = useT();
  return (
    <section id="topics" className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="02">
            <EditableText storageKey="tickets.topics.section.label">{t("tickets.topics.section.label")}</EditableText>
          </SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            <EditableText storageKey="tickets.topics.title.lead">{t("tickets.topics.title.lead")}</EditableText>{" "}
            <span className="text-orange">
              <EditableText storageKey="tickets.topics.title.accent">{t("tickets.topics.title.accent")}</EditableText>
            </span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-10 max-w-[520px]">
            <EditableText storageKey="tickets.topics.subtitle" multiline>{t("tickets.topics.subtitle")}</EditableText>
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {topics.map((topic, i) => {
            const count = questions.filter((q) => q.topicId === topic.id).length;
            const titleKey = `tickets.topic.${topic.id}.title`;
            const descKey = `tickets.topic.${topic.id}.desc`;
            const num = String(i + 1).padStart(2, "0");
            return (
              <Reveal key={topic.id} delay={i * 50}>
                <L
                  href={`/tickets/quiz?mode=topic&topic=${topic.id}`}
                  className="group relative block bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 lg:p-7 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.08] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                  <div className="relative flex items-start justify-between mb-5 lg:mb-6">
                    <span className="font-mono text-[26px] lg:text-[30px] leading-none text-orange tabular-nums tracking-[-0.02em]">
                      {num}
                    </span>
                    <span className="mt-1 flex flex-col items-end gap-1">
                      <span className="text-[10.5px] text-muted-on-navy tracking-[0.12em] uppercase">
                        {t("tickets.topics.questions", { n: count })}
                      </span>
                      <TopicProgressBadge topicId={topic.id} total={count} />
                    </span>
                  </div>

                  <h3 className="relative text-[17px] lg:text-[18px] font-medium text-white mb-2 leading-snug">
                    <EditableText storageKey={titleKey}>{t(titleKey)}</EditableText>
                  </h3>
                  <p className="relative text-[13.5px] lg:text-[14px] text-muted-on-navy leading-[1.6]">
                    <EditableText storageKey={descKey} multiline>{t(descKey)}</EditableText>
                  </p>
                  <TopicProgressBar topicId={topic.id} />

                  <div className="relative mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[12px] text-muted-on-navy">
                    <span>{t("tickets.topics.start")}</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FDBA74"
                      strokeWidth="2"
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </L>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
