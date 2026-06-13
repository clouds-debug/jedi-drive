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

      <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-[800px] h-[400px] rounded-full bg-orange/[0.04] blur-[140px] ambient-blob" />
    </div>
  );
}
