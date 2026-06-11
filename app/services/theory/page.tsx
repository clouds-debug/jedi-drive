import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { StreamsCarousel } from "@/components/StreamsCarousel";
import { TheoryProgram } from "@/components/TheoryProgram";
import { TheoryFormat } from "@/components/TheoryFormat";
import { TheoryPricing } from "@/components/TheoryPricing";
import { TheoryEnroll } from "@/components/TheoryEnroll";

export const metadata: Metadata = {
  title: "Запись на теорию — Jedi Drive",
  description:
    "Теория для категории B. 16 онлайн-занятий в группе до 8 человек или индивидуально. Потоки на русском и грузинском.",
};

export default function TheoryPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-12 pb-20 sm:pt-16 sm:pb-24 relative overflow-hidden">
          <div className="absolute top-0 left-[10%] w-[420px] h-[260px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="01">Расписание</SectionLabel>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[680px]">
                Выбери удобный <span className="text-orange">поток</span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-12 max-w-[540px]"
                style={{ animationDelay: "80ms" }}
              >
                Потоки стартуют каждые 4-5 недель. Можно записаться в текущий, если есть места, или забронировать следующий — мы откроем его в первую очередь для тех, кто бронировал заранее.
              </p>
            </Reveal>

            <Reveal delay={120}>
              <StreamsCarousel />
            </Reveal>
          </div>
        </section>

        <TheoryProgram />
        <TheoryFormat />
        <TheoryPricing />
        <TheoryEnroll />
      </main>
      <Footer />
    </>
  );
}
