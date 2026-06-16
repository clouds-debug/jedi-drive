export type Review = {
  author: string;
  initials: string;
  date: string;
  text: string;
};

export type Instructor = {
  id: string;
  name: string;
  initials: string;
  avatarColor: "indigo" | "orange" | "violet" | "emerald" | "rose";
  avatarUrl?: string | null;
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  car: string;
  languages: ("ru" | "ge" | "en")[];
  bio?: string;
  reviews?: Review[];
};

export const instructors: Instructor[] = [];

export function getInstructorById(id: string): Instructor | undefined {
  return instructors.find((i) => i.id === id);
}

export const slotTimes = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

export type Slot = {
  time: string;
  available: boolean;
};
