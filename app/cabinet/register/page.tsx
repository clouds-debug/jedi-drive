import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/cabinet/AuthShell";
import { RegisterForm } from "@/components/cabinet/RegisterForm";
import { L } from "@/lib/i18n/client";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Регистрация — Jedi Drive" };

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const { t } = await getT();
  return (
    <AuthShell
      num="02"
      label={t("cab.auth.register.label")}
      title={
        <>
          {t("cab.auth.register.title.lead")} <span className="text-orange">{t("cab.auth.register.title.accent")}</span>
        </>
      }
      subtitle={t("cab.auth.register.subtitle")}
      footer={
        <div>
          {t("cab.auth.register.haveAcc")}{" "}
          <L href="/cabinet/login" className="text-white hover:text-orange transition-colors">
            {t("cab.auth.register.signin")}
          </L>
        </div>
      }
    >
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
