export function HomepageAmbient() {
  return (
    <div
      className="pointer-events-none select-none hidden xl:block fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <div className="absolute left-6 top-0 bottom-0 w-[2px] ambient-lane" />
      <div className="absolute right-6 top-0 bottom-0 w-[2px] ambient-lane ambient-lane-slow" />

      <div
        className="absolute left-2 top-[35%] font-mono text-[9px] text-orange/30 tracking-[0.4em] uppercase whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        Jedi Drive · 01 · 2026
      </div>

      <div
        className="absolute right-2 top-[55%] font-mono text-[9px] text-orange/30 tracking-[0.4em] uppercase whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        Tbilisi · 41.69°N · 44.80°E
      </div>

      <div className="absolute right-2 top-[12%] flex items-center gap-2.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-orange opacity-75 animate-ping" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange" />
        </span>
        <span
          className="font-mono text-[9px] text-orange/50 tracking-[0.3em] uppercase whitespace-nowrap"
          style={{ writingMode: "vertical-rl" }}
        >
          Live · Online
        </span>
      </div>

      <div
        className="absolute left-2 top-[12%] font-mono text-[9px] text-orange/30 tracking-[0.3em] uppercase whitespace-nowrap"
        style={{ writingMode: "vertical-rl" }}
      >
        Scroll · Explore ↓
      </div>

      <div className="absolute left-4 top-[68%] flex flex-col gap-[3px] ambient-ticks">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="block w-2 h-[1px] bg-orange/40"
            style={{ width: i % 2 === 0 ? "10px" : "5px" }}
          />
        ))}
      </div>

      <div className="absolute right-4 top-[78%] flex flex-col gap-[3px]">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="block h-[1px] bg-orange/40 ml-auto"
            style={{ width: i % 2 === 0 ? "10px" : "5px" }}
          />
        ))}
      </div>

      <svg
        className="absolute right-4 top-[40%] w-7 h-7 ambient-rotate text-orange/30"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
        <path d="M12 12L8.5 9" strokeLinecap="round" />
      </svg>

      <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-[800px] h-[400px] rounded-full bg-orange/[0.04] blur-[140px] ambient-blob" />
    </div>
  );
}
