import Link from "next/link";

export function Hero() {
  return (
    <section className="bg-navy text-white pt-10 pb-16 relative overflow-hidden">
      <div className="absolute inset-x-0 -top-40 h-[500px] pointer-events-none" aria-hidden>
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[500px] bg-orange/[0.07] rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="max-w-[560px] mb-10">
          <p className="hero-rise text-[12px] text-orange-soft tracking-[0.1em] uppercase mb-4" style={{ animationDelay: "0ms" }}>
            Автошкола · Тбилиси · Категория B
          </p>
          <h1
            className="hero-rise text-[40px] sm:text-[52px] leading-[1.04] tracking-[-0.025em] font-medium mb-4"
            style={{ animationDelay: "80ms" }}
          >
            Стань мастером <span className="text-orange">дороги.</span>
          </h1>
          <p
            className="hero-rise text-[15px] text-muted-on-navy leading-[1.65] max-w-[460px]"
            style={{ animationDelay: "160ms" }}
          >
            Подготовка к экзамену по категории B. Теория и практика — выбери, с чего начать.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PathCard
            href="/services/theory"
            iconBg="bg-white/[0.08]"
            iconColor="text-orange-soft"
            icon={
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
                <path d="M4 17a3 3 0 0 1 3-3h12" />
              </svg>
            }
            title="Теория"
            description="ПДД, экзаменационные билеты, разбор сложных тем. Очно в группе или онлайн."
            meta="от 4 недель"
            delay={240}
          />
          <PathCard
            href="/services/practice"
            iconBg="bg-orange/15"
            iconColor="text-orange-soft"
            icon={
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="8" />
                <circle cx="12" cy="12" r="3" />
                <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
              </svg>
            }
            title="Практика"
            description="Автодром и реальный город Тбилиси с лицензированным инструктором. Авто АКПП."
            meta="по 90 минут"
            delay={320}
          />
        </div>
      </div>
    </section>
  );
}

function PathCard({
  href,
  iconBg,
  iconColor,
  icon,
  title,
  description,
  meta,
  delay,
}: {
  href: string;
  iconBg: string;
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  meta: string;
  delay: number;
}) {
  return (
    <Link
      href={href}
      className="hero-rise group block bg-white/[0.04] border border-white/10 rounded-[var(--radius-card)] p-5 transition-all duration-300 hover:bg-white/[0.07] hover:border-white/20 hover:-translate-y-1"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`w-10 h-10 rounded-[var(--radius-chip)] grid place-items-center ${iconBg} ${iconColor}`}>{icon}</span>
        <span className="text-[17px] font-medium text-white">{title}</span>
      </div>
      <p className="text-[13px] text-muted-on-navy leading-[1.6] mb-5 min-h-[60px]">{description}</p>
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted-on-navy">{meta}</span>
        <span className="inline-flex items-center gap-1.5 bg-orange text-white pl-3.5 pr-3 py-2 rounded-[var(--radius-btn)] text-[12.5px] font-medium transition-transform group-hover:translate-x-0.5">
          Записаться
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
