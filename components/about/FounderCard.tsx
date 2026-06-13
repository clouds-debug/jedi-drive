import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";

const qualities = [
  "Терпеливый",
  "Спокойный",
  "Методичный",
  "Лояльный",
  "Искренний",
  "Внимательный к деталям",
];

export function FounderCard() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute top-0 left-[15%] w-[460px] h-[280px] bg-orange/[0.06] rounded-full blur-[120px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="01">Основатель</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Кто стоит за <span className="text-orange">Jedi Drive</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            Не сетевая франшиза и не семейный бизнес из 80-х. История гораздо проще — один молодой парень собрал команду.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative bg-white/[0.04] border border-white/15 border-l-[3px] border-l-orange rounded-2xl overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-orange/[0.15] rounded-full blur-[100px] pointer-events-none" aria-hidden />
            <div className="absolute -left-16 bottom-0 w-64 h-64 bg-orange/[0.08] rounded-full blur-[100px] pointer-events-none" aria-hidden />

            <div className="relative grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col items-center lg:items-start">
                <div className="relative w-[180px] h-[180px] rounded-full bg-gradient-to-br from-orange/40 via-orange/15 to-transparent grid place-items-center mb-5">
                  <div className="absolute inset-0 rounded-full border border-orange/30" />
                  <span className="text-[64px] font-medium text-orange-soft leading-none tracking-tight">АН</span>
                </div>

                <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 w-full">
                  <Stat label="Возраст" value="23" sub="года" />
                  <Stat label="За рулём" value="5" sub="лет" />
                  <Stat label="Обучает" value="3" sub="года" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-[11px] text-orange-soft tracking-[0.16em] uppercase">Основатель и владелец</span>
                </div>
                <h3 className="text-[36px] sm:text-[44px] font-medium text-white leading-tight tracking-[-0.02em] mb-4">
                  Анри
                </h3>

                <div className="space-y-4 text-[14.5px] text-white/95 leading-[1.7] mb-7">
                  <p>
                    Сам сел за руль в 18, прошёл путь от полной растерянности до уверенного водителя за 8 месяцев.
                  </p>
                  <p>
                    В 2023 году запустил онлайн-обучение по теории — людям было дешевле и удобнее проходить ПДД из дома, чем ездить в офис. В 2025 году открыл свою площадку: после долгих поисков понял, что найти хороших инструкторов в Тбилиси непросто, поэтому собрал команду сам.
                  </p>
                  <p>
                    Главное правило команды — терпение важнее результата. Лояльность к ученику, ясность объяснений, никакого давления.
                  </p>
                </div>

                <div>
                  <div className="text-[11px] text-orange-soft tracking-[0.16em] uppercase mb-3">Качества</div>
                  <div className="flex flex-wrap gap-2">
                    {qualities.map((q) => (
                      <span
                        key={q}
                        className="bg-white/[0.05] border border-white/10 text-[12.5px] text-white px-3 py-1.5 rounded-full"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-white/[0.04] border border-white/10 rounded-lg px-3.5 py-3 text-center lg:text-left">
      <div className="text-[10px] text-muted-on-navy tracking-[0.14em] uppercase mb-1">{label}</div>
      <div className="flex items-baseline gap-1.5 justify-center lg:justify-start">
        <span className="text-[24px] font-medium text-white leading-none">{value}</span>
        <span className="text-[11px] text-muted-on-navy">{sub}</span>
      </div>
    </div>
  );
}
