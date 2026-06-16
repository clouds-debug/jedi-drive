export type UserRole = "student" | "instructor" | "moderator" | "admin";

export function homePathForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "moderator":
      return "/admin/bookings";
    case "instructor":
      return "/admin/bio";
    case "student":
    default:
      return "/cabinet/profile";
  }
}
