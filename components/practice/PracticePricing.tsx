import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";

type Pack = {
  badge: string;
  title: string;
  subtitle: string;
  lessons: number;
  hours: string;
  price: string;
  perLesson: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

const packs: Pack[] = [
  {
    badge: "Стартовый",
    title: "10 занятий",
    subtitle: "Минимальный набор для уверенной сдачи, если уже немного водишь.",
    lessons: 10,
    hours: "15 часов",
    price: "₾ 650",
    perLesson: "₾ 65 за занятие",
    features: [
      "10 занятий по 90 минут",
      "Площадка + город",
      "Маршруты МВД",
      "Бесплатный перенос за 12 часов",
    ],
    cta: "Записаться на 10",
  },
  {
    badge: "Стандарт",
    title: "20 занятий",
    subtitle: "Самый популярный пакет — хватает чтобы привыкнуть к авто и сдать с первого раза.",
    lessons: 20,
    hours: "30 часов",
    price: "₾ 1 200",
    perLesson: "₾ 60 за занятие",
    features: [
      "20 занятий по 90 минут",
      "Площадка + город + ночь",
      "Все экзаменационные маршруты",
      "Симуляция экзамена",
      "Бесплатный перенос за 12 часов",
    ],
    cta: "Записаться на 20",
    highlight: true,
  },
  {
    badge: "Полный",
    title: "30 занятий",
    subtitle: "Если водишь впервые. Не торопимся — отрабатываем каждый элемент до автомата.",
    lessons: 30,
    hours: "45 часов",
    price: "₾ 1 700",
    perLesson: "₾ 57 за занятие",
    features: [
      "30 занятий по 90 минут",
      "Все условия и ситуации",
      "Симуляция экзамена",
      "Поездки в плохую погоду",
      "Бесплатный перенос за 12 часов",
    ],
    cta: "Записаться на 30",
  },
];

export function PracticePricing() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[300px] bg-orange/[0.06] rounded-full blur-[130px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="02">Тарифы</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Три пакета на <span className="text-orange">выбор</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            Цены за занятие падают с объёмом. Также можно по одному занятию — ₾ 70 каждое.
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
          <span className="text-[10.5px] text-orange-soft tracking-[0.14em] uppercase font-medium">Популярный</span>
        )}
      </div>

      <div className="relative mb-2">
        <div className="text-[24px] font-medium text-white leading-snug mb-1">{pack.title}</div>
        <div className="text-[12px] text-muted-on-navy tracking-[0.1em]">{pack.hours} вождения</div>
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
