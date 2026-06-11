import Link from "next/link";
import { Reveal } from "../Reveal";
import { SectionLabel } from "../SectionLabel";
import { topics, questions } from "@/lib/tickets/data";

const iconMap: Record<string, React.ReactNode> = {
  sign: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <polygon points="12 2 22 8 22 16 12 22 2 16 2 8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  light: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="7" y="2" width="10" height="20" rx="4" />
      <circle cx="12" cy="7" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="12" cy="17" r="1.5" />
    </svg>
  ),
  cross: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3v18M3 12h18" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  ),
  speed: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 14l4-4M4 14a8 8 0 1116 0v3H4v-3z" />
    </svg>
  ),
  park: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M9 17V7h4a3 3 0 010 6H9" />
    </svg>
  ),
  ped: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="4" r="2" />
      <path d="M12 6v6m0 0l-3 8m3-8l3 8m-7-14h8" />
    </svg>
  ),
  weather: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M16 14a4 4 0 00-7.7-1.4A3.5 3.5 0 007 19h10a3 3 0 00-1-5z" />
      <path d="M8 22l-1 1M12 22l-1 1M16 22l-1 1" />
    </svg>
  ),
  doc: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z" />
      <path d="M14 3v6h6M9 13h6M9 17h6" />
    </svg>
  ),
};

export function TicketsTopics() {
  return (
    <section id="topics" className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <Reveal>
          <SectionLabel num="02">Темы</SectionLabel>
          <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
            Тренируйся по <span className="text-orange">блокам</span>
          </h2>
          <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-10 max-w-[520px]">
            Восемь тематических групп — выбирай слабое место и закрывай его до автоматизма.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {topics.map((topic, i) => {
            const count = questions.filter((q) => q.topicId === topic.id).length;
            return (
              <Reveal key={topic.id} delay={i * 50}>
                <Link
                  href={`/tickets/quiz?mode=topic&topic=${topic.id}`}
                  className="group relative block bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-5 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1"
                >
                  <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.08] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                  <div className="relative flex items-start justify-between mb-4">
                    <span className="w-11 h-11 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft">
                      {iconMap[topic.icon]}
                    </span>
                    <span className="text-[10.5px] text-muted-on-navy tracking-[0.12em] uppercase mt-1">
                      {count} вопр.
                    </span>
                  </div>

                  <h3 className="relative text-[15px] font-medium text-white mb-1.5 leading-snug">{topic.title}</h3>
                  <p className="relative text-[12.5px] text-muted-on-navy leading-[1.55]">{topic.description}</p>

                  <div className="relative mt-5 pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11.5px] text-muted-on-navy">
                    <span>Начать тренировку</span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#FDBA74"
                      strokeWidth="2"
                      className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                      aria-hidden
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
