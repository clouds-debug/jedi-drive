import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";

const stats = [
  { value: "92%", label: "Сдают с первого раза", note: "по данным за 2025 год" },
  { value: "1 200+", label: "Выпускников", note: "с открытия школы" },
  { value: "9", label: "Инструкторов в команде", note: "все лицензированы МВД" },
  { value: "4.8", label: "Средний рейтинг команды", note: "по отзывам выпускников" },
];

export function AboutStats() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="02">Цифры</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Что мы успели за <span className="text-orange">3 года</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            Не любим хвастаться — лучше пусть говорят цифры.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 90}>
              <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1">
                <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />
                <div className="relative">
                  <div className="text-[42px] sm:text-[48px] font-medium text-white leading-none tracking-tight mb-2">
                    {s.value}
                  </div>
                  <div className="text-[14px] text-white font-medium mb-1.5">{s.label}</div>
                  <div className="text-[11.5px] text-muted-on-navy">{s.note}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
