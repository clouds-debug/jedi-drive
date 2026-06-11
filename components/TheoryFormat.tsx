import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

const features = [
  {
    title: "Zoom + интерактивная доска",
    desc: "Преподаватель ведёт занятие в реальном времени, разбирает схемы и билеты прямо на экране.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="2" y="4" width="20" height="13" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <circle cx="12" cy="10.5" r="2" />
      </svg>
    ),
  },
  {
    title: "Группа до 8 человек",
    desc: "Маленькая группа — каждый успевает задать вопрос. Можно и индивидуально, если хочется свой темп.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="9" cy="9" r="3" />
        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 7a3 3 0 010 6M21 20c0-2.7-1.8-5-4-5.7" />
      </svg>
    ),
  },
  {
    title: "Запись каждого занятия",
    desc: "Пропустил или не понял — пересмотри. Записи остаются у тебя до сдачи экзамена.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Чат с преподавателем",
    desc: "Telegram-канал с группой и куратором. Вопросы можно задавать в любое время.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M21 12a8 8 0 11-3.5-6.6L21 4l-1.4 3.5A7.96 7.96 0 0121 12z" />
        <path d="M8 12h8M8 9h5" />
      </svg>
    ),
  },
  {
    title: "Симулятор билетов МВД",
    desc: "Тренируйся на наших билетах — те же вопросы и интерфейс, что и на реальном экзамене.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    title: "Домашние задания",
    desc: "После каждого занятия — мини-задание на 15 минут. Закрепляешь тему, не забывая на следующей неделе.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
        <path d="M14 3v6h6M8 13l2 2 4-4" />
      </svg>
    ),
  },
];

export function TheoryFormat() {
  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute -right-32 top-1/4 w-[460px] h-[460px] bg-orange/[0.05] rounded-full blur-[140px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="03">Формат</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Как проходит <span className="text-orange">онлайн</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
            Никаких офисов и пыльных кабинетов. Всё что нужно — ноутбук или телефон с интернетом.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1">
                <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                <div className="relative flex items-start gap-4">
                  <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
                    {f.icon}
                  </span>
                  <div>
                    <div className="text-[16px] font-medium text-white mb-1.5">{f.title}</div>
                    <p className="text-[13px] text-muted-on-navy leading-[1.6]">{f.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
