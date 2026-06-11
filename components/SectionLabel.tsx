export function SectionLabel({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-[11px] text-orange tabular-nums tracking-[0.1em]">{num}</span>
      <span className="h-px w-14 bg-gradient-to-r from-orange/55 to-transparent" />
      <span className="text-[13px] text-muted-on-navy font-medium tracking-[0.01em]">{children}</span>
    </div>
  );
}
