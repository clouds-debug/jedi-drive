"use client";

import { useState } from "react";

type StreamStatus = "past" | "current" | "upcoming";

type Stream = {
  number: number;
  startLong: string;
  endLong: string;
  startShort: string;
  endShort: string;
  schedule: string;
  language: "ru" | "ge";
  spotsLeft: number;
  spotsTotal: number;
  status: StreamStatus;
  startsIn?: string;
  passed?: number;
};

const streams: Stream[] = [
  { number: 25, startLong: "15 января", endLong: "12 февраля 2026", startShort: "15.01", endShort: "12.02", schedule: "Пн / Ср · 19:00", language: "ru", spotsLeft: 0, spotsTotal: 8, status: "past", passed: 7 },
  { number: 26, startLong: "10 февраля", endLong: "10 марта 2026", startShort: "10.02", endShort: "10.03", schedule: "Вт / Чт · 19:00", language: "ge", spotsLeft: 0, spotsTotal: 8, status: "past", passed: 8 },
  { number: 27, startLong: "11 марта", endLong: "8 апреля 2026", startShort: "11.03", endShort: "08.04", schedule: "Вт / Чт · 19:00", language: "ru", spotsLeft: 3, spotsTotal: 8, status: "current" },
  { number: 28, startLong: "15 апреля", endLong: "13 мая 2026", startShort: "15.04", endShort: "13.05", schedule: "Пн / Ср · 19:00", language: "ru", spotsLeft: 8, spotsTotal: 8, status: "upcoming", startsIn: "через 18 дней" },
  { number: 29, startLong: "20 мая", endLong: "17 июня 2026", startShort: "20.05", endShort: "17.06", schedule: "Вт / Чт · 19:00", language: "ge", spotsLeft: 8, spotsTotal: 8, status: "upcoming", startsIn: "через 53 дня" },
];

const initialIndex = streams.findIndex((s) => s.status === "current");

