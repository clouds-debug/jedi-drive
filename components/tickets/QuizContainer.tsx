"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { Quiz } from "./Quiz";
import { getQuestionsByTopic, getRandomQuestions, topics } from "@/lib/tickets/data";

export function QuizContainer() {
  const params = useSearchParams();
  const mode = (params.get("mode") || "exam") as "exam" | "topic";
  const topicId = params.get("topic");

  const data = useMemo(() => {
    if (mode === "topic" && topicId) {
      const topic = topics.find((t) => t.id === topicId);
      return {
        questions: getQuestionsByTopic(topicId),
        topic,
      };
    }
    return {
      questions: getRandomQuestions(20),
      topic: undefined,
    };
  }, [mode, topicId]);

  return <Quiz questions={data.questions} mode={mode} topic={data.topic} />;
}
