import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";

const MAPS_LINK = "https://maps.app.goo.gl/i2MwNTmYcXzgypLg8?g_st=ic";

export function AboutLocation() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="03">Площадка</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Где нас <span className="text-orange">найти</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            Тбилиси, удобное расположение в центре. Свежее покрытие, экзаменационная разметка, бесплатная парковка.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px]">
              <div className="relative h-[360px] lg:h-[440px] bg-white/[0.02]">
                <iframe
                  title="Jedi Drive на карте"
                  src="https://www.google.com/maps?q=Тбилиси,+Грузия&output=embed&z=13&hl=ru"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0 w-full h-full grayscale-[20%] contrast-95 opacity-90"
                  style={{ border: 0 }}
                />
                <div className="absolute inset-0 bg-navy/10 pointer-events-none" aria-hidden />
              </div>

              <div className="p-6 sm:p-7 lg:p-8 flex flex-col gap-5 bg-navy/40 backdrop-blur-sm">
                <div>
                  <div className="text-[11px] text-orange-soft tracking-[0.16em] uppercase mb-2">Адрес</div>
                  <div className="text-[15px] text-white leading-[1.5]">
                    Тбилиси, Грузия
                  </div>
                  <div className="text-[12.5px] text-muted-on-navy mt-1">
                    Точные координаты — по ссылке на карту
                  </div>
                </div>

                <div className="space-y-3 text-[12.5px]">
                  <div className="flex items-start gap-2.5 text-muted-on-navy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7" className="mt-0.5 shrink-0" aria-hidden>
                      <path d="M21 12a9 9 0 11-3.5-7.07L21 4M21 4v5h-5" />
                    </svg>
                    <span>5 минут от метро</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-muted-on-navy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7" className="mt-0.5 shrink-0" aria-hidden>
                      <rect x="3" y="3" width="18" height="18" rx="2.5" />
                      <path d="M9 17V7h4a3 3 0 010 6H9" />
                    </svg>
                    <span>Бесплатная парковка</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-muted-on-navy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.7" className="mt-0.5 shrink-0" aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 7v6l4 2" />
                    </svg>
                    <span>Открыто 8:00 — 21:00</span>
                  </div>
                </div>

                <a
                  href={MAPS_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 bg-orange hover:bg-[#EA670F] text-white px-5 py-3 rounded-lg text-[13.5px] font-medium transition-all hover:translate-y-[-1px]"
                >
                  Открыть в Google Maps
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M7 17L17 7M17 7H8M17 7v9" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
