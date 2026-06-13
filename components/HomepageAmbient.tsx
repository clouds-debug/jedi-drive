export function HomepageAmbient() {
  const ticks = Array.from({ length: 24 }, (_, i) => {
    const angle = -150 + i * (300 / 23);
    const rad = (angle * Math.PI) / 180;
    const isMajor = i % 4 === 0;
    const r1 = isMajor ? 64 : 70;
    const r2 = 78;
    return {
      key: i,
      x1: 90 + Math.cos(rad) * r1,
      y1: 90 + Math.sin(rad) * r1,
      x2: 90 + Math.cos(rad) * r2,
      y2: 90 + Math.sin(rad) * r2,
      isMajor,
    };
  });

  return (
    <div
      className="pointer-events-none select-none hidden xl:block fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <Road side="left" />
      <Road side="right" />

      <div
        className="absolute left-[34px] top-[18%] font-mono text-[10px] text-orange/35 tracking-[0.4em] uppercase whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        Jedi Drive · 2026
      </div>

      <div
        className="absolute right-[34px] top-[60%] font-mono text-[10px] text-orange/35 tracking-[0.4em] uppercase whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        Tbilisi · 41.69°N · 44.80°E
      </div>

      <div className="absolute right-[28px] top-[15%] flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-orange opacity-75 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange" />
          </span>
          <span className="font-mono text-[9px] text-orange/55 tracking-[0.3em] uppercase">Live</span>
        </div>
      </div>

      <div className="absolute right-[18px] top-[32%]">
        <svg width="180" height="180" viewBox="0 0 180 180" className="text-orange">
          <defs>
            <radialGradient id="speedo-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F97316" stopOpacity="0.18" />
              <stop offset="60%" stopColor="#F97316" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx="90" cy="90" r="85" fill="url(#speedo-glow)" />
          <circle cx="90" cy="90" r="82" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
          <circle cx="90" cy="90" r="75" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1" />

          {ticks.map((t) => (
            <line
              key={t.key}
              x1={t.x1}
              y1={t.y1}
              x2={t.x2}
              y2={t.y2}
              stroke="currentColor"
              strokeOpacity={t.isMajor ? "0.55" : "0.25"}
              strokeWidth={t.isMajor ? "2" : "1"}
            />
          ))}

          <text x="35" y="135" fontSize="9" fontFamily="ui-monospace, monospace" fill="currentColor" fillOpacity="0.45">
            0
          </text>
          <text
            x="90"
            y="20"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            fill="currentColor"
            fillOpacity="0.45"
            textAnchor="middle"
          >
            100
          </text>
          <text
            x="145"
            y="135"
            fontSize="9"
            fontFamily="ui-monospace, monospace"
            fill="currentColor"
            fillOpacity="0.45"
            textAnchor="end"
          >
            200
          </text>

          <g className="speedo-needle" style={{ transformOrigin: "90px 90px" }}>
            <line x1="90" y1="90" x2="90" y2="22" stroke="currentColor" strokeOpacity="0.75" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="90" cy="90" r="5" fill="currentColor" fillOpacity="0.8" />
          </g>

          <text
            x="90"
            y="120"
            fontSize="7"
            fontFamily="ui-monospace, monospace"
            fill="currentColor"
            fillOpacity="0.4"
            textAnchor="middle"
            letterSpacing="3"
          >
            KM/H
          </text>
        </svg>
      </div>

      <div className="absolute left-[18px] top-[42%] flex flex-col gap-2.5">
        <DashIndicator label="GE" active />
        <DashIndicator label="ABS" />
        <DashIndicator label="ESP" />
        <DashIndicator label="AKB" />
      </div>

      <div className="absolute left-[24px] bottom-[14%] flex flex-col gap-1.5">
        <span className="font-mono text-[8.5px] text-orange/45 tracking-[0.3em] uppercase">Engine</span>
        <FuelBar />
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-[800px] h-[400px] rounded-full bg-orange/[0.04] blur-[140px] ambient-blob" />
    </div>
  );
}

function Road({ side }: { side: "left" | "right" }) {
  const isLeft = side === "left";
  return (
    <svg
      className={`absolute top-0 h-full ${isLeft ? "left-0" : "right-0"} w-[100px] 2xl:w-[140px]`}
      viewBox="0 0 100 1080"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`road-surface-${side}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F1430" stopOpacity="0" />
          <stop offset="15%" stopColor="#1A2150" stopOpacity="0.6" />
          <stop offset="85%" stopColor="#1A2150" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#0F1430" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="10" y="0" width="80" height="1080" fill={`url(#road-surface-${side})`} />

      <line x1="14" y1="0" x2="14" y2="1080" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1.2" />
      <line x1="86" y1="0" x2="86" y2="1080" stroke="#FFFFFF" strokeOpacity="0.18" strokeWidth="1.2" />

      <line
        x1="50"
        y1="0"
        x2="50"
        y2="1080"
        stroke="#F97316"
        strokeOpacity="0.55"
        strokeWidth="4"
        strokeDasharray="36 28"
        className={isLeft ? "road-dash" : "road-dash-reverse"}
      />
    </svg>
  );
}

function DashIndicator({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-2 ${active ? "" : "opacity-40"}`}
      title={label}
    >
      <span
        className={`block w-1.5 h-1.5 rounded-full ${active ? "bg-orange animate-pulse" : "bg-orange/30"}`}
      />
      <span className="font-mono text-[9px] text-orange/55 tracking-[0.2em] uppercase">{label}</span>
    </div>
  );
}

function FuelBar() {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 8 }).map((_, i) => (
        <span
          key={i}
          className={`block w-1.5 h-3 ${i < 5 ? "bg-orange/55" : "bg-orange/15"} rounded-[1px]`}
        />
      ))}
    </div>
  );
}
