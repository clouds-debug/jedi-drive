import type { Metadata } from "next";
import { requireAdminRole } from "@/lib/auth/require";
import { getInstructorProfile } from "@/lib/admin/instructor-profile";
import { InstructorBioForm } from "@/components/admin/InstructorBioForm";
import { getT } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getT();
  return { title: t("admin.bio.metaTitle") };
}

export default async function BioPage() {
  const user = await requireAdminRole(["instructor"]);
  const { t } = await getT();
  const profile = await getInstructorProfile(user.id);

  return (
    <div className="p-4 sm:p-8 lg:p-10 max-w-[1200px]">
      <div className="mb-2 text-[11px] font-mono text-orange tracking-[0.1em]">
        {t("admin.bio.kicker")}
      </div>
      <h1 className="text-[28px] font-medium tracking-[-0.015em] mb-1">{t("admin.bio.title")}</h1>
      <p className="text-[13.5px] text-muted-on-navy mb-8">
        {t("admin.bio.subtitle")}
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
