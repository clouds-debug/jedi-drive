import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { EditableText } from "@/components/content/EditableText";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Jedi Drive",
  description:
    "Как Jedi Drive собирает, использует и защищает персональные данные пользователей сайта и учеников автошколы.",
};

export const dynamic = "force-dynamic";

const SECTIONS = ["1", "2", "3", "4", "5", "6", "7", "8"];

export default async function PrivacyPage() {
  const { t } = await getT();
  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-12 pb-20 sm:pt-16 sm:pb-24 relative overflow-hidden">
          <div className="absolute top-0 left-[10%] w-[440px] h-[260px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-3xl px-6 lg:px-10 relative">
            <p className="text-[12px] text-orange-soft tracking-[0.1em] uppercase mb-4">
              <EditableText storageKey="privacy.kicker">{t("legal.kicker")}</EditableText>
            </p>
            <h1 className="text-[32px] sm:text-[40px] font-medium text-white tracking-[-0.02em] leading-[1.1] mb-3">
              <EditableText storageKey="privacy.title">{t("privacy.title")}</EditableText>
            </h1>
            <p className="text-[13px] text-muted-on-navy mb-10">
              <EditableText storageKey="privacy.updated">{t("legal.updated")}</EditableText>
            </p>

            {SECTIONS.map((n) => (
              <Section
                key={n}
                num={n}
                numKey={`privacy.${n}.num`}
                titleKey={`privacy.${n}.title`}
                title={t(`privacy.${n}.title`)}
              >
                <EditableText storageKey={`privacy.${n}.body`} multiline>
                  {t(`privacy.${n}.body`)}
                </EditableText>
              </Section>
            ))}

            <div className="mt-12 pt-6 border-t border-white/[0.06] text-[12.5px] text-muted-on-navy">
              <EditableText storageKey="privacy.footer" multiline>{t("privacy.footer")}</EditableText>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({
  num,
  numKey,
  title,
  titleKey,
  children,
}: {
  num: string;
  numKey: string;
  title: string;
  titleKey: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8">
      <h2 className="text-[18px] sm:text-[20px] font-medium text-white tracking-[-0.005em] mb-3 flex items-baseline gap-3">
        <span className="text-orange-soft text-[12px] font-mono tracking-[0.16em] uppercase">
          <EditableText storageKey={numKey}>{num}</EditableText>
        </span>
        <EditableText storageKey={titleKey}>{title}</EditableText>
      </h2>
      <div className="text-[14px] text-muted-on-navy leading-[1.7]">{children}</div>
    </section>
  );
}
