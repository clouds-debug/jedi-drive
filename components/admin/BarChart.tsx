type Row = {
  label: string;
  bookings: number;
  completed: number;
  cancelled: number;
};

const COLORS = {
  bookings: "#F97316", // orange
  completed: "#60A5FA", // blue
  cancelled: "rgba(255,255,255,0.18)", // grey
};

export function BarChart({ rows }: { rows: Row[] }) {
  const max = Math.max(
    1,
    ...rows.flatMap((r) => [r.bookings, r.completed, r.cancelled]),
  );

  const groupCount = rows.length;
  const groupWidth = 100 / groupCount;
  const barWidth = (groupWidth - 2) / 3; // 3 series

  return (
    <div>
      <div className="flex items-center gap-4 mb-3 text-[11.5px] text-muted-on-navy">
        <Legend color={COLORS.bookings} label="Заявок" />
        <Legend color={COLORS.completed} label="Проведено" />
        <Legend color={COLORS.cancelled} label="Отменено" />
      </div>

      <div className="relative w-full h-[220px] bg-white/[0.02] border border-white/[0.06] rounded-lg p-4">
        {/* Y grid */}
        <div className="absolute inset-4 flex flex-col justify-between text-[10px] text-muted-on-navy/60 font-mono tabular-nums">
          {[max, Math.round((max * 2) / 3), Math.round(max / 3), 0].map((v, i) => (
            <div key={i} className="flex items-center gap-2 w-full">
              <span className="w-6 text-right">{v}</span>
              <span className="flex-1 h-px bg-white/[0.04]" />
            </div>
          ))}
        </div>

        {/* Bars layer */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute left-[44px] right-4 top-4 bottom-8 w-[calc(100%-60px)] h-[calc(100%-48px)]"
        >
          {rows.map((row, i) => {
            const x0 = i * groupWidth + 1;
            const bars: { key: string; v: number; color: string; x: number }[] = [
              { key: "bookings", v: row.bookings, color: COLORS.bookings, x: x0 },
              {
                key: "completed",
                v: row.completed,
                color: COLORS.completed,
                x: x0 + barWidth,
              },
              {
                key: "cancelled",
                v: row.cancelled,
                color: COLORS.cancelled,
                x: x0 + barWidth * 2,
              },
            ];
            return (
              <g key={i}>
                {bars.map((b) => {
                  const h = (b.v / max) * 100;
                  return (
                    <rect
                      key={b.key}
                      x={b.x}
                      y={100 - h}
                      width={barWidth - 0.6}
                      height={h}
                      fill={b.color}
                      rx="0.5"
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>

        {/* X labels */}
        <div className="absolute left-[44px] right-4 bottom-2 flex">
          {rows.map((r, i) => (
            <div
              key={i}
              className="text-[10.5px] text-muted-on-navy text-center tabular-nums"
              style={{ width: `${100 / groupCount}%` }}
            >
              {r.label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} aria-hidden />
      {label}
    </span>
  );
}