export function StreamsCarousel() {
  const [index, setIndex] = useState(initialIndex);

  const left = streams[index + 1];
  const center = streams[index];
  const right = streams[index - 1];

  const canGoLeft = index < streams.length - 1;
  const canGoRight = index > 0;

  return (
    <div className="relative">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange/[0.08] rounded-full blur-[100px] pointer-events-none" aria-hidden />

      <div className="relative flex items-center justify-center gap-2 sm:gap-4">
        <NavButton dir="left" disabled={!canGoLeft} onClick={() => setIndex((i) => i + 1)} />

        <div className="flex items-stretch gap-4 lg:gap-6">
          <div className="hidden md:block">
            {left ? <SideCard stream={left} onClick={() => setIndex((i) => i + 1)} /> : <Placeholder />}
          </div>

          <MainCard stream={center} />

          <div className="hidden md:block">
            {right ? <SideCard stream={right} onClick={() => setIndex((i) => i - 1)} /> : <Placeholder />}
          </div>
        </div>

        <NavButton dir="right" disabled={!canGoRight} onClick={() => setIndex((i) => i - 1)} />
      </div>

      <div className="flex items-center justify-center gap-2 mt-10">
        {streams.map((s, i) => (
          <button
            key={s.number}
            onClick={() => setIndex(i)}
            aria-label={`Перейти к потоку №${s.number}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-10 bg-orange" : "w-1.5 bg-white/20 hover:bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function Placeholder() {
  return <div className="w-[200px] opacity-0 pointer-events-none" aria-hidden />;
}

function MainCard({ stream }: { stream: Stream }) {
  const statusLabel =
    stream.status === "current" ? "Идёт сейчас" : stream.status === "upcoming" ? "Скоро старт" : "Завершён";
  const progressPct = ((stream.spotsTotal - stream.spotsLeft) / stream.spotsTotal) * 100;

  return (
    <div
      key={stream.number}
      className="relative bg-white/[0.04] border border-white/15 border-l-[3px] border-l-orange rounded-2xl p-7 sm:p-8 w-[300px] sm:w-[360px] lg:w-[380px] overflow-hidden animate-card-in"
    >
      <div className="absolute -right-16 -top-16 w-72 h-72 bg-orange/15 rounded-full blur-[80px] pointer-events-none" aria-hidden />

      <div className="relative flex items-center justify-between mb-6">
        <span className="inline-flex items-center gap-2 bg-orange/15 text-orange-soft px-3 py-1.5 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase">
          {stream.status === "current" && (
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-orange opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange" />
            </span>
          )}
          {statusLabel}
        </span>
        <span className="text-[11px] text-muted-on-navy tracking-[0.14em] uppercase">{stream.language}</span>
      </div>

      <div className="relative">
        <div className="text-[11px] text-muted-on-navy tracking-[0.18em] uppercase mb-1.5">Поток</div>
        <div className="text-[64px] sm:text-[72px] font-medium text-white leading-none tracking-tight mb-7">
          №{stream.number}
        </div>

        <div className="mb-6">
          <div className="text-[18px] sm:text-[20px] text-white font-medium mb-1 leading-snug">
            {stream.startLong} — {stream.endLong}
          </div>
          <div className="text-[12.5px] text-muted-on-navy">{stream.schedule} · 16 занятий по 90 мин</div>
          {stream.startsIn && (
            <div className="text-[12px] text-orange-soft mt-1.5">{stream.startsIn}</div>
          )}
        </div>

        {stream.status !== "past" ? (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase">Свободно</span>
                <span className="text-[14px] text-white font-medium">
                  {stream.spotsLeft}{" "}
                  <span className="text-muted-on-navy text-[12px]">из {stream.spotsTotal}</span>
                </span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange transition-all duration-1000 ease-out"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>

            <a
              href="#enroll"
              className="block w-full text-center bg-orange hover:bg-[#EA670F] text-white py-3.5 rounded-lg font-medium text-[14px] transition-all hover:translate-y-[-1px] active:scale-[0.98]"
            >
              {stream.status === "current" ? "Записаться сейчас" : "Забронировать место"}
            </a>
          </>
        ) : (
          <div className="flex items-center justify-between bg-white/[0.03] rounded-lg px-4 py-3.5 text-[13px] text-muted-on-navy">
            <span>Завершён</span>
            <span>
              <span className="text-white">{stream.passed}</span> / {stream.spotsTotal} сдали
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function SideCard({ stream, onClick }: { stream: Stream; onClick: () => void }) {
  const label = stream.status === "upcoming" ? "Скоро" : stream.status === "past" ? "Прошёл" : "Сейчас";

  return (
    <button
      onClick={onClick}
      aria-label={`Перейти к потоку №${stream.number}`}
      className="group relative bg-white/[0.02] border border-white/10 rounded-xl px-5 py-6 w-[200px] text-left opacity-55 hover:opacity-100 hover:border-white/25 hover:bg-white/[0.05] transition-all duration-300 hover:-translate-y-1"
    >
      <div className="text-[10px] text-orange-soft tracking-[0.18em] uppercase mb-2">{label}</div>
      <div className="text-[36px] font-medium text-white/85 leading-none tracking-tight mb-3 group-hover:text-white transition-colors">
        №{stream.number}
      </div>
      <div className="text-[12px] text-muted-on-navy mb-1">
        {stream.startShort} — {stream.endShort}
      </div>
      <div className="text-[10px] text-muted-on-navy/70 uppercase tracking-[0.12em] mt-3">{stream.language}</div>
    </button>
  );
}

function NavButton({ dir, disabled, onClick }: { dir: "left" | "right"; disabled: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "left" ? "Следующие потоки" : "Предыдущие потоки"}
      className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/[0.05] border border-white/15 text-white grid place-items-center disabled:opacity-25 disabled:cursor-not-allowed hover:bg-white/[0.1] hover:border-white/30 hover:text-orange-soft active:scale-95 transition-all"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}
