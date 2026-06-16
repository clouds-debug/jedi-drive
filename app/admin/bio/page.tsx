import type { Metadata } from "next";
import { requireAdminRole } from "@/lib/auth/require";
import { getInstructorProfile } from "@/lib/admin/instructor-profile";
import { InstructorBioForm } from "@/components/admin/InstructorBioForm";

export const metadata: Metadata = { title: "Биография — Jedi Drive" };

export default async function BioPage() {
  const user = await requireAdminRole(["instructor"]);
  const profile = await getInstructorProfile(user.id);

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-[1200px]">
      <div className="mb-2 text-[11px] font-mono text-orange tracking-[0.1em]">
        ИНСТРУКТОР
      </div>
      <h1 className="text-[28px] font-medium tracking-[-0.015em] mb-1">Биография</h1>
      <p className="text-[13.5px] text-muted-on-navy mb-8">
        Заполни о себе — это попадёт на страницу «Инструкторы» и будет видно ученикам, которые выбирают, к кому записаться.
      </p>

      <InstructorBioForm
        initial={{
          firstName: user.first_name ?? "",
          lastName: user.last_name ?? "",
          bio: profile?.bio ?? "",
          car: profile?.car ?? "",
          experienceYears:
            profile?.experience_years !== null && profile?.experience_years !== undefined
              ? String(profile.experience_years)
              : "",
          languages: profile?.languages ?? [],
          avatarColor: profile?.avatar_color ?? "orange",
          isPublished: profile?.is_published ?? false,
          avatarUrl:
            profile?.has_avatar
              ? `/api/instructors/avatar/${user.id}?v=${
                  profile.avatar_updated_at
                    ? new Date(profile.avatar_updated_at).getTime()
                    : 0
                }`
              : null,
        }}
      />
    </div>
  );
}
