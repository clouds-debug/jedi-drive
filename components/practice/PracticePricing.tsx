import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";

type Pack = {
  badge: string;
  title: string;
  subtitle: string;
  lessons: string;
  price: string;
  perLesson: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  icon: React.ReactNode;
};

export const tariffOptions = [
  { id: "platform", name: "Только площадка", price: "₾ 500", lessons: "10" },
  { id: "combo", name: "Площадка + город", price: "₾ 1 100", lessons: "20" },
  { id: "city", name: "Только город", price: "₾ 650", lessons: "10" },
];

const packs: Pack[] = [
  {
    badge: "Площадка",
    title: "Только площадка",
    subtitle: "Базовые навыки на закрытой площадке: посадка, руль, педали, упражнения для экзамена.",
    lessons: "10 занятий по 90 минут",
    price: "₾ 500",
    perLesson: "₾ 50 за занятие",
    features: [
      "Своя площадка с новым покрытием",
      "Экзаменационная разметка",
      "Без выезда в город",
      "Безопасно для совсем новичков",
    ],
    cta: "Записаться",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="6" width="18" height="13" rx="1.5" />
        <path d="M3 11h18M7 6V4M17 6V4" />
      </svg>
    ),
  },
  {
    badge: "Полный курс",
    title: "Площадка + город",
    subtitle: "Стандартный путь: сначала базы на площадке, потом реальные маршруты МВД в городе.",
    lessons: "20 занятий по 90 минут",
    price: "₾ 1 100",
    perLesson: "₾ 55 за занятие",
    features: [
      "8 занятий на площадке",
      "12 занятий по городу",
      "Все экзаменационные маршруты",
      "Симуляция экзамена",
      "Самый частый выбор учеников",
    ],
    cta: "Полный курс",
    highlight: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 13l1.5-5.5A2 2 0 018.5 6h7a2 2 0 012 1.5L19 13M3 17h18M5 13v3m14-3v3M7 17v1.5a1.5 1.5 0 003 0V17m4 0v1.5a1.5 1.5 0 003 0V17" />
      </svg>
    ),
  },
  {
    badge: "Город",
    title: "Только город",
    subtitle: "Если ты уже водишь и нужны только экзаменационные маршруты и уверенность в реальных условиях.",
    lessons: "10 занятий по 90 минут",
    price: "₾ 650",
    perLesson: "₾ 65 за занятие",
    features: [
      "Реальные улицы Тбилиси",
      "Все экзаменационные маршруты",
      "Сложные перекрёстки",
      "Парковка в плотном потоке",
    ],
    cta: "Записаться",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 21h18M5 21V8l7-5 7 5v13M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2" />
      </svg>
    ),
  },
];

export function PracticePricing() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[300px] bg-orange/[0.06] rounded-full blur-[130px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="03">Тарифы</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Три пакета на <span className="text-orange">выбор</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            Только площадка, только город или комбо. По одному занятию тоже можно — ₾ 70 / урок.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {packs.map((pack, i) => (
            <Reveal key={pack.title} delay={i * 100}>
              <PackCard pack={pack} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={320}>
          <p className="text-center text-[12.5px] text-muted-on-navy/80 mt-8 max-w-[640px] mx-auto leading-[1.65]">
            Оплата помесячно или единоразово. Если не сдашь экзамен — поможем подобрать дополнительные занятия со скидкой.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PackCard({ pack }: { pack: Pack }) {
  const base = pack.highlight
    ? "relative bg-white/[0.05] border border-orange/40 border-l-[3px] border-l-orange rounded-2xl p-7 sm:p-8 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(249,115,22,0.35)]"
    : "relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-2xl p-7 sm:p-8 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1";

  return (
    <div className={base + " flex flex-col"}>
      <div
        className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none ${
          pack.highlight ? "bg-orange/[0.18]" : "bg-orange/[0.10]"
        }`}
        aria-hidden
      />

      <div className="relative flex items-center gap-3 mb-5">
        <span className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase">
          {pack.badge}
        </span>
        {pack.highlight && (
          <span className="text-[10.5px] text-orange-soft tracking-[0.14em] uppercase font-medium">
            Популярный
          </span>
        )}
      </div>

      <div className="relative flex items-start gap-4 mb-3">
        <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
          {pack.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="text-[20px] font-medium text-white mb-1 leading-snug">{pack.title}</div>
          <div className="text-[12px] text-muted-on-navy tracking-[0.04em]">{pack.lessons}</div>
        </div>
      </div>

      <p className="relative text-[13px] text-muted-on-navy leading-[1.55] mb-6">{pack.subtitle}</p>

      <div className="relative mb-7 pb-6 border-b border-white/[0.08]">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-[44px] font-medium text-white leading-none tracking-tight">{pack.price}</span>
        </div>
        <div className="text-[12px] text-muted-on-navy/80">{pack.perLesson}</div>
      </div>

      <ul className="relative space-y-2.5 mb-7">
        {pack.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] text-muted-on-navy">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" className="mt-1 shrink-0" aria-hidden>
              <path d="M5 12l5 5L20 6" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="#booking"
        className={`relative mt-auto block w-full text-center py-3.5 rounded-lg font-medium text-[14px] transition-all hover:translate-y-[-1px] active:scale-[0.98] ${
          pack.highlight
            ? "bg-orange hover:bg-[#EA670F] text-white"
            : "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/15 hover:border-white/30"
        }`}
      >
        {pack.cta}
      </a>
    </div>
  );
}
