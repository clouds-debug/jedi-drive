import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/cabinet/ProfileForm";
import { TelegramLinkButton } from "@/components/cabinet/TelegramLinkButton";
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

      <div className="mt-8 pt-6 border-t border-white/[0.06]">
        <div className="text-[11px] text-muted-on-navy tracking-[0.1em] uppercase mb-2">
          Уведомления в Telegram
        </div>
        <p className="text-[12.5px] text-muted-on-navy mb-3 leading-[1.55]">
          Привяжи Telegram — будешь получать уведомления о заявках прямо в чат с ботом.
        </p>
        <TelegramLinkButton initialLinked={user.telegram_chat_id !== null} />
      </div>
    </div>
  );
}
