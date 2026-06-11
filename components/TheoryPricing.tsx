import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

type Plan = {
  badge: string;
  title: string;
  subtitle: string;
  price: string;
  priceNote: string;
  perLesson: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  icon: React.ReactNode;
};

const plans: Plan[] = [
  {
    badge: "Группа",
    title: "В группе онлайн",
    subtitle: "До 8 человек в Zoom по фиксированному расписанию.",
    price: "₾ 450",
    priceNote: "за весь курс",
    perLesson: "≈ ₾28 за занятие",
    features: [
      "16 занятий по 90 мин",
      "Группа до 8 человек",
      "Зафиксированное расписание",
      "Запись каждого занятия",
      "Telegram-чат с куратором",
      "Симулятор билетов МВД",
    ],
    cta: "Записаться в группу",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="9" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 7a3 3 0 010 6M21 20c0-2.7-1.8-5-4-5.7" />
      </svg>
    ),
  },
  {
    badge: "Индивидуально",
    title: "Один на один",
    subtitle: "Только ты и преподаватель. График и темп — под тебя.",
    price: "₾ 900",
    priceNote: "за весь курс",
    perLesson: "≈ ₾56 за занятие",
    features: [
      "16 занятий по 90 мин",
      "Только ты и преподаватель",
      "Гибкое расписание под твой график",
      "Программа подстраивается под слабые места",
      "Прямой контакт с преподавателем",
      "Симулятор билетов МВД",
    ],
    cta: "Хочу индивидуально",
    highlight: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      </svg>
    ),
  },
];

export function TheoryPricing() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[300px] bg-orange/[0.06] rounded-full blur-[130px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="04">Тарифы</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Группа или <span className="text-orange">индивидуально</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            Один курс — два формата на выбор. Цены фиксированные, без скрытых сборов.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <Reveal key={plan.title} delay={i * 120}>
              <PricingCard plan={plan} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={280}>
          <p className="text-center text-[12.5px] text-muted-on-navy/80 mt-8 max-w-[640px] mx-auto leading-[1.65]">
            Цены указаны за весь курс из 16 занятий. Оплата помесячно или единоразово — расскажем на первом созвоне.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PricingCard({ plan }: { plan: Plan }) {
  const baseClass = plan.highlight
    ? "relative bg-white/[0.05] border border-orange/40 border-l-[3px] border-l-orange rounded-2xl p-7 sm:p-8 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(249,115,22,0.35)]"
    : "relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-2xl p-7 sm:p-8 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1";

  return (
    <div className={baseClass}>
      <div
        className={`absolute -right-16 -top-16 w-72 h-72 rounded-full blur-[80px] pointer-events-none ${
          plan.highlight ? "bg-orange/[0.18]" : "bg-orange/[0.10]"
        }`}
        aria-hidden
      />

      <div className="relative flex items-center gap-3 mb-6">
        <span className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase">
          {plan.badge}
        </span>
        {plan.highlight && (
          <span className="text-[10.5px] text-orange-soft tracking-[0.14em] uppercase font-medium">
            Premium
          </span>
        )}
      </div>

      <div className="relative flex items-start gap-4 mb-6">
        <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
          {plan.icon}
        </span>
        <div>
          <div className="text-[20px] font-medium text-white mb-1 leading-snug">{plan.title}</div>
          <p className="text-[13px] text-muted-on-navy leading-[1.55]">{plan.subtitle}</p>
        </div>
      </div>

      <div className="relative mb-7 pb-6 border-b border-white/[0.08]">
        <div className="flex items-end gap-2 mb-1">
          <span className="text-[44px] font-medium text-white leading-none tracking-tight">{plan.price}</span>
          <span className="text-[13px] text-muted-on-navy pb-2">{plan.priceNote}</span>
        </div>
        <div className="text-[12px] text-muted-on-navy/80">{plan.perLesson}</div>
      </div>

      <ul className="relative space-y-2.5 mb-7">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 text-[13px] text-muted-on-navy">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F97316"
              strokeWidth="2.5"
              className="mt-1 shrink-0"
              aria-hidden
            >
              <path d="M5 12l5 5L20 6" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href="#enroll"
        className={`relative block w-full text-center py-3.5 rounded-lg font-medium text-[14px] transition-all hover:translate-y-[-1px] active:scale-[0.98] ${
          plan.highlight
            ? "bg-orange hover:bg-[#EA670F] text-white"
            : "bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/15 hover:border-white/30"
        }`}
      >
        {plan.cta}
      </a>
    </div>
  );
}
