import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { InstructorsStandards } from "@/components/instructors/InstructorsStandards";
import { InstructorsGrid } from "@/components/instructors/InstructorsGrid";
import { instructors } from "@/lib/instructors/data";

export const metadata: Metadata = {
  title: "Инструкторы — Jedi Drive",
  description:
    "9 лицензированных инструкторов в команде Jedi Drive. Опытные, многоязычные, без крика. Кликни по карточке — посмотри отзывы и био.",
};

export default function InstructorsPage() {
  const total = instructors.length;
  const avgRating = (instructors.reduce((s, i) => s + i.rating, 0) / total).toFixed(1);
  const avgExp = Math.round(instructors.reduce((s, i) => s + i.experienceYears, 0) / total);
  const allLangs = Array.from(new Set(instructors.flatMap((i) => i.languages))).sort();

  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
          <div className="absolute top-0 left-[10%] w-[440px] h-[260px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <p className="hero-rise text-[12px] text-orange-soft tracking-[0.1em] uppercase mb-4">
                Команда · {total} инструкторов
              </p>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[680px]">
                Кто будет тебя <span className="text-orange">учить</span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-8 max-w-[560px]"
                style={{ animationDelay: "80ms" }}
              >
                {total} лицензированных инструкторов. Все спокойные, терпеливые, без давления. Можно листать карточки и сравнивать — у каждого свой стиль и характер.
              </p>

              <div
                className="hero-rise flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-muted-on-navy bg-white/[0.04] border border-white/10 px-5 py-3 rounded-lg max-w-fit"
                style={{ animationDelay: "160ms" }}
              >
                <span className="flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                    <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                  </svg>
                  <span className="text-white">{avgRating}</span> средний рейтинг
                </span>
                <span className="w-px h-3.5 bg-white/15" />
                <span><span className="text-white">{avgExp} лет</span> средний стаж</span>
                <span className="w-px h-3.5 bg-white/15" />
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
                  {allLangs.join(" · ")}
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <InstructorsStandards />
        <InstructorsGrid />
      </main>
      <Footer />
    </>
  );
}
