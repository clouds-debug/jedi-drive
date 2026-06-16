import type { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { requireAdminRole } from "@/lib/auth/require";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminRole(["admin", "moderator", "instructor"]);

  return (
    <div className="min-h-screen bg-navy text-white md:grid md:grid-cols-[240px_1fr]">
      <AdminSidebar role={user.role} login={user.login} />
      <main className="overflow-x-hidden">{children}</main>
    </div>
  );
}
