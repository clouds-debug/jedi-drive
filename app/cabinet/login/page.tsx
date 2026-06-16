import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/cabinet/AuthShell";
import { LoginForm } from "@/components/cabinet/LoginForm";
import { L } from "@/lib/i18n/client";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Вход — Jedi Drive" };

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const { t } = await getT();
  return (
    <AuthShell
      num="01"
      label={t("cab.auth.login.label")}
      title={
        <>
          {t("cab.auth.login.title.lead")} <span className="text-orange">{t("cab.auth.login.title.accent")}</span>
        </>
      }
      subtitle={t("cab.auth.login.subtitle")}
      footer={
        <div className="flex justify-between gap-3">
          <L href="/cabinet/register" className="hover:text-white transition-colors">
            {t("cab.auth.login.createAcc")}
          </L>
          <L href="/cabinet/reset" className="hover:text-white transition-colors">
            {t("cab.auth.login.forgot")}
          </L>
        </div>
      }
    >
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
