import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy-deep text-muted-on-navy pt-14 pb-8 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange/30 to-transparent" aria-hidden />
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <Link href="/" className="text-white text-[18px] font-medium tracking-wide block mb-3">
              Jedi Drive
            </Link>
            <p className="text-[13px] leading-[1.6] max-w-[340px]">
              Автошкола в Тбилиси. Подготовка к экзамену по категории B на русском и грузинском.
            </p>
          </div>

          <div>
            <div className="text-white text-[13px] font-medium mb-3">Навигация</div>
            <ul className="space-y-2 text-[13px]">
              <li><Link href="/services/theory" className="hover:text-white transition-colors">Теория</Link></li>
              <li><Link href="/services/practice" className="hover:text-white transition-colors">Практика</Link></li>
              <li><Link href="/tickets" className="hover:text-white transition-colors">Билеты</Link></li>
              <li><Link href="/instructors" className="hover:text-white transition-colors">Инструкторы</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">О нас</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-white text-[13px] font-medium mb-3">Контакты</div>
            <ul className="space-y-2 text-[13px]">
              <li><a href="tel:+995500000000" className="hover:text-white transition-colors">+995 500 00 00 00</a></li>
              <li><a href="mailto:hello@jedidrive.ge" className="hover:text-white transition-colors">hello@jedidrive.ge</a></li>
              <li>Тбилиси, ул. Руставели 12</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px]">
          <div>© {new Date().getFullYear()} Jedi Drive. Лицензия МВД Грузии.</div>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Условия</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
