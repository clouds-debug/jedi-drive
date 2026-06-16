import Link from "next/link";

type Props = {
  page: number;
  totalPages: number;
  baseHref: string; // например: "/admin/bookings?status=pending"
  pageParam?: string; // имя query-параметра. По умолчанию "page".
};

function withPage(baseHref: string, page: number, param: string): string {
  const sep = baseHref.includes("?") ? "&" : "?";
  const cleaned = baseHref.replace(new RegExp(`([?&])${param}=\\d+&?`), "$1").replace(/[?&]$/, "");
  return `${cleaned}${sep}${param}=${page}`;
}

export function Pagination({ page, totalPages, baseHref, pageParam = "page" }: Props) {
  const prev = Math.max(1, page - 1);
  const next = Math.min(totalPages, page + 1);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="mt-6 flex items-center justify-between gap-3 flex-wrap">
      <div className="text-[11.5px] text-muted-on-navy font-mono tabular-nums">
        Стр. {page} из {totalPages}
      </div>
      <div className="flex items-center gap-2">
        <ArrowLink
          href={withPage(baseHref, prev, pageParam)}
          dir="left"
          disabled={!canPrev}
        />
        <ArrowLink
          href={withPage(baseHref, next, pageParam)}
          dir="right"
          disabled={!canNext}
        />
      </div>
    </div>
  );
}

function ArrowLink({ href, dir, disabled }: { href: string; dir: "left" | "right"; disabled: boolean }) {
  const cls =
    "w-9 h-9 rounded-lg bg-white/[0.04] border border-white/15 text-white grid place-items-center transition-all";
  if (disabled) {
    return (
      <span aria-disabled className={`${cls} opacity-25 cursor-not-allowed`}>
        <Arrow dir={dir} />
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={dir === "left" ? "Предыдущая страница" : "Следующая страница"}
      className={`${cls} hover:bg-white/[0.08] hover:border-white/30 hover:text-orange-soft active:scale-95`}
    >
      <Arrow dir={dir} />
    </Link>
  );
}

function Arrow({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {dir === "left" ? <path d="M15 6l-6 6 6 6" /> : <path d="M9 6l6 6-6 6" />}
    </svg>
  );
}
