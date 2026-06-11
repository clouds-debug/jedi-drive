import type { Metadata } from "next";
import { Suspense } from "react";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { QuizContainer } from "@/components/tickets/QuizContainer";

export const metadata: Metadata = {
  title: "Тест — Jedi Drive",
};

export default function QuizPage() {
  return (
    <>
      <Nav />
      <main className="bg-navy min-h-[calc(100vh-200px)] py-12">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <Suspense fallback={<div className="text-muted-on-navy text-center py-20">Загрузка…</div>}>
            <QuizContainer />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
