"use client";

import { useEffect, useRef } from "react";

const ROUTE_D = "M 30 195 C 130 200, 170 100, 290 110 S 410 200, 540 115";

/**
 * Hero illustration — навигационная карта. Машина едет по маршруту, колёса
 * касаются верха оранжевой линии. Анимация на requestAnimationFrame —
 * SMIL/CSS offset-path в этом setup'е работает капризно, rAF гарантированно.
 */
export function HeroIllustration() {
  const pathRef = useRef<SVGPathElement | null>(null);
  const carRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    const path = pathRef.current;
    const car = carRef.current;
    if (!path || !car) return;
    const total = path.getTotalLength();
    const duration = 8000;

    const startedAt = performance.now();
    const intervalId = window.setInterval(() => {
      const elapsed = (performance.now() - startedAt) % duration;
      const x = elapsed / duration;
      const ease = x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
      const dist = ease * total;
      const p = path.getPointAtLength(dist);
      const pAhead = path.getPointAtLength(Math.min(total, dist + 1));
      const angle = (Math.atan2(pAhead.y - p.y, pAhead.x - p.x) * 180) / Math.PI;
      car.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angle})`);
    }, 33);
    return () => window.clearInterval(intervalId);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className="hidden lg:block absolute right-0 top-0 w-[640px] h-[240px] pointer-events-none"
      aria-hidden
    >
      <div className="absolute inset-[10%] bg-orange/[0.08] rounded-full blur-[120px]" />

      <svg
        viewBox="0 0 640 240"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full"
      >
        <defs>
          <linearGradient id="routeFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.15" />
            <stop offset="40%" stopColor="#F97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.95" />
          </linearGradient>
          <radialGradient id="pinFill" cx="0.4" cy="0.35" r="0.7">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#F97316" />
          </radialGradient>
          <radialGradient id="pinGlow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="carBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
          <radialGradient id="startDot" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FDBA74" />
            <stop offset="100%" stopColor="#F97316" />
          </radialGradient>
        </defs>

        {/* фоновая сетка */}
        <g opacity="0.08">
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 100 + 20} y1="0" x2={i * 100 + 20} y2="240" stroke="#FDBA74" strokeWidth="0.6" />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 60 + 30} x2="640" y2={i * 60 + 30} stroke="#FDBA74" strokeWidth="0.6" />
          ))}
        </g>

        {/* «улицы» */}
        <g opacity="0.22" stroke="#3F4A78" strokeWidth="3">
          <path d="M 100 0 L 100 240" />
          <path d="M 0 70 L 640 70" strokeDasharray="2 8" />
          <path d="M 380 0 L 380 240" />
        </g>

        {/* свечение позади маршрута */}
        <path
          d={ROUTE_D}
          fill="none"
          stroke="#F97316"
          strokeWidth="14"
          strokeOpacity="0.18"
          strokeLinecap="round"
          filter="blur(4px)"
        />

        {/* сам маршрут */}
        <path ref={pathRef} d={ROUTE_D} fill="none" stroke="url(#routeFade)" strokeWidth="4" strokeLinecap="round" />

        {/* пунктир движущейся разметки поверх */}
        <path
          d={ROUTE_D}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeDasharray="6 8"
          strokeLinecap="round"
          opacity="0.6"
        >
          <animate attributeName="stroke-dashoffset" from="0" to="-28" dur="2.2s" repeatCount="indefinite" />
        </path>

        {/* старт */}
        <g>
          <circle cx="30" cy="195" r="10" fill="url(#startDot)" />
          <circle cx="30" cy="195" r="4" fill="#0F1430" />
        </g>

        {/* финиш — пин с B */}
        <g transform="translate(520 60)">
          <ellipse cx="35" cy="92" rx="50" ry="10" fill="url(#pinGlow)" />
          <path
            d="M 35 0 C 55 0 70 16 70 36 C 70 60 35 90 35 90 C 35 90 0 60 0 36 C 0 16 15 0 35 0 Z"
            fill="url(#pinFill)"
            stroke="#7A2F08"
            strokeWidth="1.2"
          />
          <circle cx="35" cy="34" r="18" fill="#0F1430" />
          <text
            x="35"
            y="42"
            textAnchor="middle"
            fontFamily="ui-sans-serif, system-ui"
            fontSize="22"
            fontWeight="700"
            fill="#F97316"
          >
            B
          </text>
        </g>

        {/* tbilisi подпись */}
        <text
          x="320"
          y="40"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="10"
          fontWeight="600"
          fill="#A5B4D8"
          opacity="0.35"
          letterSpacing="6"
        >
          TBILISI
        </text>

        {/* искры */}
        <g fill="#FDBA74">
          <circle cx="180" cy="40" r="1.6" opacity="0.7" />
          <circle cx="240" cy="180" r="1.4" opacity="0.5" />
          <circle cx="430" cy="50" r="1.8" opacity="0.6" />
          <circle cx="600" cy="200" r="1.4" opacity="0.5" />
        </g>

        {/* машина: outer g двигается rAF-ом, inner g смещает машину вверх,
            чтобы колёса касались верха линии после поворота. */}
        <g ref={carRef} transform="translate(30 195)">
          <g transform="translate(-12 -18)">
            <ellipse cx="12" cy="17" rx="13" ry="2" fill="#000000" opacity="0.35" />
            <path
              d="M 0 12 L 4 4 Q 5.5 1 8.5 1 L 16 1 Q 19 1 20.5 4 L 24 12 L 24 15 Q 24 16.5 23 16.5 L 1 16.5 Q 0 16.5 0 15 Z"
              fill="url(#carBody)"
              stroke="#7A2F08"
              strokeWidth="0.5"
            />
            <path d="M 5.5 4 L 8.5 1 L 16 1 L 19 4 L 16 9 L 8.5 9 Z" fill="#0F1430" />
            <circle cx="6" cy="16" r="2.5" fill="#0F1430" stroke="#1F2A52" />
            <circle cx="18" cy="16" r="2.5" fill="#0F1430" stroke="#1F2A52" />
          </g>
        </g>
      </svg>
    </div>
  );
}
