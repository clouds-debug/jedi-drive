export type Instructor = {
  id: string;
  name: string;
  initials: string;
  avatarColor: "indigo" | "orange" | "violet" | "emerald" | "rose";
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  car: string;
  languages: ("ru" | "ge" | "en")[];
};

export const instructors: Instructor[] = [
  {
    id: "giorgi",
    name: "Гиоргий Цурцумия",
    initials: "ГЦ",
    avatarColor: "orange",
    rating: 4.9,
    reviewsCount: 127,
    experienceYears: 12,
    car: "Toyota Corolla 2023, АКПП",
    languages: ["ru", "ge"],
  },
  {
    id: "david",
    name: "Давид Кикабидзе",
    initials: "ДК",
    avatarColor: "indigo",
    rating: 4.8,
    reviewsCount: 98,
    experienceYears: 8,
    car: "Hyundai Elantra 2022, АКПП",
    languages: ["ru", "ge", "en"],
  },
  {
    id: "nino",
    name: "Нино Беридзе",
    initials: "НБ",
    avatarColor: "rose",
    rating: 5.0,
    reviewsCount: 203,
    experienceYears: 15,
    car: "Kia Cerato 2023, АКПП",
    languages: ["ru", "ge"],
  },
  {
    id: "aleksandr",
    name: "Александр Меликадзе",
    initials: "АМ",
    avatarColor: "violet",
    rating: 4.7,
    reviewsCount: 76,
    experienceYears: 6,
    car: "Toyota Corolla 2023, АКПП",
    languages: ["ru", "ge"],
  },
  {
    id: "levan",
    name: "Леван Свимонишвили",
    initials: "ЛС",
    avatarColor: "emerald",
    rating: 4.9,
    reviewsCount: 154,
    experienceYears: 10,
    car: "Hyundai Elantra 2022, АКПП",
    languages: ["ge", "en"],
  },
  {
    id: "mariam",
    name: "Мариам Гелашвили",
    initials: "МГ",
    avatarColor: "violet",
    rating: 4.8,
    reviewsCount: 112,
    experienceYears: 7,
    car: "Kia Cerato 2023, АКПП",
    languages: ["ru", "ge"],
  },
  {
    id: "ivan",
    name: "Иван Петров",
    initials: "ИП",
    avatarColor: "indigo",
    rating: 4.6,
    reviewsCount: 64,
    experienceYears: 5,
    car: "Toyota Corolla 2022, АКПП",
    languages: ["ru", "en"],
  },
  {
    id: "tamar",
    name: "Тамара Жгенти",
    initials: "ТЖ",
    avatarColor: "rose",
    rating: 5.0,
    reviewsCount: 187,
    experienceYears: 14,
    car: "Hyundai Elantra 2023, АКПП",
    languages: ["ru", "ge", "en"],
  },
  {
    id: "sandro",
    name: "Сандро Кварацхелия",
    initials: "СК",
    avatarColor: "orange",
    rating: 4.7,
    reviewsCount: 89,
    experienceYears: 6,
    car: "Toyota Corolla 2023, АКПП",
    languages: ["ge"],
  },
];

export function getInstructorById(id: string): Instructor | undefined {
  return instructors.find((i) => i.id === id);
}

const slotTimes = ["10:00", "11:30", "13:00", "14:30", "16:00", "17:30", "19:00"];

export type Slot = {
  time: string;
  available: boolean;
};

// Deterministic availability for demo: same instructor + day combo always renders the same
export function getSlotsForDay(instructorId: string, dayIndex: number): Slot[] {
  const seed = instructorId.charCodeAt(0) + instructorId.charCodeAt(instructorId.length - 1);
  return slotTimes.map((time, slotIndex) => {
    const hash = (seed + dayIndex * 13 + slotIndex * 7) % 5;
    return { time, available: hash !== 0 && hash !== 1 };
  });
}
