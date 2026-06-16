import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { FounderCard } from "@/components/about/FounderCard";
import { AboutStats } from "@/components/about/AboutStats";
import { AboutLocation } from "@/components/about/AboutLocation";
import { AboutSocials } from "@/components/about/AboutSocials";
import { EditableText } from "@/components/content/EditableText";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "О школе — Jedi Drive",
  description:
    "Jedi Drive — автошкола в Тбилиси, основанная Анри в 2023 году. Команда из 9 инструкторов, 92% сдачи с первого раза.",
};

export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const { t } = await getT();
  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
          <div className="absolute top-0 left-[10%] w-[440px] h-[260px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <p className="hero-rise text-[12px] text-orange-soft tracking-[0.1em] uppercase mb-4">
                <EditableText storageKey="about.hero.kicker">{t("about.hero.kicker")}</EditableText>
              </p>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[680px]">
                <EditableText storageKey="about.hero.title.lead">{t("about.hero.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="about.hero.title.accent">{t("about.hero.title.accent")}</EditableText>
                </span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-2 max-w-[560px]"
                style={{ animationDelay: "80ms" }}
              >
                <EditableText storageKey="about.hero.subtitle" multiline>{t("about.hero.subtitle")}</EditableText>
              </p>
            </Reveal>
          </div>
        </section>

        <FounderCard />
        <AboutStats />
        <AboutLocation />
        <AboutSocials />
      </main>
      <Footer />
    </>
  );
}
