import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/cabinet/ProfileForm";
import { readSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/users";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Профиль — Jedi Drive" };

export default async function ProfilePage() {
  const session = await readSession();
  if (!session) redirect("/cabinet/login");
  const user = await findUserById(session.userId);
  if (!user) redirect("/cabinet/login");
  const { t } = await getT();

  return (
    <div className="max-w-3xl">
      <h2 className="text-[20px] font-medium text-white mb-1.5">{t("cab.profile.heading")}</h2>
      <p className="text-[13px] text-muted-on-navy mb-7">{t("cab.profile.subheading")}</p>

      <ProfileForm
        initial={{
          login: user.login,
          firstName: user.first_name,
          lastName: user.last_name,
          phone: user.phone,
          telegramUsername: user.telegram_username,
        }}
      />
    </div>
  );
}
