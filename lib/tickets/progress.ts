const KEY = "jd_tickets_progress_v1";

export type TopicProgress = {
  best: number;
  total: number;
  lastCorrect: number;
  lastAt: number;
  attempts: number;
};

export type ExamAttempt = {
  correct: number;
  total: number;
  at: number;
};

export type ProgressData = {
  topics: Record<string, TopicProgress>;
  exam: {
    best: ExamAttempt | null;
    last: ExamAttempt | null;
    attempts: number;
  };
  
  mistakes: string[];
};

const EMPTY: ProgressData = {
  topics: {},
  exam: { best: null, last: null, attempts: 0 },
  mistakes: [],
};

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function readProgress(): ProgressData {
  if (!isBrowser()) return EMPTY;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Partial<ProgressData>;
    return {
      topics: parsed.topics ?? {},
      exam: parsed.exam ?? { best: null, last: null, attempts: 0 },
      mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [],
    };
  } catch {
    return EMPTY;
  }
}

function writeProgress(data: ProgressData) {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("jd-tickets-progress"));
  } catch {
  }
}

export function recordTopicResult(
  topicId: string,
  correct: number,
  total: number,
): void {
  if (!isBrowser() || total === 0) return;
  const data = readProgress();
  const prev = data.topics[topicId];
  const best = prev ? Math.max(prev.best, correct) : correct;
  data.topics[topicId] = {
    best,
    total,
    lastCorrect: correct,
    lastAt: Date.now(),
    attempts: (prev?.attempts ?? 0) + 1,
  };
  writeProgress(data);
}

export function recordExamResult(correct: number, total: number): void {
  if (!isBrowser() || total === 0) return;
  const data = readProgress();
  const attempt: ExamAttempt = { correct, total, at: Date.now() };
  const best =
    !data.exam.best ||
    correct / total > data.exam.best.correct / data.exam.best.total
      ? attempt
      : data.exam.best;
  data.exam = {
    best,
    last: attempt,
    attempts: data.exam.attempts + 1,
  };
  writeProgress(data);
}

export function getTopicProgress(topicId: string): TopicProgress | null {
  return readProgress().topics[topicId] ?? null;
}

export function recordQuestionResult(qid: string, isCorrect: boolean): void {
  if (!isBrowser()) return;
  const data = readProgress();
  const set = new Set(data.mistakes);
  if (isCorrect) {
    if (!set.has(qid)) return;
    set.delete(qid);
  } else {
    if (set.has(qid)) return;
    set.add(qid);
  }
  data.mistakes = Array.from(set);
  writeProgress(data);
}

export function getMistakeIds(): string[] {
  return readProgress().mistakes;
}

export function clearMistakes(): void {
  if (!isBrowser()) return;
  const data = readProgress();
  data.mistakes = [];
  writeProgress(data);
}

export function resetProgress(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new CustomEvent("jd-tickets-progress"));
}
