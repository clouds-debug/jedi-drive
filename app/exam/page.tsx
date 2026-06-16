import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { SectionLabel } from "@/components/SectionLabel";
import { EditableText } from "@/components/content/EditableText";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Экзамен на права в Грузии — Jedi Drive",
  description:
    "Как получить водительские права в Грузии: теория, площадка, город. Цены, документы, центры сдачи.",
};

export const dynamic = "force-dynamic";

type Step = { k: string; icon: React.ReactNode };

const steps: Step[] = [
  {
    k: "theory",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
        <path d="M4 17a3 3 0 0 1 3-3h12" />
      </svg>
    ),
  },
  {
    k: "pad",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <rect x="3" y="6" width="18" height="13" rx="1.5" />
        <path d="M3 11h18M7 6V4M17 6V4" />
      </svg>
    ),
  },
  {
    k: "city",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M3 21h18M5 21V8l7-5 7 5v13M9 9h2M13 9h2M9 13h2M13 13h2M9 17h2M13 17h2" />
      </svg>
    ),
  },
];

const docs = [{ k: "med" }, { k: "passport" }];

const priceList = [
  { k: "p1" },
  { k: "p2" },
  { k: "p3" },
  { k: "p4" },
  { k: "p5" },
  { k: "p6" },
  { k: "p7" },
];

