"use client";

import type { LessonRow, LessonStatus, LessonKind } from "@/lib/lessons";
import { LessonActions } from "./LessonActions";
import { LeaveReviewButton } from "./LeaveReviewButton";
import { useT } from "@/lib/i18n/client";

function useFmtDate() {
  const { locale } = useT();
  const tag = locale === "ge" ? "ka-GE" : "ru-RU";
  return (iso: string) => {
    const d = new Date(iso);
    return {
      date: d.toLocaleDateString(tag, {
        weekday: "short",
        day: "2-digit",
        month: "long",
        timeZone: "Asia/Tbilisi",
      }),
      time: d.toLocaleTimeString(tag, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Tbilisi",
      }),
    };
  };
}

function StatusBadge({ status }: { status: LessonStatus }) {
  const { t } = useT();
  const tone: "ok" | "warn" | "muted" | "danger" =
    status === "confirmed" ? "ok" : status === "pending" ? "warn" : status === "cancelled" ? "danger" : "muted";
  const label = t(`cab.lesson.status.${status}`);
  const cls =
    tone === "ok"
      ? "border-orange/40 bg-orange/[0.08] text-orange-soft"
      : tone === "warn"
        ? "border-white/15 bg-white/[0.05] text-muted-on-navy"
        : tone === "danger"
          ? "border-red-500/30 bg-red-500/[0.08] text-red-300"
          : "border-white/10 bg-white/[0.03] text-muted-on-navy";
  return (
    <span className={`inline-flex text-[10.5px] font-mono uppercase tracking-[0.1em] border ${cls} rounded px-2 py-0.5`}>
      {label}
    </span>
  );
}

function KindIcon({ kind }: { kind: LessonKind }) {
  if (kind === "theory") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDBA74" strokeWidth="1.7">
        <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
        <path d="M4 17a3 3 0 0 1 3-3h12" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FDBA74" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    </svg>
  );
}

function useFmt() {
  const { t } = useT();
  function kindLabel(kind: LessonKind): string {
    return kind === "theory" ? t("cab.lesson.kind.theory") : t("cab.lesson.kind.practice");
  }
  function formatLabel(kind: LessonKind, format: string | null): string | null {
    if (!format) return null;
    if (kind === "theory") {
      if (format === "group") return t("cab.lesson.format.group");
      if (format === "individual") return t("cab.lesson.format.individual");
    }
    if (kind === "practice") {
      if (format === "pad") return t("cab.lesson.format.pad");
      if (format === "city") return t("cab.lesson.format.city");
      if (format === "pad+city") return t("cab.lesson.format.padCity");
    }
    return format;
  }
  return { kindLabel, formatLabel };
}

export function LessonCard({
  lesson,
  accent,
  reviewedInstructorIds,
}: {
  lesson: LessonRow;
  accent: boolean;
  reviewedInstructorIds?: Set<string>;
}) {
  const { t } = useT();
  const fmtDate = useFmtDate();
  const { kindLabel, formatLabel } = useFmt();
  const { date, time } = fmtDate(lesson.scheduled_at);
  const fmt = formatLabel(lesson.kind, lesson.format);
  const canReview =
    !accent &&
    lesson.status === "completed" &&
    lesson.instructor_id !== null &&
    lesson.instructor_name !== null;

  return (
    <div
      className={`relative bg-white/[0.03] border ${
        accent ? "border-white/10 border-l-[3px] border-l-orange" : "border-white/[0.08] border-l-[3px] border-l-white/15"
      } rounded-[var(--radius-card)] p-5 transition-colors hover:bg-white/[0.05]`}
    >
      {accent && (
        <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
      )}
      <div className="relative flex flex-wrap items-start gap-4">
        <span className="w-10 h-10 rounded-lg bg-orange/15 grid place-items-center shrink-0">
          <KindIcon kind={lesson.kind} />
        </span>

        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-1">
            <span className="text-[14.5px] font-medium text-white">{kindLabel(lesson.kind)}</span>
            {fmt && <span className="text-[12px] text-muted-on-navy">· {fmt}</span>}
            {lesson.location && (
              <span className="text-[12px] text-muted-on-navy">· {lesson.location}</span>
            )}
          </div>
          {lesson.instructor_name && (
            <div className="text-[12.5px] text-muted-on-navy mb-1.5">
              {t("cab.lesson.instructor")}: <span className="text-white">{lesson.instructor_name}</span>
            </div>
          )}
          {lesson.notes && (
            <div className="text-[12.5px] text-muted-on-navy/90 mb-1.5 italic">
              {lesson.notes}
            </div>
          )}
        </div>

        <div className="text-right shrink-0">
          <div className="text-[13.5px] text-white font-medium font-mono tracking-[0.02em] tabular-nums">
            {time}
          </div>
          <div className="text-[11.5px] text-muted-on-navy capitalize">{date}</div>
          <div className="text-[10.5px] text-muted-on-navy/70 mt-0.5">
            {t("cab.lesson.minutes", { n: lesson.duration_min })}
          </div>
        </div>

        <div className="w-full flex items-center justify-between gap-3 flex-wrap pt-1">
          {accent && (lesson.status === "pending" || lesson.status === "confirmed") ? (
            <LessonActions
              lessonId={lesson.id}
              scheduledAtIso={lesson.scheduled_at}
              kind={lesson.kind}
              instructorId={lesson.instructor_id}
              durationMin={lesson.duration_min}
            />
          ) : canReview && lesson.instructor_id && lesson.instructor_name ? (
            <LeaveReviewButton
              instructorId={lesson.instructor_id}
              instructorName={lesson.instructor_name}
              alreadyReviewed={
                reviewedInstructorIds?.has(lesson.instructor_id) ?? false
              }
            />
          ) : (
            <span />
          )}
          {lesson.kind === "theory" ? <span /> : <StatusBadge status={lesson.status} />}
        </div>
      </div>
    </div>
  );
}
