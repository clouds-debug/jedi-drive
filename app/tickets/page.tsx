import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { TicketsModes } from "@/components/tickets/TicketsModes";
import { TicketsTopics } from "@/components/tickets/TicketsTopics";
import { EditableText } from "@/components/content/EditableText";
import { questions } from "@/lib/tickets/data";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Билеты — Jedi Drive",
  description:
    "Тренируйся на экзаменационных билетах категории B. Случайный экзамен, тренировка по темам — всё бесплатно и без регистрации.",
};

export const dynamic = "force-dynamic";

export default async function TicketsPage() {
  const { t } = await getT();
  const total = questions.length;
  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
          <div className="absolute top-0 left-[15%] w-[480px] h-[280px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="00">
                <EditableText storageKey="tickets.hero.label">{t("tickets.hero.label")}</EditableText>
              </SectionLabel>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[680px]">
                <EditableText storageKey="tickets.hero.title.lead">{t("tickets.hero.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="tickets.hero.title.accent">{t("tickets.hero.title.accent")}</EditableText>
                </span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-8 max-w-[540px]"
                style={{ animationDelay: "80ms" }}
              >
                <EditableText storageKey="tickets.hero.subtitle" multiline>{t("tickets.hero.subtitle")}</EditableText>
              </p>

              <div
                className="hero-rise inline-flex items-center gap-6 text-[12px] text-muted-on-navy bg-white/[0.04] border border-white/10 px-4 py-2.5 rounded-lg"
                style={{ animationDelay: "160ms" }}
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange" />
                  {t("tickets.hero.chip.count", { n: total })}
                </span>
                <span className="w-px h-3.5 bg-white/15" />
                <span>
                  <EditableText storageKey="tickets.hero.chip.noreg">{t("tickets.hero.chip.noreg")}</EditableText>
                </span>
                <span className="w-px h-3.5 bg-white/15" />
                <span>
                  <EditableText storageKey="tickets.hero.chip.free">{t("tickets.hero.chip.free")}</EditableText>
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <TicketsModes />
        <TicketsTopics />
      </main>
      <Footer />
    </>
  );
}
