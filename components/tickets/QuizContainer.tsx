"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Quiz } from "./Quiz";
import { PaginatedQuiz } from "./PaginatedQuiz";
import { ExamTopicPicker } from "./ExamTopicPicker";
import {
  getQuestionsByTopic,
  getRandomQuestionsByTopics,
  questions as allQuestions,
  topics,
  type Question,
} from "@/lib/tickets/data";
import { getMistakeIds } from "@/lib/tickets/progress";
import { useT } from "@/lib/i18n/client";

type QuizMode = "exam" | "topic" | "mistakes";

export function QuizContainer() {
  const { t } = useT();
  const router = useRouter();
  const params = useSearchParams();
  const mode = (params.get("mode") || "exam") as QuizMode;
  const topicId = params.get("topic");
  const topicsParam = params.get("topics");

  const data = useMemo<{ questions: Question[]; topic?: ReturnType<typeof topics.find> } | null>(() => {
    if (mode === "topic" && topicId) {
      const topic = topics.find((t) => t.id === topicId);
      return { questions: getQuestionsByTopic(topicId), topic };
    }
    if (mode === "mistakes") {
      const ids = new Set(getMistakeIds());
      const qs = allQuestions.filter((q) => ids.has(q.id));
      const shuffled = [...qs].sort(() => Math.random() - 0.5);
      return { questions: shuffled, topic: undefined };
    }
    if (mode === "exam") {
      if (!topicsParam) return null;
      const ids = topicsParam.split(",").filter(Boolean);
      if (ids.length === 0) return null;
      return { questions: getRandomQuestionsByTopics(ids, 30), topic: undefined };
    }
    return null;
  }, [mode, topicId, topicsParam]);

  if (mode === "exam" && !topicsParam) {
    return (
      <ExamTopicPicker
        onStart={(ids) => router.push(`/tickets/quiz?mode=exam&topics=${ids.join(",")}`)}
      />
    );
  }

  if (!data) {
    return <div className="text-muted-on-navy text-center py-20">{t("tickets.quiz.loading")}</div>;
  }
  if (mode === "topic" && data.questions.length > 0) {
    return <PaginatedQuiz questions={data.questions} mode={mode} topic={data.topic} />;
  }
  return <Quiz questions={data.questions} mode={mode} topic={data.topic} />;
}
