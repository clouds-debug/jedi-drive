import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { requireAdminRole } from "@/lib/auth/require";
import { homePathForRole } from "@/lib/auth/roles";
import { getTrustThresholdPractice } from "@/lib/admin/settings";
import { listTgModerators } from "@/lib/admin/moderators";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ModeratorsForm } from "@/components/admin/ModeratorsForm";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("admin.settings.metaTitle") };
}
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const me = await requireAdminRole(["admin", "moderator", "instructor"]);
  if (me.role !== "admin") redirect(homePathForRole(me.role));

  const { t } = await getT();
  const [practice, moderators] = await Promise.all([
    getTrustThresholdPractice(),
    listTgModerators(),
  ]);

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-[820px]">
      <div className="mb-2 text-[11px] font-mono text-orange tracking-[0.1em]">
        {t("admin.settings.kicker")}
      </div>
      <h1 className="text-[28px] font-medium tracking-[-0.015em] mb-1">
        {t("admin.settings.title")}
      </h1>
      <p className="text-[13.5px] text-muted-on-navy mb-8 leading-[1.55]">
        {t("admin.settings.subtitle")}
      </p>

      <SettingsForm initial={{ practice }} />

      <section className="mt-10 pt-8 border-t border-white/[0.06]">
        <h2 className="text-[20px] font-medium text-white mb-1">Telegram-модераторы</h2>
        <p className="text-[13px] text-muted-on-navy mb-6 leading-[1.55]">
          Сюда приходят карточки заявок с кнопками подтвердить/отклонить. Чтобы добавить нового —
          пусть он напишет <code className="text-orange-soft">/start</code> боту{" "}
          <code className="text-orange-soft">@JediDriveAdmin</code>, тот пришлёт его{" "}
          <code className="text-orange-soft">chat_id</code>. Вставь его сюда.
        </p>
        <ModeratorsForm initial={moderators} />
      </section>
    </div>
  );
}
