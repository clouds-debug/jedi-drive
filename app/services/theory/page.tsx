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
import { EditableText } from "@/components/content/EditableText";
import { readSession } from "@/lib/auth/session";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Запись на теорию — Jedi Drive",
  description:
    "Теория для категории B. 16 онлайн-занятий в группе до 8 человек или индивидуально. Потоки на русском и грузинском.",
};

export const dynamic = "force-dynamic";

export default async function TheoryPage() {
  const session = await readSession();
  const isAuthed = session !== null;
  const { t } = await getT();
  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-12 pb-20 sm:pt-16 sm:pb-24 relative overflow-hidden">
          <div className="absolute top-0 left-[10%] w-[420px] h-[260px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="01">
                <EditableText storageKey="theory.hero.section.label">{t("theory.hero.section.label")}</EditableText>
              </SectionLabel>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[680px]">
                <EditableText storageKey="theory.hero.title.lead">{t("theory.hero.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="theory.hero.title.accent">{t("theory.hero.title.accent")}</EditableText>
                </span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-12 max-w-[540px]"
                style={{ animationDelay: "80ms" }}
              >
                <EditableText storageKey="theory.hero.subtitle" multiline>{t("theory.hero.subtitle")}</EditableText>
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
        <TheoryEnroll isAuthed={isAuthed} />
      </main>
      <Footer />
    </>
  );
}
