import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

type Card = {
  title: string;
  desc: string;
  bullets: string[];
  badge?: string;
  pulse?: boolean;
  icon: React.ReactNode;
};

const cards: Card[] = [
  {
    title: "Опытные инструкторы",
    desc: "Лицензия МВД Грузии, средний стаж — 8 лет. Учим терпеливо, на родном языке, без крика и нервов.",
    bullets: ["ru · ge на выбор", "Дружелюбный подход", "Подбор под характер"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="8" r="5" />
        <path d="M8 13l-2 8 6-3 6 3-2-8" />
      </svg>
    ),
  },
  {
    title: "Современный автопарк",
    desc: "Авто 2022 года и новее. АКПП, дублирующие педали, кондиционер. Машины в идеальном состоянии.",
    bullets: ["АКПП", "Дублёры педалей", "Чисто и комфортно"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M5 13l1.5-5.5A2 2 0 018.5 6h7a2 2 0 012 1.5L19 13M3 17h18M5 13v3m14-3v3M7 17v1.5a1.5 1.5 0 003 0V17m4 0v1.5a1.5 1.5 0 003 0V17" />
      </svg>
    ),
  },
  {
    title: "Маршруты экзамена",
    desc: "Катаемся по реальным маршрутам МВД — на экзамене дорога будет уже знакомой, можно сосредоточиться на вождении.",
    bullets: ["Маршруты МВД", "Сложные перекрёстки", "Парковки и манёвры"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M12 21s-7-6.5-7-12a7 7 0 0114 0c0 5.5-7 12-7 12z" />
        <circle cx="12" cy="9" r="2.5" />
      </svg>
    ),
  },
  {
    badge: "Live",
    pulse: true,
    title: "Полностью онлайн обучение",
    desc: "Теория идёт по Zoom — группа до 8 человек или индивидуально, с любого устройства. Не нужно ехать в офис: подключайся хоть с ноутбука, хоть с телефона.",
    bullets: ["Группа до 8 человек", "Запись занятий доступна", "ru · ge на выбор"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <circle cx="12" cy="10.5" r="2" />
      </svg>
    ),
  },
  {
    title: "Своя площадка",
    desc: "Удобное расположение в Тбилиси, свежее покрытие, разметка 1 в 1 как на экзамене. Сразу попадаешь в условия, которые будут на сдаче.",
    bullets: ["Удобный заезд", "Новое покрытие", "Экзаменационная разметка"],
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="6" width="18" height="13" rx="1.5" />
        <path d="M3 11h18M7 6V4M17 6V4" />
      </svg>
    ),
  },
];

function Check() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="2.5" aria-hidden>
      <path d="M5 12l5 5L20 6" />
    </svg>
  );
}

function FeatureCard({ card }: { card: Card }) {
  return (
    <div className="group relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:border-l-orange hover:-translate-y-1 flex flex-col">
      <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.12] rounded-full blur-[60px] pointer-events-none" aria-hidden />

      <div className="relative flex items-start gap-4 mb-3">
        <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
          {card.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="text-[17px] font-medium text-white leading-snug">{card.title}</div>
            {card.badge && (
              <span className="inline-flex items-center gap-2 bg-orange/15 text-orange-soft px-2.5 py-1 rounded-full text-[10.5px] font-medium tracking-[0.14em] uppercase shrink-0 mt-0.5">
                {card.pulse && (
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-orange opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-orange" />
                  </span>
                )}
                {card.badge}
              </span>
            )}
          </div>
          <p className="text-[13px] text-muted-on-navy leading-[1.6]">{card.desc}</p>
        </div>
      </div>

      <ul className="relative mt-auto pt-5 space-y-2 text-[12.5px] text-muted-on-navy">
        {card.bullets.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <Check />
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Features() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)",
          backgroundSize: "28px 28px",
          maskImage: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 25%, rgba(0,0,0,0.7) 75%, rgba(0,0,0,0) 100%)",
        }}
      />
      <div className="absolute top-0 left-[15%] w-[480px] h-[280px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="01">Подход</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-10 max-w-[540px]">
            Что мы делаем <span className="text-orange">по-другому</span>
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
          {cards.slice(0, 3).map((card, i) => (
            <Reveal key={card.title} delay={i * 80}>
              <FeatureCard card={card} />
            </Reveal>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {cards.slice(3).map((card, i) => (
            <Reveal key={card.title} delay={(i + 3) * 80}>
              <FeatureCard card={card} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
