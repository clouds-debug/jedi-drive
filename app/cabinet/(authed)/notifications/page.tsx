import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NotificationsList } from "@/components/cabinet/NotificationsList";
import { readSession } from "@/lib/auth/session";
import { countTotal, listNotifications } from "@/lib/notifications";
import { getT } from "@/lib/i18n/server";

export const metadata: Metadata = { title: "Уведомления — Jedi Drive" };

const PAGE_SIZE = 20;

export default async function NotificationsPage() {
  const session = await readSession();
  if (!session) redirect("/cabinet/login");

  const [rows, total, { t }] = await Promise.all([
    listNotifications(session.userId, PAGE_SIZE),
    countTotal(session.userId),
    getT(),
  ]);
  const items = rows.map((n) => ({
    id: n.id,
    title: n.title,
    body: n.body,
    kind: n.kind,
    isRead: n.read_at !== null,
    createdAt: n.created_at,
  }));

  return (
    <div className="max-w-3xl">
      <h2 className="text-[20px] font-medium text-white mb-1.5">{t("cab.notifications.heading")}</h2>
      <p className="text-[13px] text-muted-on-navy mb-7">{t("cab.notifications.subheading")}</p>

      <NotificationsList initial={items} initialHasMore={rows.length < total} />
    </div>
  );
}
