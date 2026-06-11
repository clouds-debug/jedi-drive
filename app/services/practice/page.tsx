import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { PracticeFeatures } from "@/components/practice/PracticeFeatures";
import { PracticePricing } from "@/components/practice/PracticePricing";
import { InstructorsPreview } from "@/components/practice/InstructorsPreview";
import { PracticeBooking } from "@/components/practice/PracticeBooking";

export const metadata: Metadata = {
  title: "Запись на практику — Jedi Drive",
  description:
    "Практика вождения категории B в Тбилиси. Новые авто 2022+, своя площадка, опытные инструкторы. Запись в календарь инструктора онлайн.",
};

export default function PracticePage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
          <div className="absolute top-0 left-[10%] w-[440px] h-[260px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="00">Запись на практику · категория B</SectionLabel>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[680px]">
                Сядь за руль с <span className="text-orange">инструктором</span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-8 max-w-[540px]"
                style={{ animationDelay: "80ms" }}
              >
                Площадка с экзаменационной разметкой, маршруты МВД, новые авто на АКПП. Записываешься сразу в календарь инструктора — без звонков и переписки.
              </p>

              <a
                href="#booking"
                className="hero-rise inline-flex items-center gap-2 bg-orange hover:bg-[#EA670F] text-white px-5 py-3 rounded-lg text-[14px] font-medium transition-all hover:translate-y-[-1px]"
                style={{ animationDelay: "160ms" }}
              >
                Записаться на урок
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </Reveal>
          </div>
        </section>

        <InstructorsPreview />
        <PracticeFeatures />
        <PracticePricing />
        <PracticeBooking />
      </main>
      <Footer />
    </>
  );
}
