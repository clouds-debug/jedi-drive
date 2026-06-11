"use client";

import Link from "next/link";
import { useState } from "react";
import type { Question, Topic } from "@/lib/tickets/data";

type QuizProps = {
  questions: Question[];
  mode: "exam" | "topic";
  topic?: Topic;
};

export function Quiz({ questions, mode, topic }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => Array(questions.length).fill(null));
  const [finished, setFinished] = useState(false);

  if (questions.length === 0) {
    return (
      <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-10 text-center">
        <div className="text-[16px] text-white mb-3">В этой теме пока нет вопросов</div>
        <p className="text-[13px] text-muted-on-navy mb-6">Скоро добавим — а пока попробуй другие темы или экзамен.</p>
        <Link
          href="/tickets"
          className="inline-flex items-center gap-2 bg-orange text-white px-5 py-2.5 rounded-lg text-[13.5px] font-medium hover:bg-[#EA670F] transition-colors"
        >
          Назад к билетам
        </Link>
      </div>
    );
  }

  if (finished) {
    return <QuizResults questions={questions} answers={answers} mode={mode} topic={topic} />;
  }

  const current = questions[index];
  const currentAnswer = answers[index];
  const hasAnswered = currentAnswer !== null;

  function select(i: number) {
    if (hasAnswered) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = i;
      return next;
    });
  }

  function next() {
    if (index < questions.length - 1) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  }

  return (
    <div className="space-y-6">
      <ProgressBar index={index} total={questions.length} />

      <article
        key={current.id}
        className="relative bg-white/[0.04] border border-white/15 border-l-[3px] border-l-orange rounded-2xl p-6 sm:p-8 overflow-hidden animate-card-in"
      >
        <div className="absolute -right-12 -top-12 w-56 h-56 bg-orange/[0.10] rounded-full blur-[80px] pointer-events-none" aria-hidden />

        <div className="relative flex items-center justify-between mb-5">
          <span className="text-[11px] text-muted-on-navy tracking-[0.14em] uppercase">
            Вопрос {index + 1} из {questions.length}
          </span>
          {topic && (
            <span className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.12em] uppercase">
              {topic.title}
            </span>
          )}
        </div>

        {current.image && (
          <div className="relative mb-5 rounded-xl overflow-hidden border border-white/10 bg-[#0F1430]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current.image}
              alt="Иллюстрация к вопросу"
              className="w-full max-h-[280px] object-contain"
            />
          </div>
        )}
        <h2 className="relative text-[18px] sm:text-[20px] font-medium text-white leading-snug mb-6">
          {current.text}
        </h2>

        <div className="relative space-y-2.5">
          {current.options.map((opt, i) => {
            const isSelected = currentAnswer === i;
            const isCorrect = i === current.correctIndex;
            const showCorrect = isSelected && isCorrect;
            const showWrong = isSelected && !isCorrect;

            let cls =
              "relative w-full text-left bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3.5 text-[14px] text-white transition-all";
            if (showCorrect) cls += " border-[#22C55E]/60 bg-[#22C55E]/[0.08]";
            else if (showWrong) cls += " border-orange/60 bg-orange/[0.08]";
            else if (!hasAnswered) cls += " hover:bg-white/[0.06] hover:border-white/25 cursor-pointer";
            else cls += " opacity-60";

            return (
              <button key={i} onClick={() => select(i)} disabled={hasAnswered} className={cls}>
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
                      String.fromCharCode(65 + i)
                    )}
                  </span>
                  <span>{opt}</span>
                </span>
              </button>
            );
          })}
        </div>

        {hasAnswered && (
          <div className="relative mt-6 flex justify-end">
            <button
              onClick={next}
              className="inline-flex items-center gap-2 bg-orange text-white px-6 py-3 rounded-lg text-[13.5px] font-medium hover:bg-[#EA670F] hover:translate-x-0.5 transition-all"
            >
              {index < questions.length - 1 ? "Дальше" : "Завершить и посмотреть разбор"}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        )}
      </article>
    </div>
  );
}

