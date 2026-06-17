"use client";

import type { AdminLessonRow } from "@/lib/admin/bookings";
import { DecisionActions } from "./DecisionActions";
import { ConfirmedActions } from "./ConfirmedActions";
import { BlockUserButton } from "./BlockUserButton";
import { useT, useLocale } from "@/lib/i18n/client";

function fmtWhen(iso: string, locale: string) {
  const d = new Date(iso);
  const intlLocale = locale === "ge" ? "ka-GE" : "ru-RU";
  return {
    weekday: d.toLocaleDateString(intlLocale, {
      weekday: "short",
      timeZone: "Asia/Tbilisi",
    }),
    date: d.toLocaleDateString(intlLocale, {
      day: "2-digit",
      month: "long",
      timeZone: "Asia/Tbilisi",
    }),
    time: d.toLocaleTimeString(intlLocale, {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Tbilisi",
    }),
  };
}

function statusToneCls(status: AdminLessonRow["status"]): string {
  switch (status) {
    case "pending":
      return "border-orange/40 bg-orange/[0.08] text-orange-soft";
    case "confirmed":
      return "border-emerald-500/40 bg-emerald-500/[0.08] text-emerald-300";
    case "completed":
      return "border-white/15 bg-white/[0.04] text-muted-on-navy";
    case "cancelled":
      return "border-red-500/30 bg-red-500/[0.08] text-red-300";
  }
}

function KindIcon({ kind }: { kind: AdminLessonRow["kind"] }) {
  if (kind === "theory") {
    return (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
        <path d="M4 17a3 3 0 0 1 3-3h12" />
      </svg>
    );
  }
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    </svg>
  );
}

