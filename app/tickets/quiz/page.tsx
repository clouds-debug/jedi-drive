import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { QuizContainer } from "@/components/tickets/QuizContainer";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = {
  title: "Тест — Jedi Drive",
};

export const dynamic = "force-dynamic";

export default async function QuizPage() {
  const { t } = await getT();
  return (
    <>
      <Nav />
      <main className="bg-navy min-h-[calc(100vh-200px)] py-12">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Suspense fallback={<div className="text-muted-on-navy text-center py-20">{t("tickets.quiz.loading")}</div>}>
            <QuizContainer />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
