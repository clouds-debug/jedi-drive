import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CabinetTabs } from "@/components/cabinet/CabinetTabs";
import { LogoutButton } from "@/components/cabinet/LogoutButton";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { homePathForRole } from "@/lib/auth/roles";
import { countUnread } from "@/lib/notifications";
import { getT } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function CabinetAuthedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await readSession();
  if (!session) redirect("/cabinet/logout-stale");

  const user = await findUserById(session.userId);
  if (!user || user.is_blocked) redirect("/cabinet/logout-stale");

  const [unread, { t }] = await Promise.all([
    countUnread(session.userId),
    getT(),
  ]);

  const displayName =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || user.login;

  return (
    <>
      <Nav />
      <main>
        <section className="bg-navy pt-10 pb-16 sm:pt-12 sm:pb-20 relative overflow-hidden min-h-[60vh]">
          <div className="absolute top-0 left-[10%] w-[440px] h-[260px] bg-orange/[0.07] rounded-full blur-[120px] pointer-events-none" aria-hidden />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 relative">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-mono text-[11px] text-orange tracking-[0.1em]">01</span>
                  <span className="h-px w-12 bg-gradient-to-r from-orange/55 to-transparent" />
                  <span className="text-[12px] text-muted-on-navy tracking-[0.04em]">
                    {t("cab.layout.label")}
                  </span>
                </div>
                <h1 className="text-[28px] sm:text-[34px] font-medium text-white tracking-[-0.015em] leading-[1.1]">
                  {t("cab.layout.greeting")}, <span className="text-orange">{displayName}</span>
                </h1>
              </div>
              <div className="flex items-center gap-2">
                {user.role !== "student" && (
                  <Link
                    href={homePathForRole(user.role)}
                    className="inline-flex items-center gap-1.5 bg-orange/15 border border-orange/40 hover:bg-orange/25 hover:border-orange/60 text-white px-3 py-1.5 rounded-lg text-[12.5px] transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                      <rect x="3" y="3" width="7" height="9" rx="1" />
                      <rect x="14" y="3" width="7" height="5" rx="1" />
                      <rect x="14" y="12" width="7" height="9" rx="1" />
                      <rect x="3" y="16" width="7" height="5" rx="1" />
                    </svg>
                    {t("cab.layout.toAdmin")}
                  </Link>
                )}
                <LogoutButton />
              </div>
            </div>

            <CabinetTabs unread={unread} />

            <div className="mt-8">{children}</div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
