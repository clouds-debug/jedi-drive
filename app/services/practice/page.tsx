import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { PracticeFeatures } from "@/components/practice/PracticeFeatures";
import { PracticePricing } from "@/components/practice/PracticePricing";
import { InstructorsPreview } from "@/components/practice/InstructorsPreview";
import { PracticeBooking } from "@/components/practice/PracticeBooking";
import { EditableText } from "@/components/content/EditableText";
import { readSession } from "@/lib/auth/session";
import { getInvisibleInstructorIds } from "@/lib/admin/instructor-overrides";
import { listPublishedInstructors } from "@/lib/admin/instructor-profile";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Запись на практику — Jedi Drive",
  description:
    "Практика вождения категории B в Тбилиси. Новые авто 2022+, своя площадка, опытные инструкторы. Запись в календарь инструктора онлайн.",
};

export const dynamic = "force-dynamic";

export default async function PracticePage() {
  const session = await readSession();
  const isAuthed = session !== null;
  const { t } = await getT();
  const [hiddenIdsSet, publishedCards] = await Promise.all([
    getInvisibleInstructorIds(),
    listPublishedInstructors(),
  ]);
  const hiddenIds = Array.from(hiddenIdsSet);
  const livePublishedInstructors = publishedCards.map((c) => ({
    id: c.ref,
    name:
      [c.first_name, c.last_name].filter(Boolean).join(" ") ||
      `Инструктор #${c.user_id}`,
    initials:
      ((c.first_name?.[0] ?? "") + (c.last_name?.[0] ?? "")).toUpperCase() ||
      "?",
    avatarColor: (c.avatar_color ?? "orange") as
      | "indigo"
      | "orange"
      | "violet"
      | "emerald"
      | "rose",
    avatarUrl: c.avatar_url,
    rating: 0,
    reviewsCount: 0,
    experienceYears: c.experience_years ?? 0,
    car: c.car ?? "",
    languages: c.languages.filter(
      (l): l is "ru" | "ge" | "en" => l === "ru" || l === "ge" || l === "en",
    ),
  }));
  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-12 pb-16 sm:pt-16 sm:pb-20 relative overflow-hidden">
          <div className="absolute top-0 left-[10%] w-[440px] h-[260px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <p className="hero-rise text-[12px] text-orange-soft tracking-[0.1em] uppercase mb-4">
                <EditableText storageKey="practice.hero.kicker">{t("practice.hero.kicker")}</EditableText>
              </p>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[680px]">
                <EditableText storageKey="practice.hero.title.lead">{t("practice.hero.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="practice.hero.title.accent">{t("practice.hero.title.accent")}</EditableText>
                </span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-8 max-w-[540px]"
                style={{ animationDelay: "80ms" }}
              >
                <EditableText storageKey="practice.hero.subtitle" multiline>{t("practice.hero.subtitle")}</EditableText>
              </p>

              <a
                href="#booking"
                className="hero-rise inline-flex items-center gap-2 bg-orange hover:bg-[#EA670F] text-white px-5 py-3 rounded-lg text-[14px] font-medium transition-all hover:translate-y-[-1px]"
                style={{ animationDelay: "160ms" }}
              >
                <EditableText storageKey="practice.hero.cta">{t("practice.hero.cta")}</EditableText>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </a>
            </Reveal>
          </div>
        </section>

        <InstructorsPreview
          hiddenIds={hiddenIds}
          extraInstructors={livePublishedInstructors}
        />
        <PracticeFeatures />
        <PracticePricing />
        <PracticeBooking
          isAuthed={isAuthed}
          hiddenInstructorIds={hiddenIds}
          extraInstructors={livePublishedInstructors}
        />
      </main>
      <Footer />
    </>
  );
}
