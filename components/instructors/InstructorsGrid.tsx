"use client";

import { useEffect, useState } from "react";
import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { instructors as staticInstructors, type Instructor } from "@/lib/instructors/data";
import { L, useT } from "@/lib/i18n/client";

const avatarColors: Record<Instructor["avatarColor"], string> = {
  indigo: "bg-indigo-500/20 text-indigo-200",
  orange: "bg-orange/20 text-orange-soft",
  violet: "bg-violet-500/20 text-violet-200",
  emerald: "bg-emerald-500/20 text-emerald-200",
  rose: "bg-rose-500/20 text-rose-200",
};

const PER_PAGE = 9;

export type AggregateOverride = {
  rating: number;
  count: number;
};

export function InstructorsGrid({
  aggregates,
  hiddenIds = [],
  source,
}: {
  aggregates?: Record<string, AggregateOverride>;
  hiddenIds?: string[];
  source?: Instructor[];
}) {
  const { t } = useT();
  const hidden = new Set(hiddenIds);
  const base = source ?? staticInstructors;
  const instructors: Instructor[] = base
    .filter((inst) => !hidden.has(inst.id))
    .map((inst) => {
      const agg = aggregates?.[inst.id];
      if (!agg || agg.count === 0) return inst;
      return {
        ...inst,
        rating: Number(agg.rating.toFixed(1)),
        reviewsCount: agg.count,
      };
    });

  const [selected, setSelected] = useState<Instructor | null>(null);
  const [page, setPage] = useState(0);

  const totalPages = Math.max(1, Math.ceil(instructors.length / PER_PAGE));
  const start = page * PER_PAGE;
  const visible = instructors.slice(start, start + PER_PAGE);
  const hasPagination = totalPages > 1;

  useEffect(() => {
    if (!selected) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selected]);

  return (
    <>
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

        <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
          <div className="flex items-end justify-between gap-6 mb-12">
            <Reveal className="flex-1">
              <SectionLabel num="02">{t("instructors.grid.section.label")}</SectionLabel>
              <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] max-w-[540px]">
                {t("instructors.grid.title.lead")} <span className="text-orange">{t("instructors.grid.title.accent")}</span>
              </h2>
              <p className="text-[14px] text-muted-on-navy leading-[1.65] mt-3 max-w-[520px]">
                {t("instructors.grid.subtitle")}
              </p>
            </Reveal>

            {hasPagination && (
              <Reveal delay={80} className="hidden sm:flex items-center gap-3 shrink-0 pb-1">
                <span className="text-[12px] text-muted-on-navy tabular-nums">
                  {page + 1} / {totalPages}
                </span>
                <div className="flex gap-2">
                  <ArrowButton
                    dir="left"
                    disabled={page === 0}
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    label={t("instructors.grid.prevPage")}
                  />
                  <ArrowButton
                    dir="right"
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    label={t("instructors.grid.nextPage")}
                  />
                </div>
              </Reveal>
            )}
          </div>

          <div
            key={page}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          >
            {visible.map((inst, i) => (
              <button
                key={inst.id}
                onClick={() => setSelected(inst)}
                className="group relative w-full text-left bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1 animate-card-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.08] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                <div className="relative flex items-center gap-3.5 mb-4">
                  {inst.avatarUrl ? (
                    <img
                      src={inst.avatarUrl}
                      alt={inst.name}
                      className="shrink-0 w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className={`shrink-0 w-14 h-14 rounded-full grid place-items-center text-[15px] font-medium ${avatarColors[inst.avatarColor]}`}>
                      {inst.initials}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-[15px] font-medium text-white truncate group-hover:text-orange-soft transition-colors">
                      {inst.name}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                        <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                      </svg>
                      <span className="text-[12.5px] text-white font-medium">{inst.rating}</span>
                      <span className="text-[11px] text-muted-on-navy">· {t("instructors.grid.reviewsCount", { n: inst.reviewsCount })}</span>
                    </div>
                  </div>
                </div>

                <div className="relative flex flex-wrap gap-1.5 mb-4">
                  {inst.languages.map((l) => (
                    <span key={l} className="text-[10px] font-mono text-orange-soft tracking-[0.2em] uppercase bg-orange/10 px-2 py-0.5 rounded-full">
                      {l}
                    </span>
                  ))}
                </div>

                <div className="relative space-y-1 text-[12.5px] text-muted-on-navy mb-4">
                  <div className="flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v5l3 2" />
                    </svg>
                    {t("instructors.grid.experience", { n: inst.experienceYears })}
                  </div>
                  <div className="flex items-start gap-2">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7" className="mt-0.5 shrink-0" aria-hidden>
                      <path d="M5 13l1.5-5.5A2 2 0 018.5 6h7a2 2 0 012 1.5L19 13M3 17h18M5 13v3m14-3v3" />
                    </svg>
                    {inst.car}
                  </div>
                </div>

                <div className="relative pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11.5px] text-muted-on-navy">
                  <span>{t("instructors.grid.more")}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FDBA74" strokeWidth="2" className="-translate-x-1 group-hover:translate-x-0 transition-transform" aria-hidden>
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {hasPagination && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  aria-label={t("instructors.grid.page", { n: i + 1 })}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === page ? "w-10 bg-orange" : "w-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          )}

          {hasPagination && (
            <div className="sm:hidden flex justify-center gap-2 mt-6">
              <ArrowButton
                dir="left"
                disabled={page === 0}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                label={t("instructors.grid.prevPage")}
              />
              <ArrowButton
                dir="right"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                label={t("instructors.grid.nextPage")}
              />
            </div>
          )}
        </div>
      </section>

      {selected && <InstructorModal instructor={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function ArrowButton({
  dir,
  disabled,
  onClick,
  label,
}: {
  dir: "left" | "right";
  disabled: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/15 text-white grid place-items-center transition-all hover:bg-white/[0.08] hover:border-white/30 hover:text-orange-soft active:scale-95 disabled:opacity-25 disabled:cursor-not-allowed"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

function InstructorModal({ instructor, onClose }: { instructor: Instructor; onClose: () => void }) {
  const { t } = useT();
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-modal-fade">
      <button
        onClick={onClose}
        aria-label={t("instructors.modal.close")}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-2xl max-h-[90vh] bg-navy border border-white/15 rounded-2xl shadow-[0_24px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col animate-modal-rise">
        <div className="absolute -right-16 -top-16 w-72 h-72 bg-orange/[0.15] rounded-full blur-[80px] pointer-events-none" aria-hidden />

        <button
          onClick={onClose}
          aria-label={t("instructors.modal.close")}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/[0.06] border border-white/15 text-white grid place-items-center hover:bg-white/[0.1] hover:border-white/30 active:scale-95 transition-all"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 relative [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-start gap-5 mb-6 pr-10">
            {instructor.avatarUrl ? (
              <img
                src={instructor.avatarUrl}
                alt={instructor.name}
                className="shrink-0 w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <span className={`shrink-0 w-20 h-20 rounded-full grid place-items-center text-[22px] font-medium ${avatarColors[instructor.avatarColor]}`}>
                {instructor.initials}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-[22px] sm:text-[24px] font-medium text-white leading-tight mb-2">
                {instructor.name}
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                    <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                  </svg>
                  <span className="text-[14px] text-white font-medium">{instructor.rating}</span>
                  <span className="text-[12.5px] text-muted-on-navy">· {t("instructors.grid.reviewsCount", { n: instructor.reviewsCount })}</span>
                </div>
                <span className="text-muted-on-navy/50">·</span>
                <div className="flex gap-1.5">
                  {instructor.languages.map((l) => (
                    <span key={l} className="text-[10px] font-mono text-orange-soft tracking-[0.2em] uppercase bg-orange/10 px-2 py-0.5 rounded-full">
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <Stat
              label={t("instructors.modal.stat.exp")}
              value={t("instructors.hero.stat.years", { n: instructor.experienceYears })}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              }
            />
            <Stat
              label={t("instructors.modal.stat.car")}
              value={instructor.car}
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M5 13l1.5-5.5A2 2 0 018.5 6h7a2 2 0 012 1.5L19 13M3 17h18" />
                </svg>
              }
            />
          </div>

          {instructor.bio && (
            <div className="mb-7">
              <div className="text-[11px] text-orange-soft tracking-[0.16em] uppercase mb-2">{t("instructors.modal.bio.title")}</div>
              <p className="text-[14px] text-white leading-[1.65]">{instructor.bio}</p>
            </div>
          )}

          <LiveReviews instructorId={instructor.id} />

          {instructor.reviews && instructor.reviews.length > 0 && (
            <details className="mt-5 group">
              <summary className="cursor-pointer text-[11px] text-muted-on-navy tracking-[0.16em] uppercase hover:text-white transition-colors">
                {t("instructors.modal.oldReviews", { n: instructor.reviews.length })} <span className="ml-1 group-open:hidden">▾</span><span className="hidden group-open:inline">▴</span>
              </summary>
              <div className="space-y-3 mt-3">
                {instructor.reviews.map((r, i) => (
                  <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
                    <p className="text-[13.5px] text-white leading-[1.6] mb-3">«{r.text}»</p>
                    <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06]">
                      <span className="w-7 h-7 rounded-full grid place-items-center bg-white/[0.06] text-[11px] text-muted-on-navy font-medium">
                        {r.initials}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[12.5px] font-medium text-white">{r.author}</span>
                        <span className="text-[11px] text-muted-on-navy">· {r.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>

        <div className="shrink-0 px-6 sm:px-8 py-4 border-t border-white/[0.08] bg-navy">
          <L
            href={`/services/practice#booking`}
            className="block w-full text-center bg-orange hover:bg-[#EA670F] text-white py-3 rounded-lg text-[14px] font-medium transition-all hover:translate-y-[-1px]"
          >
            {t("instructors.modal.book", { name: instructor.name.split(" ")[0] })}
          </L>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-lg px-3.5 py-3">
      <div className="text-[10px] text-muted-on-navy tracking-[0.14em] uppercase mb-1.5">{label}</div>
      <div className="flex items-start gap-2 text-orange-soft">
        {icon}
        <span className="text-[13px] text-white leading-tight">{value}</span>
      </div>
    </div>
  );
}

type LiveReview = {
  id: string;
  rating: number;
  body: string | null;
  createdAt: string;
  authorLogin: string;
  authorFirstName: string | null;
};

function LiveReviews({ instructorId }: { instructorId: string }) {
  const { t } = useT();
  const [items, setItems] = useState<LiveReview[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/instructors/${encodeURIComponent(instructorId)}/reviews?limit=30`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { items: LiveReview[] }) => {
        if (!cancelled) setItems(d.items ?? []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [instructorId]);

  if (error) {
    return (
      <div className="text-[12.5px] text-muted-on-navy bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
        {t("instructors.modal.reviews.error")}
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="text-[11px] text-muted-on-navy tracking-[0.16em] uppercase">
        {t("instructors.modal.reviews.loading")}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <div className="text-[11px] text-orange-soft tracking-[0.16em] uppercase mb-2">
          {t("instructors.modal.reviews.title")}
        </div>
        <div className="text-[12.5px] text-muted-on-navy bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
          {t("instructors.modal.reviews.empty")}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[11px] text-orange-soft tracking-[0.16em] uppercase mb-3">
        {t("instructors.modal.reviews.titleWithCount", { n: items.length })}
      </div>
      <div className="space-y-3">
        {items.map((r) => (
          <ReviewItem key={r.id} review={r} />
        ))}
      </div>
    </div>
  );
}

function ReviewItem({ review }: { review: LiveReview }) {
  const { locale } = useT();
  const name = review.authorFirstName ?? `@${review.authorLogin}`;
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const date = new Date(review.createdAt).toLocaleDateString(locale === "ge" ? "ka-GE" : "ru-RU", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Tbilisi",
  });

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        {Array.from({ length: 5 }, (_, i) => (
          <svg
            key={i}
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill={i < review.rating ? "#F97316" : "none"}
            stroke={i < review.rating ? "#F97316" : "rgba(255,255,255,0.25)"}
            strokeWidth="1.5"
          >
            <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
          </svg>
        ))}
      </div>
      {review.body && (
        <p className="text-[13.5px] text-white leading-[1.6] mb-3">«{review.body}»</p>
      )}
      <div className="flex items-center gap-2.5 pt-3 border-t border-white/[0.06]">
        <span className="w-7 h-7 rounded-full grid place-items-center bg-white/[0.06] text-[11px] text-muted-on-navy font-medium">
          {initials}
        </span>
        <div className="flex items-center gap-1.5">
          <span className="text-[12.5px] font-medium text-white">{name}</span>
          <span className="text-[11px] text-muted-on-navy">· {date}</span>
        </div>
      </div>
    </div>
  );
}