function ProgressBar({ index, total }: { index: number; total: number }) {
  const answered = index;
  const pct = (answered / total) * 100;
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-lg p-4">
      <div className="flex items-center justify-between text-[11.5px] text-muted-on-navy mb-2 tracking-[0.06em]">
        <span>Прогресс</span>
        <span>
          {answered} / {total}
        </span>
      </div>
      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function QuizResults({
  questions,
  answers,
  mode,
  topic,
}: {
  questions: Question[];
  answers: (number | null)[];
  mode: "exam" | "topic";
  topic?: Topic;
}) {
  const correct = answers.filter((a, i) => a !== null && a === questions[i].correctIndex).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);
  const passed = mode === "exam" ? pct >= 90 : pct >= 70;

  return (
    <div className="space-y-6">
      <div className="relative bg-white/[0.04] border border-white/15 border-l-[3px] border-l-orange rounded-2xl p-7 sm:p-8 overflow-hidden">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-orange/[0.18] rounded-full blur-[80px] pointer-events-none" aria-hidden />

        <div className="relative flex items-start justify-between gap-6 flex-wrap">
          <div>
            <div className="text-[11px] text-muted-on-navy tracking-[0.18em] uppercase mb-1.5">
              {mode === "exam" ? "Экзамен · разбор" : `Тема · ${topic?.title}`}
            </div>
            <div className="text-[48px] sm:text-[56px] font-medium text-white leading-none tracking-tight mb-2">
              {correct} <span className="text-muted-on-navy text-[28px]">из {total}</span>
            </div>
            <div className={`text-[14px] font-medium ${passed ? "text-[#22C55E]" : "text-orange-soft"}`}>
              {passed ? "Сдал" : "Не сдал"} · {pct}%
            </div>
          </div>

          <div className="flex gap-2">
            <Link
              href="/tickets"
              className="bg-white/[0.06] border border-white/15 text-white px-4 py-2.5 rounded-lg text-[13px] hover:bg-white/[0.1] transition-colors"
            >
              К билетам
            </Link>
            <Link
              href={mode === "exam" ? "/tickets/quiz?mode=exam" : `/tickets/quiz?mode=topic&topic=${topic?.id}`}
              className="bg-orange text-white px-4 py-2.5 rounded-lg text-[13px] font-medium hover:bg-[#EA670F] transition-colors"
            >
              Ещё раз
            </Link>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((q, qi) => {
          const userAnswer = answers[qi];
          const isCorrect = userAnswer === q.correctIndex;

          return (
            <article
              key={q.id}
              className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-6 overflow-hidden"
            >
              <div
                className={`absolute top-0 left-0 bottom-0 w-[3px] ${
                  isCorrect ? "bg-[#22C55E]" : "bg-orange"
                }`}
                aria-hidden
              />

              <div className="flex items-start gap-3 mb-4">
                <span
                  className={`shrink-0 w-7 h-7 rounded-full grid place-items-center text-[12px] font-medium ${
                    isCorrect ? "bg-[#22C55E]/15 text-[#22C55E]" : "bg-orange/15 text-orange-soft"
                  }`}
                >
                  {qi + 1}
                </span>
                <h3 className="text-[15px] text-white leading-snug pt-0.5">{q.text}</h3>
              </div>

              {q.image && (
                <div className="ml-10 mb-4 rounded-lg overflow-hidden border border-white/10 bg-[#0F1430] max-w-[420px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={q.image}
                    alt="Иллюстрация к вопросу"
                    className="w-full max-h-[220px] object-contain"
                  />
                </div>
              )}

              <div className="space-y-1.5 mb-4 pl-10">
                {q.options.map((opt, oi) => {
                  const isUser = userAnswer === oi;
                  const isAnsCorrect = oi === q.correctIndex;

                  let cls = "px-3.5 py-2.5 rounded-lg border text-[13px]";
                  if (isAnsCorrect) cls += " border-[#22C55E]/40 bg-[#22C55E]/[0.06] text-white";
                  else if (isUser) cls += " border-orange/40 bg-orange/[0.06] text-white";
                  else cls += " border-white/[0.06] text-muted-on-navy";

                  return (
                    <div key={oi} className={cls}>
                      <span className="flex items-center gap-2.5">
                        <span className="text-[11px] text-muted-on-navy tabular-nums shrink-0">
                          {String.fromCharCode(65 + oi)}.
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isAnsCorrect && (
                          <span className="text-[11px] text-[#22C55E] tracking-[0.1em] uppercase">верно</span>
                        )}
                        {isUser && !isAnsCorrect && (
                          <span className="text-[11px] text-orange-soft tracking-[0.1em] uppercase">ваш ответ</span>
                        )}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pl-10 pt-3 border-t border-white/[0.06]">
                <div className="text-[11px] text-orange-soft tracking-[0.12em] uppercase mb-1.5">Разбор</div>
                <p className="text-[13px] text-muted-on-navy leading-[1.6]">{q.explanation}</p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
