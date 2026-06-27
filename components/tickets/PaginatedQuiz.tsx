"use client";

import { useState } from "react";
import type { Question, Topic, LocalizedText } from "@/lib/tickets/data";
import { recordQuestionResult } from "@/lib/tickets/progress";
import { EditableText } from "@/components/content/EditableText";
import { useT } from "@/lib/i18n/client";
import type { Locale } from "@/lib/i18n/config";
import { QuizResults } from "./Quiz";

const PAGE_SIZE = 10;

function pick(text: LocalizedText, locale: Locale): string {
  return text[locale] || text.ru;
}

type Props = {
  questions: Question[];
  mode: "exam" | "topic" | "mistakes";
  topic?: Topic;
};

export function PaginatedQuiz({ questions, mode, topic }: Props) {
  const { t, locale } = useT();
  const [page, setPage] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return null;
  }

  if (finished) {
    return <QuizResults questions={questions} answers={answers} mode={mode} topic={topic} />;
  }

  const pageCount = Math.max(1, Math.ceil(questions.length / PAGE_SIZE));
  const start = page * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, questions.length);
  const pageQuestions = questions.slice(start, end);
  const answeredCount = answers.filter((a) => a !== null).length;
  const topicTitle = topic ? t(`tickets.topic.${topic.id}.title`) : "";

  function select(qIndex: number, optionIndex: number) {
    if (answers[qIndex] !== null) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qIndex] = optionIndex;
      return next;
    });
    recordQuestionResult(questions[qIndex].id, optionIndex === questions[qIndex].correctIndex);
  }

  function goToPage(p: number) {
    setPage(Math.max(0, Math.min(pageCount - 1, p)));
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white/[0.04] border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between gap-3 text-[11.5px] text-muted-on-navy mb-2 tracking-[0.06em] flex-wrap">
          <span>{t("tickets.quiz.progress")}</span>
          <div className="flex items-center gap-3 tabular-nums">
            <span>{answeredCount} / {questions.length}</span>
          </div>
        </div>
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange transition-all duration-500 ease-out"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {pageQuestions.map((current, idx) => {
          const qIndex = start + idx;
          const currentAnswer = answers[qIndex];
          const hasAnswered = currentAnswer !== null;

          return (
            <article
              key={current.id}
              className="relative bg-white/[0.04] border border-white/15 border-l-[3px] border-l-orange rounded-2xl p-5 sm:p-6 lg:p-7 overflow-hidden"
            >
              <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[80px] pointer-events-none" aria-hidden />

              <div className="relative flex items-center justify-between mb-4">
                <span className="text-[11px] text-muted-on-navy tracking-[0.14em] uppercase">
                  {t("tickets.quiz.question", { i: qIndex + 1, n: questions.length })}
                </span>
                {topic && (
                  <span className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.12em] uppercase">
                    {topicTitle}
                  </span>
                )}
              </div>

              {current.image && (
                <div className="relative mb-4 rounded-xl overflow-hidden border border-white/10 bg-[#0F1430]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={current.image}
                    alt={t("tickets.quiz.image.alt")}
                    loading="lazy"
                    className="block w-full h-auto"
                  />
                </div>
              )}

              <h2 className="relative text-[16px] sm:text-[17px] lg:text-[18px] font-medium text-white leading-snug mb-5">
                <EditableText storageKey={`tickets.q.${current.id}.text.${locale}`} multiline>
                  {pick(current.text, locale)}
                </EditableText>
              </h2>

              <div className="relative space-y-2 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3">
                {current.options.map((opt, i) => {
                  const isSelected = currentAnswer === i;
                  const isCorrect = i === current.correctIndex;
                  const showCorrect = hasAnswered && isCorrect;
                  const showWrong = isSelected && !isCorrect;
                  const isLoneLast =
                    current.options.length % 2 === 1 && i === current.options.length - 1;

                  let cls =
                    "relative w-full text-left bg-white/[0.03] border border-white/10 rounded-lg px-3.5 py-3 lg:px-4 lg:py-3 text-[13.5px] lg:text-[14.5px] text-white transition-all";
                  if (isLoneLast) cls += " lg:col-span-2";
                  if (showCorrect) cls += " border-[#22C55E]/60 bg-[#22C55E]/[0.08]";
                  else if (showWrong) cls += " border-orange/60 bg-orange/[0.08]";
                  else if (!hasAnswered) cls += " hover:bg-white/[0.06] hover:border-white/25 cursor-pointer";
                  else cls += " opacity-60";

                  return (
                    <div
                      key={i}
                      role="button"
                      tabIndex={hasAnswered ? -1 : 0}
                      aria-disabled={hasAnswered}
                      onClick={() => {
                        if (!hasAnswered) select(qIndex, i);
                      }}
                      onKeyDown={(e) => {
                        if (!hasAnswered && (e.key === "Enter" || e.key === " ")) {
                          e.preventDefault();
                          select(qIndex, i);
                        }
                      }}
                      className={cls}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-[12px] font-medium transition-colors ${
                            showCorrect
                              ? "bg-[#22C55E] text-white"
                              : showWrong
                              ? "bg-orange text-white"
                              : "bg-white/[0.08] text-muted-on-navy"
                          }`}
                        >
                          {showCorrect ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M5 12l5 5L20 6" />
                            </svg>
                          ) : showWrong ? (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <path d="M6 6l12 12M6 18L18 6" />
                            </svg>
                          ) : (
                            i + 1
                          )}
                        </span>
                        <span>
                          <EditableText storageKey={`tickets.q.${current.id}.opt.${i}.${locale}`} multiline>
                            {pick(opt, locale)}
                          </EditableText>
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        onChange={goToPage}
        onFinish={() => setFinished(true)}
        finishLabel={t("tickets.quiz.finish")}
        prevLabel={t("tickets.quiz.prev")}
        nextLabel={t("tickets.quiz.next")}
      />
    </div>
  );
}

function Pagination({
  page,
  pageCount,
  onChange,
  onFinish,
  finishLabel,
  prevLabel,
  nextLabel,
}: {
  page: number;
  pageCount: number;
  onChange: (p: number) => void;
  onFinish: () => void;
  finishLabel: string;
  prevLabel: string;
  nextLabel: string;
}) {
  const pages = Array.from({ length: pageCount }, (_, i) => i);
  const isLast = page === pageCount - 1;
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-lg p-4 flex items-center justify-between gap-3 flex-wrap">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="inline-flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 text-white px-3.5 py-2 rounded-lg text-[12.5px] font-medium transition-all disabled:opacity-30 disabled:pointer-events-none"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M19 12H5M11 6l-6 6 6 6" />
        </svg>
        {prevLabel}
      </button>
      <div className="flex items-center gap-1.5 flex-wrap justify-center">
        {pages.map((p) => {
          const isActive = p === page;
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              aria-current={isActive ? "page" : undefined}
              className={`min-w-[34px] h-[34px] px-2 rounded-md text-[12.5px] font-medium tabular-nums transition-colors ${
                isActive
                  ? "bg-orange text-white"
                  : "bg-white/[0.04] text-muted-on-navy hover:bg-white/[0.08] hover:text-white border border-white/10"
              }`}
            >
              {p + 1}
            </button>
          );
        })}
      </div>
      {isLast ? (
        <button
          type="button"
          onClick={onFinish}
          className="inline-flex items-center gap-2 bg-orange text-white px-4 py-2 rounded-lg text-[12.5px] font-medium hover:bg-[#EA670F] transition-colors"
        >
          {finishLabel}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          className="inline-flex items-center gap-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-white/30 text-white px-3.5 py-2 rounded-lg text-[12.5px] font-medium transition-all"
        >
          {nextLabel}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
