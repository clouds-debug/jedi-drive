import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";

type Feature = {
  badge: string;
  title: string;
  desc: string;
  bullets: string[];
  icon: React.ReactNode;
};

const features: Feature[] = [
  {
    badge: "Автопарк",
    title: "Новые автомобили 2022+",
    desc: "Toyota Corolla и Hyundai Elantra последних годов, в идеальном состоянии. Кондиционер летом, подогрев зимой.",
    bullets: ["АКПП на всех машинах", "Дублирующие педали", "Регулярное ТО"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 13l1.5-5.5A2 2 0 018.5 6h7a2 2 0 012 1.5L19 13M3 17h18M5 13v3m14-3v3M7 17v1.5a1.5 1.5 0 003 0V17m4 0v1.5a1.5 1.5 0 003 0V17" />
      </svg>
    ),
  },
  {
    badge: "Площадка",
    title: "Своя площадка с новым покрытием",
    desc: "Свежий асфальт, разметка 1 в 1 как на экзамене МВД. Учишься в условиях, в которых будешь сдавать.",
    bullets: ["Удобный заезд из центра", "Экзаменационная разметка", "Безопасно для новичков"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="6" width="18" height="13" rx="1.5" />
        <path d="M3 11h18M7 6V4M17 6V4" />
      </svg>
    ),
  },
  {
    badge: "Расположение",
    title: "В центре Тбилиси",
    desc: "Удобно добраться из любого района. Близко к метро, есть бесплатная парковка для своего авто.",
    bullets: ["5 минут от метро", "Парковка бесплатно", "Кофейни и кафе рядом"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    badge: "Инструкторы",
    title: "Опытные и спокойные",
    desc: "Все с лицензией МВД Грузии, средний стаж — 10 лет. Учат без крика, объясняют на родном языке.",
    bullets: ["Лицензия МВД", "ru / ge / en", "Подбор под характер"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="5" />
        <path d="M8 13l-2 8 6-3 6 3-2-8" />
      </svg>
    ),
  },
  {
    badge: "Маршруты",
    title: "Реальные маршруты МВД",
    desc: "Катаемся по тем же улицам, по которым пойдёшь на экзамене. Знаешь повороты заранее — сдаёшь увереннее.",
    bullets: ["Все экзаменационные маршруты", "Сложные перекрёстки", "Парковка задним ходом"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
      </svg>
    ),
  },
  {
    badge: "Расписание",
    title: "Гибкие окна записи",
    desc: "Записываешься на удобное время прямо у инструктора в календаре. Можно перенести за 12 часов без штрафа.",
    bullets: ["Запись онлайн", "Перенос за 12 часов", "С 8:00 до 21:00"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M3 10h18M8 3v4M16 3v4" />
      </svg>
    ),
  },
];

export function PracticeFeatures() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
          backgroundSize: "30px 30px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.6) 75%, rgba(0,0,0,0) 100%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="02">Преимущества</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Что входит в <span className="text-orange">практику</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            Не только машина и инструктор. Всё, что нужно чтобы выйти на экзамен подготовленным.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 70}>
              <div className="group relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1 flex flex-col">
                <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                <div className="relative flex items-start gap-4 mb-3">
                  <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
                    {f.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-muted-on-navy tracking-[0.14em] uppercase mb-1">{f.badge}</div>
                    <div className="text-[16px] font-medium text-white mb-1.5 leading-snug">{f.title}</div>
                    <p className="text-[13px] text-muted-on-navy leading-[1.6]">{f.desc}</p>
                  </div>
                </div>

                <ul className="relative mt-auto pt-5 space-y-2 text-[12.5px] text-muted-on-navy">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" aria-hidden>
                        <path d="M5 12l5 5L20 6" />
                      </svg>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
