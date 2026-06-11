import Link from "next/link";
import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";

type Mode = {
  badge: string;
  title: string;
  desc: string;
  href: string;
  bullets: string[];
  highlight?: boolean;
  comingSoon?: boolean;
  icon: React.ReactNode;
};

const modes: Mode[] = [
  {
    badge: "Экзамен",
    title: "Случайный экзамен",
    desc: "20 вопросов в режиме как на настоящем экзамене. Без подсказок, с разбором в конце.",
    href: "/tickets/quiz?mode=exam",
    bullets: ["20 случайных вопросов", "Проходной — 90%", "Разбор после теста"],
    highlight: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <path d="M14 3v6h6M9 13l2 2 4-4" />
      </svg>
    ),
  },
  {
    badge: "Темы",
    title: "Тренировка по темам",
    desc: "Выбираешь конкретный раздел и прорабатываешь до автоматизма.",
    href: "#topics",
    bullets: ["8 тематических блоков", "Вопросы только по теме", "Без таймера"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    badge: "Ошибки",
    title: "Работа над ошибками",
    desc: "Повтори вопросы, на которых уже спотыкался. Скоро подключим — пока копим статистику.",
    href: "#",
    bullets: ["Только ваши ошибки", "Локальное хранение", "Без регистрации"],
    comingSoon: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 12a9 9 0 0115-6.7L21 8M21 3v5h-5M21 12a9 9 0 01-15 6.7L3 16M3 21v-5h5" />
      </svg>
    ),
  },
];

export function TicketsModes() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute top-0 left-[10%] w-[480px] h-[280px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="01">Режимы</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            С чего <span className="text-orange">начать</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-10 max-w-[520px]">
            Три режима подготовки. Начни со случайного экзамена — посмотришь, где слабые места.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {modes.map((mode, i) => (
            <Reveal key={mode.title} delay={i * 100}>
              <ModeCard mode={mode} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ModeCard({ mode }: { mode: Mode }) {
  const base = mode.highlight
    ? "relative bg-white/[0.05] border border-orange/40 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(249,115,22,0.35)]"
    : "relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1";

  const inner = (
    <>
      <div
        className={`absolute -right-12 -top-12 w-44 h-44 rounded-full blur-[60px] pointer-events-none ${
          mode.highlight ? "bg-orange/[0.18]" : "bg-orange/[0.10]"
        }`}
        aria-hidden
      />

      <div className="relative flex items-center justify-between mb-5">
        <span className="inline-flex items-center bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase">
          {mode.badge}
        </span>
        {mode.comingSoon && (
          <span className="text-[10.5px] text-muted-on-navy/80 tracking-[0.14em] uppercase">Скоро</span>
        )}
      </div>

      <div className="relative flex items-start gap-4 mb-3">
        <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
          {mode.icon}
        </span>
        <div>
          <div className="text-[18px] font-medium text-white mb-1.5 leading-snug">{mode.title}</div>
          <p className="text-[13px] text-muted-on-navy leading-[1.6]">{mode.desc}</p>
        </div>
      </div>

      <ul className="relative mt-5 space-y-2 text-[12.5px] text-muted-on-navy">
        {mode.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" aria-hidden>
              <path d="M5 12l5 5L20 6" />
            </svg>
            {b}
          </li>
        ))}
      </ul>
    </>
  );

  if (mode.comingSoon) {
    return <div className={base + " opacity-60 cursor-not-allowed"}>{inner}</div>;
  }

  return (
    <Link href={mode.href} className={base + " block"}>
      {inner}
    </Link>
  );
}
