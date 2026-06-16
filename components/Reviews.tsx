"use client";

import { useRef } from "react";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { EditableText } from "./content/EditableText";
import { useT } from "@/lib/i18n/client";

const reviews = [
  { key: "neko", text: "Лучший результат за кратчайшие сроки! Благодаря профессиональному мастерству и дружелюбному подходу наставника, сдала на права с 1 раза! 😁 Безоговорочно советую, на своем опыте обещаю не пожалеете 🔥", name: "Neko", initials: "NE" },
  { key: "nino", text: "Очень приятная автошкола с дружелюбной атмосферой. Занятия проходят весело, на позитиве и при этом максимально эффективно. Инструктор поддерживает и всё объясняет спокойно и понятно. Учиться было комфортно, однозначно рекомендую 💞", name: "Nino Cholaria", initials: "NC" },
  { key: "vakho", text: "Очень интересно проходит обучение, великолепный учитель, всем советую 💥", name: "Вахо Чеминава", initials: "ВЧ" },
  { key: "ami", text: "Лучшее ❤️ всем советую 👍🏻", name: "Ами Ами", initials: "АА" },
  { key: "vano", text: "შესანიშნავი ავტოსკოლაა! სწავლამ ძალიან მარტივად და კომფორტულად ჩაიარა, ყველაფერს გასაგებად ხსნიან, ზედმეტი ზეწოლის გარეშე. ინსტრუქტორი უბრალოდ საუკეთესოა — მხარს მიჭერდა, შეცდომების გამოსწორებაში მეხმარებოდა და თავდაჯერებულობას მმატებდა. დიდი მადლობა ასეთი კარგი გამოცდილებისთვის! მისი დახმარებით ახლა საჭესთან თავს ძალიან თავდაჯერებულად ვგრძნობ. ყველას გირჩევთ!", name: "Vano Darsania", initials: "VD" },
  { key: "tea", text: "საუკეთესო გარემო იმისთვის რომ მალე აიღოთ მართვის მოწმობა. მიენდეთ ამ გამოცდილ გუნდს", name: "Tea Tsulaia", initials: "TT" },
  { key: "mariam-ts", text: "რეკომენდაცია დიმიტრი მასწავლებელს ავტომატიკაზე, ძალიან კარგად ხსნის 🙏🏻", name: "Mariam Tsitulauri", initials: "MT" },
  { key: "jano", text: "ძაან კომფორტული სივრცე და საუკეთესო ავტოსკოლა 💯", name: "Jano Tsikolia", initials: "JT" },
  { key: "dato", text: "ჯიგრული გუნდი! რეკომენდაციაა ჩემგან!", name: "Dato Matua", initials: "DM" },
  { key: "natalia", text: "ძალიან მიხარია, რომ ეს სკოლა ავირჩიე. მომწონს, რომ პროფესიონალი გუნდია. ყველაფერს დეტალურად ხსნიან", name: "Natalia Patsuria", initials: "NP" },
  { key: "tiko", text: "საუკეთესოები ☺️🚗", name: "Tiko Isashvili", initials: "TI" },
  { key: "mari", text: "საუკეთესოები 🤍🤍🤍✨✨", name: "Mari Kvachaxia", initials: "MK" },
];

function Star() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l3 7 7 .8-5.3 5 1.6 7L12 18.3 5.7 22l1.6-7L2 9.8l7-.8z" />
    </svg>
  );
}

function ArrowButton({ dir, onClick, label }: { dir: "left" | "right"; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/15 text-white grid place-items-center transition-all hover:bg-white/[0.08] hover:border-white/30 hover:text-orange-soft active:scale-95"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
      </svg>
    </button>
  );
}

export function Reviews() {
  const { t } = useT();
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("article");
    const step = card ? card.offsetWidth + 16 : 360;
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }

  return (
    <section className="bg-navy py-20 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="absolute right-[10%] bottom-0 w-[420px] h-[320px] bg-orange/[0.06] rounded-full blur-[130px] pointer-events-none" aria-hidden />

      <div className="mx-auto max-w-7xl px-6 lg:px-10 relative">
        <div className="flex items-end justify-between gap-6 mb-10">
          <Reveal className="flex-1">
            <SectionLabel num="03">
              <EditableText storageKey="home.reviews.section.label">{t("home.reviews.section.label")}</EditableText>
            </SectionLabel>
            <h2 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] max-w-[540px]">
              <EditableText storageKey="home.reviews.section.title.lead">{t("home.reviews.section.title.lead")}</EditableText>{" "}
              <span className="text-orange">
                <EditableText storageKey="home.reviews.section.title.accent">{t("home.reviews.section.title.accent")}</EditableText>
              </span>
            </h2>
          </Reveal>

          <Reveal delay={80} className="hidden sm:flex gap-2 shrink-0 pb-1">
            <ArrowButton dir="left" onClick={() => scroll("left")} label={t("home.reviews.prev")} />
            <ArrowButton dir="right" onClick={() => scroll("right")} label={t("home.reviews.next")} />
          </Reveal>
        </div>

        <Reveal delay={120}>
          <div
            ref={scrollRef}
            className="overflow-x-auto scroll-smooth snap-x snap-mandatory -mx-6 px-6 lg:-mx-10 lg:px-10 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="flex gap-4">
              {reviews.map((r) => (
                <article
                  key={r.key}
                  className="snap-start shrink-0 w-[300px] sm:w-[340px] lg:w-[calc((100%-32px)/3)] bg-white/[0.03] border border-white/10 rounded-[var(--radius-card)] p-6 transition-all duration-300 hover:bg-white/[0.05] hover:border-white/20"
                >
                  <div className="flex gap-0.5 text-orange mb-4">
                    <Star /><Star /><Star /><Star /><Star />
                  </div>
                  <p className="text-[14px] text-white leading-[1.65] mb-5 min-h-[110px]">«{r.text}»</p>
                  <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                    <span className="w-9 h-9 rounded-full grid place-items-center font-medium text-[13px] bg-orange/15 text-orange-soft">
                      {r.initials}
                    </span>
                    <div>
                      <div className="text-[13px] font-medium text-white">{r.name}</div>
                      <div className="text-[11.5px] text-muted-on-navy">{t("home.reviews.from")}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </Reveal>

        <div className="sm:hidden flex gap-2 mt-6 justify-center">
          <ArrowButton dir="left" onClick={() => scroll("left")} label={t("home.reviews.prev")} />
          <ArrowButton dir="right" onClick={() => scroll("right")} label={t("home.reviews.next")} />
        </div>
      </div>
    </section>
  );
}
