import type { Metadata } from "next";
import { AuthShell } from "@/components/cabinet/AuthShell";
import { ResetForm } from "@/components/cabinet/ResetForm";
import { L } from "@/lib/i18n/client";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Сброс пароля — Jedi Drive" };

export const dynamic = "force-dynamic";

export default async function ResetPage() {
  const { t } = await getT();
  return (
    <AuthShell
      num="03"
      label={t("cab.auth.reset.label")}
      title={
        <>
          {t("cab.auth.reset.title.lead")} <span className="text-orange">{t("cab.auth.reset.title.accent")}</span>
        </>
      }
      subtitle={t("cab.auth.reset.subtitle")}
      footer={
        <L href="/cabinet/login" className="hover:text-white transition-colors">
          {t("cab.auth.reset.back")}
        </L>
      }
    >
      <ResetForm />
    </AuthShell>
  );
}
