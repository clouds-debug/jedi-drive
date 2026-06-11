import Link from "next/link";

export function Nav() {
  return (
    <header className="bg-navy text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-5 flex items-center justify-between gap-6">
        <Link href="/" className="text-[18px] font-medium tracking-wide">
          Jedi Drive
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-[13px] text-muted-on-navy">
          <Link href="/" className="text-white hover:text-orange-soft transition-colors">
            Главная
          </Link>

          <div className="relative group">
            <button className="text-muted-on-navy hover:text-white flex items-center gap-1 transition-colors">
              Услуги
              <svg width="10" height="10" viewBox="0 0 12 12" className="opacity-70 transition-transform group-hover:rotate-180" aria-hidden>
                <path d="M2 4 L6 8 L10 4" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
            <div className="absolute left-[-12px] top-[calc(100%+14px)] min-w-[230px] bg-white text-ink rounded-xl p-2 shadow-[0_10px_28px_rgba(10,12,30,0.35)] opacity-0 invisible group-hover:opacity-100 group-hover:visible group-focus-within:opacity-100 group-focus-within:visible transition-all z-50">
              <Link
                href="/services/theory"
                className="flex items-center gap-3 p-2.5 rounded-lg bg-indigo-bg hover:bg-indigo-bg/80"
              >
                <span className="w-8 h-8 bg-navy rounded-lg grid place-items-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F97316" strokeWidth="1.6">
                    <path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3V4z" />
                    <path d="M4 17a3 3 0 0 1 3-3h12" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[13px] font-medium text-navy">Запись на теорию</span>
                  <span className="block text-[11px] text-ink-mute">Группы и индивидуально</span>
                </span>
              </Link>
              <Link
                href="/services/practice"
                className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-indigo-bg"
              >
                <span className="w-8 h-8 bg-indigo-bg rounded-lg grid place-items-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#141A3D" strokeWidth="1.6">
                    <circle cx="12" cy="12" r="8" />
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
                  </svg>
                </span>
                <span>
                  <span className="block text-[13px] font-medium text-navy">Запись на практику</span>
                  <span className="block text-[11px] text-ink-mute">Город и автодром</span>
                </span>
              </Link>
            </div>
          </div>

          <Link href="/tickets" className="hover:text-white transition-colors">Билеты</Link>
          <Link href="/instructors" className="hover:text-white transition-colors">Инструкторы</Link>
          <Link href="/about" className="hover:text-white transition-colors">О нас</Link>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-0.5 bg-white/[0.07] p-[3px] rounded-lg">
            <span className="bg-white text-navy px-2.5 py-1 rounded-md text-[12px] font-medium">ru</span>
            <span className="text-muted-on-navy px-2.5 py-1 text-[12px]">ge</span>
          </div>
          <Link
            href="/cabinet"
            className="flex items-center gap-1.5 border border-white/30 px-3 py-1.5 rounded-lg text-[12.5px]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
            Кабинет
          </Link>
        </div>
      </div>
    </header>
  );
}
