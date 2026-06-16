"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Quiz } from "./Quiz";
import {
  getQuestionsByTopic,
  getRandomQuestions,
  questions as allQuestions,
  topics,
  type Question,
} from "@/lib/tickets/data";
import { getMistakeIds } from "@/lib/tickets/progress";
import { useT } from "@/lib/i18n/client";

type QuizMode = "exam" | "topic" | "mistakes";

export function QuizContainer() {
  const { t } = useT();
  const params = useSearchParams();
  const mode = (params.get("mode") || "exam") as QuizMode;
  const topicId = params.get("topic");

  const [data, setData] = useState<{ questions: Question[]; topic?: ReturnType<typeof topics.find> } | null>(null);

  useEffect(() => {
    if (mode === "topic" && topicId) {
      const topic = topics.find((t) => t.id === topicId);
      setData({ questions: getQuestionsByTopic(topicId), topic });
      return;
    }
    if (mode === "mistakes") {
      const ids = new Set(getMistakeIds());
      const qs = allQuestions.filter((q) => ids.has(q.id));
      // Перемешиваем порядок, чтобы заучивать не позицию а смысл
      const shuffled = [...qs].sort(() => Math.random() - 0.5);
      setData({ questions: shuffled, topic: undefined });
      return;
    }
    setData({ questions: getRandomQuestions(30), topic: undefined });
  }, [mode, topicId]);

  if (!data) {
    return <div className="text-muted-on-navy text-center py-20">{t("tickets.quiz.loading")}</div>;
  }
  return <Quiz questions={data.questions} mode={mode} topic={data.topic} />;
}
