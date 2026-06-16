type Segment = { label: string; value: number; color: string };

export function DonutChart({
  segments,
  centerLabel,
  centerValue,
}: {
  segments: Segment[];
  centerLabel: string;
  centerValue: string | number;
}) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const size = 180;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  let offset = 0;

  return (
    <div className="flex items-center gap-6 flex-wrap">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="shrink-0 -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={stroke}
        />
        {total > 0 &&
          segments.map((seg) => {
            const len = (seg.value / total) * c;
            const dash = `${len} ${c - len}`;
            const el = (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += len;
            return el;
          })}
      </svg>

      <div className="flex-1 min-w-[180px] space-y-2">
        <div>
          <div className="text-[10.5px] text-muted-on-navy tracking-[0.1em] uppercase mb-1">
            {centerLabel}
          </div>
          <div className="text-[28px] font-medium text-white tabular-nums leading-none">
            {centerValue}
          </div>
        </div>
        <ul className="space-y-1.5 mt-3">
          {segments.map((s) => {
            const pct = total > 0 ? Math.round((s.value / total) * 100) : 0;
            return (
              <li key={s.label} className="flex items-center gap-2.5 text-[12.5px]">
                <span
                  className="w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ background: s.color }}
                  aria-hidden
                />
                <span className="text-muted-on-navy flex-1">{s.label}</span>
                <span className="text-white tabular-nums">{s.value}</span>
                <span className="text-muted-on-navy/70 text-[11px] tabular-nums w-9 text-right">
                  {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