export function BookingCard({
  lesson,
  showActions,
}: {
  lesson: AdminLessonRow;
  showActions: boolean;
}) {
  const { t } = useT();
  const locale = useLocale();
  const w = fmtWhen(lesson.scheduled_at, locale);
  const isGuest = !lesson.user_id;
  const fullName = isGuest
    ? lesson.guest_name ?? t("admin.booking.guest")
    : [lesson.user_first_name, lesson.user_last_name].filter(Boolean).join(" ") ||
      lesson.user_login ||
      "—";
  const avatarLetters = isGuest
    ? (lesson.guest_name ?? "ГС").slice(0, 2).toUpperCase()
    : (lesson.user_login ?? "??").slice(0, 2).toUpperCase();
  const isTheory = lesson.kind === "theory";

  const kindLabel = t(isTheory ? "admin.kind.theory" : "admin.kind.practice");
  const formatLabel = (() => {
    const fmt = lesson.format;
    if (!fmt) return null;
    if (lesson.kind === "theory") {
      if (fmt === "group") return t("admin.format.theory.group");
      if (fmt === "individual") return t("admin.format.theory.individual");
    }
    if (lesson.kind === "practice") {
      if (fmt === "pad") return t("admin.format.practice.pad");
      if (fmt === "city") return t("admin.format.practice.city");
      if (fmt === "pad+city") return t("admin.format.practice.padCity");
    }
    return fmt;
  })();

  const statusLabel = t(`admin.status.${lesson.status}`);

  return (
    <div id={`lesson-${lesson.id}`} className="relative scroll-mt-20 bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5 sm:p-6 transition-colors hover:bg-white/[0.05]">
      <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />

      <div className="relative">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="w-10 h-10 rounded-lg bg-orange/15 text-orange-soft grid place-items-center font-mono text-[11px] shrink-0">
              {avatarLetters}
            </span>
            <div className="min-w-0">
              <div className="text-[14.5px] text-white font-medium truncate flex items-center gap-2">
                {fullName}
                {isGuest && (
                  <span className="inline-flex text-[10px] font-mono uppercase tracking-[0.1em] border border-white/15 bg-white/[0.04] text-muted-on-navy rounded px-1.5 py-0.5">
                    {t("admin.booking.guestRecord")}
                  </span>
                )}
              </div>
              <div className="text-[11.5px] text-muted-on-navy truncate">
                {isGuest ? (
                  lesson.guest_contact ?? "—"
                ) : (
                  <>
                    @{lesson.user_login}
                    {lesson.user_phone ? ` · ${lesson.user_phone}` : ""}
                    {lesson.user_telegram_username ? (
                      <>
                        {" · "}
                        <a
                          href={`https://t.me/${lesson.user_telegram_username}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-soft hover:underline"
                        >
                          tg: @{lesson.user_telegram_username}
                        </a>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {lesson.user_is_blocked && (
              <span className="inline-flex text-[10.5px] font-mono uppercase tracking-[0.1em] border border-red-500/40 bg-red-500/[0.1] text-red-300 rounded px-2 py-0.5">
                {t("admin.booking.blocked")}
              </span>
            )}
            {!isTheory && (
              <span
                className={`inline-flex text-[10.5px] font-mono uppercase tracking-[0.1em] border ${statusToneCls(lesson.status)} rounded px-2 py-0.5`}
              >
                {statusLabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex-1 min-w-[240px] space-y-1.5">
            <div className="flex items-center gap-2 text-[14px] text-white">
              <span className="w-7 h-7 rounded-md bg-orange/10 text-orange-soft grid place-items-center shrink-0">
                <KindIcon kind={lesson.kind} />
              </span>
              <span>
                {kindLabel}
                {formatLabel && (
                  <span className="text-muted-on-navy"> · {formatLabel}</span>
                )}
              </span>
            </div>

            {lesson.instructor_name && (
              <div className="flex items-center gap-2 text-[13px] text-muted-on-navy pl-9">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                </svg>
                <span className="text-white">{lesson.instructor_name}</span>
              </div>
            )}
          </div>

          {isTheory ? (
            <div className="text-right shrink-0">
              <div className="text-[11.5px] text-muted-on-navy">
                {t("admin.booking.requestedFrom", {
                  date: new Date(lesson.created_at).toLocaleDateString(
                    locale === "ge" ? "ka-GE" : "ru-RU",
                    { day: "2-digit", month: "long", timeZone: "Asia/Tbilisi" },
                  ),
                })}
              </div>
            </div>
          ) : (
            <div className="text-right shrink-0">
              <div className="text-[20px] font-medium text-white tabular-nums leading-none mb-1">
                {w.time}
              </div>
              <div className="text-[11.5px] text-muted-on-navy capitalize">
                {w.weekday}, {w.date}
              </div>
              <div className="text-[10.5px] text-muted-on-navy/70 mt-0.5 font-mono">
                {t("admin.booking.durationMin", { min: lesson.duration_min })}
              </div>
            </div>
          )}
        </div>

        {isTheory && (() => {
          const cleaned = (lesson.notes ?? "")
            .replace(/^Заявка на теорию\s*·\s*(Группа|Индивидуально)\s*·\s*/i, "")
            .trim();
          if (!cleaned) return null;
          return (
            <div className="mt-4 pt-3 border-t border-white/[0.05] text-[12.5px] text-muted-on-navy leading-[1.5]">
              <span className="text-white">{t("admin.booking.comment")}</span> {cleaned}
            </div>
          );
        })()}

        {showActions && lesson.status === "pending" && (
          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-3 flex-wrap">
            <DecisionActions lessonId={lesson.id} />
            {!isGuest && lesson.user_id && lesson.user_login && (
              <BlockUserButton
                userId={lesson.user_id}
                userLogin={lesson.user_login}
                isBlocked={lesson.user_is_blocked}
              />
            )}
          </div>
        )}
        {showActions && lesson.status === "confirmed" && (
          <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between gap-3 flex-wrap">
            <ConfirmedActions
              lessonId={lesson.id}
              kind={lesson.kind}
              instructorId={lesson.instructor_id}
              scheduledAt={lesson.scheduled_at}
              durationMin={lesson.duration_min}
            />
            {!isGuest && lesson.user_id && lesson.user_login && (
              <BlockUserButton
                userId={lesson.user_id}
                userLogin={lesson.user_login}
                isBlocked={lesson.user_is_blocked}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
