import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { InstructorsStandards } from "@/components/instructors/InstructorsStandards";
import { InstructorsGrid } from "@/components/instructors/InstructorsGrid";
import { EditableText } from "@/components/content/EditableText";
import {
  instructors as allInstructors,
  type Instructor,
} from "@/lib/instructors/data";
import { getInstructorAggregates } from "@/lib/reviews";
import { getInvisibleInstructorIds } from "@/lib/admin/instructor-overrides";
import { listPublishedInstructors } from "@/lib/admin/instructor-profile";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Инструкторы — Jedi Drive",
  description:
    "9 лицензированных инструкторов в команде Jedi Drive. Опытные, многоязычные, без крика. Кликни по карточке — посмотри отзывы и био.",
};

type AvatarColor = Instructor["avatarColor"];

const ALLOWED_COLORS: AvatarColor[] = [
  "indigo",
  "orange",
  "violet",
  "emerald",
  "rose",
];

function initialsFor(first: string | null, last: string | null): string {
  const a = (first ?? "")[0] ?? "";
  const b = (last ?? "")[0] ?? "";
  return ((a + b).toUpperCase() || "?").slice(0, 2);
}

export default async function InstructorsPage() {
  const [{ t }, aggregatesMap, invisibleIds, dbCards] = await Promise.all([
    getT(),
    getInstructorAggregates(),
    getInvisibleInstructorIds(),
    listPublishedInstructors(),
  ]);

  const staticInstructors = allInstructors.filter((i) => !invisibleIds.has(i.id));

  // Карточки от живых инструкторов (instructor_profiles).
  const liveInstructors: Instructor[] = dbCards.map((c) => {
    const name =
      [c.first_name, c.last_name].filter(Boolean).join(" ") || t("instructors.fallbackName", { id: c.user_id });
    const color: AvatarColor =
      (c.avatar_color as AvatarColor) &&
      ALLOWED_COLORS.includes(c.avatar_color as AvatarColor)
        ? (c.avatar_color as AvatarColor)
        : "orange";
    const langs = c.languages.filter(
      (l): l is "ru" | "ge" | "en" => l === "ru" || l === "ge" || l === "en",
    );
    return {
      id: c.ref,
      name,
      initials: initialsFor(c.first_name, c.last_name),
      avatarColor: color,
      avatarUrl: c.avatar_url,
      rating: 0,
      reviewsCount: 0,
      experienceYears: c.experience_years ?? 0,
      car: c.car ?? "",
      languages: langs,
      bio: c.bio ?? undefined,
    };
  });

  const instructors: Instructor[] = [...liveInstructors, ...staticInstructors];

  const aggregates: Record<string, { rating: number; count: number }> = {};
  for (const [id, a] of aggregatesMap) {
    if (!invisibleIds.has(id)) aggregates[id] = a;
  }

  // Эффективные рейтинги: live из БД где есть, иначе seed-значения.
  const effective = instructors.map((i) => {
    const a = aggregatesMap.get(i.id);
    return {
      ...i,
      rating: a && a.count > 0 ? a.rating : i.rating,
    };
  });

  const total = instructors.length;
  const avgRating =
    total > 0
      ? (effective.reduce((s, i) => s + i.rating, 0) / total).toFixed(1)
      : "—";
  const avgExp =
    total > 0
      ? Math.round(instructors.reduce((s, i) => s + i.experienceYears, 0) / total)
      : 0;
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
                <EditableText storageKey="instructors.hero.kicker.prefix">{t("instructors.hero.kicker.prefix")}</EditableText> · {t("instructors.hero.kicker.suffix", { n: total })}
              </p>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[680px]">
                <EditableText storageKey="instructors.hero.title.lead">{t("instructors.hero.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="instructors.hero.title.accent">{t("instructors.hero.title.accent")}</EditableText>
                </span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-8 max-w-[560px]"
                style={{ animationDelay: "80ms" }}
              >
                <EditableText storageKey="instructors.hero.subtitle" multiline>{t("instructors.hero.subtitle", { n: total })}</EditableText>
              </p>

              <div
                className="hero-rise flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-muted-on-navy bg-white/[0.04] border border-white/10 px-5 py-3 rounded-lg max-w-fit"
                style={{ animationDelay: "160ms" }}
              >
                <span className="flex items-center gap-2">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#F97316" aria-hidden>
                    <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
                  </svg>
                  <span className="text-white">{avgRating}</span> {t("instructors.hero.stat.rating")}
                </span>
                <span className="w-px h-3.5 bg-white/15" />
                <span><span className="text-white">{t("instructors.hero.stat.years", { n: avgExp })}</span> {t("instructors.hero.stat.exp")}</span>
                <span className="w-px h-3.5 bg-white/15" />
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase">
                  {allLangs.join(" · ")}
                </span>
              </div>
            </Reveal>
          </div>
        </section>

        <InstructorsStandards />
        <InstructorsGrid
          aggregates={aggregates}
          hiddenIds={Array.from(invisibleIds)}
          source={instructors}
        />
      </main>
      <Footer />
    </>
  );
}