export default async function ExamPage() {
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
                <EditableText storageKey="exam.hero.kicker">{t("exam.hero.kicker")}</EditableText>
              </p>
              <h1 className="hero-rise text-[32px] sm:text-[44px] lg:text-[52px] font-medium text-white tracking-[-0.02em] leading-[1.05] mb-4 max-w-[720px]">
                <EditableText storageKey="exam.hero.title.lead">{t("exam.hero.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="exam.hero.title.accent">{t("exam.hero.title.accent")}</EditableText>
                </span>
              </h1>
              <p
                className="hero-rise text-[14.5px] sm:text-[15.5px] text-muted-on-navy leading-[1.65] mb-8 max-w-[560px]"
                style={{ animationDelay: "80ms" }}
              >
                <EditableText storageKey="exam.hero.subtitle" multiline>{t("exam.hero.subtitle")}</EditableText>
              </p>
            </Reveal>
          </div>
        </section>

        <section className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="01">
                <EditableText storageKey="exam.steps.section.label">{t("exam.steps.section.label")}</EditableText>
              </SectionLabel>
              <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[600px]">
                <EditableText storageKey="exam.steps.title.lead">{t("exam.steps.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="exam.steps.title.accent">{t("exam.steps.title.accent")}</EditableText>
                </span>
              </h2>
              <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
                <EditableText storageKey="exam.steps.subtitle" multiline>{t("exam.steps.subtitle")}</EditableText>
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {steps.map((s, i) => {
                const base = `exam.steps.${s.k}`;
                return (
                  <Reveal key={s.k} delay={i * 80}>
                    <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1">
                      <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                      <div className="relative flex items-start justify-between mb-5">
                        <span className="w-12 h-12 rounded-[10px] bg-orange/15 grid place-items-center text-orange-soft shrink-0">
                          {s.icon}
                        </span>
                        <span className="text-[28px] font-mono text-orange/40 leading-none tracking-tight">
                          <EditableText storageKey={`${base}.num`}>{t(`${base}.num`)}</EditableText>
                        </span>
                      </div>

                      <div className="relative">
                        <div className="text-[11px] text-muted-on-navy tracking-[0.14em] uppercase mb-1.5">
                          <EditableText storageKey={`${base}.badge`}>{t(`${base}.badge`)}</EditableText>
                        </div>
                        <div className="text-[17px] font-medium text-white mb-2 leading-snug">
                          <EditableText storageKey={`${base}.title`}>{t(`${base}.title`)}</EditableText>
                        </div>
                        <p className="text-[13px] text-muted-on-navy leading-[1.6]">
                          <EditableText storageKey={`${base}.desc`} multiline>{t(`${base}.desc`)}</EditableText>
                        </p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
          <div className="absolute top-0 left-[15%] w-[480px] h-[280px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="02">
                <EditableText storageKey="exam.theory.section.label">{t("exam.theory.section.label")}</EditableText>
              </SectionLabel>
              <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
                <EditableText storageKey="exam.theory.title.lead">{t("exam.theory.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="exam.theory.title.accent">{t("exam.theory.title.accent")}</EditableText>
                </span>
              </h2>
              <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
                <EditableText storageKey="exam.theory.subtitle" multiline>{t("exam.theory.subtitle")}</EditableText>
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              <Reveal delay={80}><DetailCard base="exam.theory.reg" /></Reveal>
              <Reveal delay={160}><DetailCard base="exam.theory.format" /></Reveal>
              <Reveal delay={240}><DetailCard base="exam.theory.price" highlight /></Reveal>
            </div>
          </div>
        </section>

        <section className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="03">
                <EditableText storageKey="exam.pad.section.label">{t("exam.pad.section.label")}</EditableText>
              </SectionLabel>
              <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
                <EditableText storageKey="exam.pad.title.lead">{t("exam.pad.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="exam.pad.title.accent">{t("exam.pad.title.accent")}</EditableText>
                </span>
              </h2>
              <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-10 max-w-[520px]">
                <EditableText storageKey="exam.pad.subtitle" multiline>{t("exam.pad.subtitle")}</EditableText>
              </p>
            </Reveal>

            <Reveal delay={60}>
              <figure className="relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden mb-6">
                <img
                  src="/pad-area.jpg"
                  alt={t("exam.pad.image.alt")}
                  className="block w-full h-auto"
                />
                <div className="absolute inset-x-0 bottom-0 px-4 py-2.5 bg-gradient-to-t from-navy/85 via-navy/55 to-transparent">
                  <span className="text-[11.5px] text-muted-on-navy tracking-[0.04em]">
                    <EditableText storageKey="exam.pad.image.caption">{t("exam.pad.image.caption")}</EditableText>
                  </span>
                </div>
              </figure>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Reveal delay={80}><DetailCard base="exam.pad.deadline" /></Reveal>
              <Reveal delay={160}><DetailCard base="exam.pad.elem" /></Reveal>
              <Reveal delay={240}><DetailCard base="exam.pad.retry" highlight /></Reveal>
            </div>
          </div>
        </section>

        <section className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
          <div className="absolute -right-32 top-1/4 w-[460px] h-[460px] bg-orange/[0.05] rounded-full blur-[140px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="04">
                <EditableText storageKey="exam.city.section.label">{t("exam.city.section.label")}</EditableText>
              </SectionLabel>
              <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
                <EditableText storageKey="exam.city.title.lead">{t("exam.city.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="exam.city.title.accent">{t("exam.city.title.accent")}</EditableText>
                </span>
              </h2>
              <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
                <EditableText storageKey="exam.city.subtitle" multiline>{t("exam.city.subtitle")}</EditableText>
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Reveal delay={80}><DetailCard base="exam.city.format" /></Reveal>
              <Reveal delay={160}><DetailCard base="exam.city.std" highlight /></Reveal>
              <Reveal delay={240}><DetailCard base="exam.city.fast" /></Reveal>
            </div>
          </div>
        </section>

        <section className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="05">
                <EditableText storageKey="exam.docs.section.label">{t("exam.docs.section.label")}</EditableText>
              </SectionLabel>
              <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
                <EditableText storageKey="exam.docs.title.lead">{t("exam.docs.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="exam.docs.title.accent">{t("exam.docs.title.accent")}</EditableText>
                </span>
              </h2>
              <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-12 max-w-[520px]">
                <EditableText storageKey="exam.docs.subtitle" multiline>{t("exam.docs.subtitle")}</EditableText>
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[900px]">
              {docs.map((d, i) => {
                const base = `exam.docs.${d.k}`;
                return (
                  <Reveal key={d.k} delay={i * 100}>
                    <div className="relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden">
                      <div className="absolute -right-12 -top-12 w-44 h-44 bg-orange/[0.10] rounded-full blur-[60px] pointer-events-none" aria-hidden />

                      <div className="relative flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="text-[17px] font-medium text-white mb-2 leading-snug">
                            <EditableText storageKey={`${base}.title`}>{t(`${base}.title`)}</EditableText>
                          </div>
                          <p className="text-[13px] text-muted-on-navy leading-[1.6]">
                            <EditableText storageKey={`${base}.desc`} multiline>{t(`${base}.desc`)}</EditableText>
                          </p>
                        </div>
                        <span className="text-[24px] font-medium text-white tabular-nums shrink-0 leading-none">
                          <EditableText storageKey={`${base}.price`}>{t(`${base}.price`)}</EditableText>
                        </span>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-navy py-20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
          <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[700px] h-[300px] bg-orange/[0.06] rounded-full blur-[130px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
            <Reveal>
              <SectionLabel num="06">
                <EditableText storageKey="exam.prices.section.label">{t("exam.prices.section.label")}</EditableText>
              </SectionLabel>
              <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] mb-3 max-w-[540px]">
                <EditableText storageKey="exam.prices.title.lead">{t("exam.prices.title.lead")}</EditableText>{" "}
                <span className="text-orange">
                  <EditableText storageKey="exam.prices.title.accent">{t("exam.prices.title.accent")}</EditableText>
                </span>
              </h2>
              <p className="text-[14px] text-muted-on-navy leading-[1.65] mb-10 max-w-[520px]">
                <EditableText storageKey="exam.prices.subtitle" multiline>{t("exam.prices.subtitle")}</EditableText>
              </p>
            </Reveal>

            <Reveal delay={120}>
              <div className="relative bg-white/[0.03] border border-white/10 rounded-2xl overflow-hidden max-w-[760px]">
                <div className="absolute -right-16 -top-16 w-72 h-72 bg-orange/[0.12] rounded-full blur-[80px] pointer-events-none" aria-hidden />
                <ul className="relative divide-y divide-white/[0.06]">
                  {priceList.map((p) => {
                    const base = `exam.prices.${p.k}`;
                    return (
                      <li key={p.k} className="flex items-center justify-between gap-4 px-6 py-4">
                        <span className="text-[14px] text-white">
                          <EditableText storageKey={`${base}.label`}>{t(`${base}.label`)}</EditableText>
                        </span>
                        <span className="text-[15px] text-orange-soft font-medium tabular-nums shrink-0">
                          <EditableText storageKey={`${base}.value`}>{t(`${base}.value`)}</EditableText>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={240}>
              <p className="text-[12.5px] text-muted-on-navy/80 mt-6 max-w-[640px] leading-[1.65]">
                <EditableText storageKey="exam.prices.footer.note" multiline>{t("exam.prices.footer.note")}</EditableText>
              </p>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

async function DetailCard({
  base,
  highlight = false,
}: {
  base: string;
  highlight?: boolean;
}) {
  const { t } = await getT();
  const cls = highlight
    ? "relative bg-white/[0.05] border border-orange/40 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.07] hover:-translate-y-1"
    : "relative bg-white/[0.03] border border-white/10 border-l-[3px] border-l-orange rounded-[var(--radius-card)] p-6 h-full overflow-hidden transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-1";
  return (
    <div className={cls}>
      <div
        className={`absolute -right-12 -top-12 w-44 h-44 rounded-full blur-[60px] pointer-events-none ${
          highlight ? "bg-orange/[0.18]" : "bg-orange/[0.10]"
        }`}
        aria-hidden
      />
      <div className="relative">
        <div className="text-[11px] text-orange-soft tracking-[0.14em] uppercase mb-2">
          <EditableText storageKey={`${base}.badge`}>{t(`${base}.badge`)}</EditableText>
        </div>
        <div className={`font-medium text-white mb-2 leading-snug ${highlight ? "text-[26px]" : "text-[18px]"}`}>
          <EditableText storageKey={`${base}.title`}>{t(`${base}.title`)}</EditableText>
        </div>
        <p className="text-[13px] text-muted-on-navy leading-[1.6]">
          <EditableText storageKey={`${base}.desc`} multiline>{t(`${base}.desc`)}</EditableText>
        </p>
      </div>
    </div>
  );
}
