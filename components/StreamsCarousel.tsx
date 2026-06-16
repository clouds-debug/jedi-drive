"use client";

import { EditableText } from "./content/EditableText";
import { useT } from "@/lib/i18n/client";

type Variant = "past" | "current" | "upcoming";

type Stream = {
  variant: Variant;
  keyBase: string;
  i18nBase: string;
  ctaHref?: string;
};

const past: Stream = { variant: "past", keyBase: "home.streams.past", i18nBase: "streams.past" };
const current: Stream = { variant: "current", keyBase: "home.streams.current", i18nBase: "streams.current", ctaHref: "#enroll" };
const upcoming: Stream = { variant: "upcoming", keyBase: "home.streams.upcoming", i18nBase: "streams.upcoming", ctaHref: "#enroll" };

export function StreamsCarousel() {
  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange/[0.08] rounded-full blur-[100px] pointer-events-none" aria-hidden />

      <div className="relative flex items-stretch justify-center gap-3 lg:gap-4">
        <div className="hidden md:flex items-stretch scale-[0.92] opacity-[0.85] -mr-2 -translate-y-1">
          <Card stream={past} />
        </div>
        <div className="relative z-10">
          <Card stream={current} highlighted />
        </div>
        <div className="hidden md:flex items-stretch scale-[0.92] opacity-[0.85] -ml-2 -translate-y-1">
          <Card stream={upcoming} />
        </div>
      </div>
    </div>
  );
}

function Card({ stream, highlighted = false }: { stream: Stream; highlighted?: boolean }) {
  const { t } = useT();
  const k = stream.keyBase;
  const i = stream.i18nBase;
  const isPast = stream.variant === "past";

  return (
    <div
      className={`relative w-[300px] sm:w-[340px] rounded-2xl p-7 sm:p-8 overflow-hidden border flex flex-col ${
        highlighted
          ? "bg-white/[0.04] border-white/15 border-l-[3px] border-l-orange"
          : "bg-white/[0.03] border-white/10"
      }`}
    >
      {highlighted && (
        <div
          className="absolute -right-16 -top-16 w-72 h-72 bg-orange/15 rounded-full blur-[80px] pointer-events-none"
          aria-hidden
        />
      )}

      <div className="relative flex items-center mb-6">
        <span
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase ${
            stream.variant === "current"
              ? "bg-orange/15 text-orange-soft"
              : "bg-white/[0.06] text-muted-on-navy"
          }`}
        >
          {stream.variant === "current" && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-orange opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange" />
            </span>
          )}
          <EditableText storageKey={`${k}.status`}>{t(`streams.status.${stream.variant}`)}</EditableText>
        </span>
      </div>

      <div className="relative flex-1 flex flex-col">
        <div className="text-[11px] text-muted-on-navy tracking-[0.18em] uppercase mb-2">
          {t("streams.group")}
        </div>
        <div className="text-[26px] sm:text-[30px] font-medium text-white leading-tight tracking-[-0.01em] mb-6">
          <EditableText storageKey={`${k}.title`}>{t(`${i}.title`)}</EditableText>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 text-[14px] text-white mb-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7" aria-hidden>
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 2" />
            </svg>
            <EditableText storageKey={`${k}.schedule`}>{t(`${i}.schedule`)}</EditableText>
          </div>
          <div
            className={`text-[12.5px] ${
              stream.variant === "current"
                ? "text-orange-soft"
                : "text-muted-on-navy"
            } leading-[1.55]`}
          >
            <EditableText storageKey={`${k}.meta`} multiline>{t(`${i}.meta`)}</EditableText>
          </div>
        </div>

        {isPast ? (
          <div className="mt-auto text-center bg-white/[0.03] rounded-lg px-4 py-3 text-[12.5px] text-muted-on-navy">
            <EditableText storageKey={`${k}.cta`}>{t(`${i}.cta`)}</EditableText>
          </div>
        ) : (
          <a
            href={stream.ctaHref ?? "#enroll"}
            className="mt-auto block w-full text-center bg-orange hover:bg-[#EA670F] text-white py-3.5 rounded-lg font-medium text-[14px] transition-all hover:translate-y-[-1px] active:scale-[0.98]"
          >
            <EditableText storageKey={`${k}.cta`}>{t(`${i}.cta`)}</EditableText>
          </a>
        )}
      </div>
    </div>
  );
}
