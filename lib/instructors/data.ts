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
  rating: number;
  reviewsCount: number;
  experienceYears: number;
  car: string;
  languages: ("ru" | "ge" | "en")[];
  bio?: string;
  reviews?: Review[];
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
    bio: "12 лет в Jedi Drive, до этого сам сдавал на категорию C. Самый спокойный инструктор в команде — не повышаю голос, даже когда ученик глохнет на перекрёстке третий раз подряд. Считаю, что страх вождения уходит только через постоянное повторение, поэтому много гоняю по реальным маршрутам МВД, особенно по пятницам в час пик.",
    reviews: [
      { author: "Анна К.", initials: "АК", date: "март 2025", text: "Сдала с первого раза. Гиоргий очень спокойный, объяснял на двух языках, чтобы я точно поняла." },
      { author: "Михаил Р.", initials: "МР", date: "февраль 2025", text: "Брал у него только город. За 10 уроков перестал бояться кругового движения. Рекомендую." },
      { author: "Елена П.", initials: "ЕП", date: "январь 2025", text: "Очень терпеливый. Я три раза глохла на холме, он просто посмотрел и сказал «давай ещё раз»." },
    ],
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
    bio: "8 лет преподаю вождение. Учился в Нидерландах, поэтому подход больше «европейский» — много внимания к деталям: посадке, обзору, плавности. Работаю с иностранцами, которые переезжают в Тбилиси. Если ты водил в другой стране — со мной адаптация займёт 5-6 занятий.",
    reviews: [
      { author: "Sarah B.", initials: "SB", date: "апрель 2025", text: "David is incredibly patient with non-native drivers. Helped me adapt my UK skills to Tbilisi traffic." },
      { author: "Тимур А.", initials: "ТА", date: "март 2025", text: "Подходит очень структурно. Каждый урок — план, без воды. Сдал на 28/30." },
      { author: "Лиана М.", initials: "ЛМ", date: "февраль 2025", text: "Давид быстро понял, что я нервничаю на разворотах, и мы отдельно их отработали. Спасибо." },
    ],
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
    bio: "В вождении с 2010 года, в школе с открытия Jedi Drive. Преподаю строго, но без давления — ученики говорят, что чувствуют ответственность не подвести. У меня лучший процент сдачи в команде (94%). Любимая фраза: «руль ровный — голова на дороге».",
    reviews: [
      { author: "Мариам Г.", initials: "МГ", date: "май 2025", text: "Нино — это база. Она не просто учит вождению, она учит уважать дорогу. Сдала на 30/30." },
      { author: "Андрей Ш.", initials: "АШ", date: "апрель 2025", text: "Жёсткая, но честная. Если делаешь правильно — хвалит, если нет — объясняет почему." },
      { author: "Кристина В.", initials: "КВ", date: "март 2025", text: "Боялась идти к самому опытному инструктору, но в итоге это была лучшая школа. Рекомендую." },
      { author: "Гиоргий Л.", initials: "ГЛ", date: "февраль 2025", text: "Сразу сказала: будем работать по моим правилам. И не пожалел. Сдал с первого раза." },
    ],
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
    bio: "6 лет преподаю, до этого работал в логистике. Энергичный — заряжаю учеников, особенно тех, кто пришёл «через силу». Считаю, что вождение — это про уверенность, поэтому много шутим за рулём. Это не мешает строгости на экзаменационной площадке.",
    reviews: [
      { author: "Олег К.", initials: "ОК", date: "май 2025", text: "Александр умеет сделать урок весёлым. После работы это спасает." },
      { author: "Нина Д.", initials: "НД", date: "март 2025", text: "Я боялась практики до слёз. Александр это понял с первого занятия и медленно вытащил из страха." },
      { author: "Лука Б.", initials: "ЛБ", date: "февраль 2025", text: "Сдал с первого. Спасибо за разбор полётов после каждого занятия." },
    ],
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
    bio: "10 лет за рулём как инструктор, до этого был механиком 8 лет. Если ученику интересно — рассказываю как работает АКПП, почему тормоза «плывут», как чувствовать сцепление. Технари меня любят. Преподаю только на грузинском и английском.",
    reviews: [
      { author: "Daniel R.", initials: "DR", date: "май 2025", text: "Best instructor in Tbilisi. Levan explains the mechanics behind the technique." },
      { author: "Ник К.", initials: "НК", date: "март 2025", text: "Я инженер, и Леван говорил со мной на моём языке. Идеально подошёл." },
      { author: "Тариель Б.", initials: "ТБ", date: "февраль 2025", text: "Учил меня в дождь — отдельный навык. Сдал на 29/30." },
    ],
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
    bio: "7 лет в школе. Большинство учениц — женщины, которые боятся идти к мужчинам-инструкторам. У нас в команде есть и другие женщины, но я почти не отказываюсь — все приходят с своей историей и страхами. Тёплый подход, без давления, маленькими шагами.",
    reviews: [
      { author: "Софья Т.", initials: "СТ", date: "май 2025", text: "Шла к Мариам именно потому что женщина. Не пожалела ни минуты — спокойствие и поддержка." },
      { author: "Эка Ч.", initials: "ЭЧ", date: "март 2025", text: "Мариам помогла мне сесть за руль после 3 лет страха после аварии. Настоящий профи." },
      { author: "Тамара К.", initials: "ТК", date: "январь 2025", text: "Очень аккуратная и внимательная. Никогда не повышает голос." },
    ],
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
    bio: "5 лет инструктором, до этого занимался ралли-крос на любительском уровне. Подход — собранный и быстрый. Идеален для тех, кто хочет не просто сдать, а уверенно водить. Часто работаю с людьми, которые много ездят с водителем и решили наконец сами.",
    reviews: [
      { author: "Григорий В.", initials: "ГВ", date: "май 2025", text: "Иван конкретно и по делу. Без воды, без болтовни. Сдал за 8 уроков." },
      { author: "Anna L.", initials: "AL", date: "март 2025", text: "Strict but fair. Definitely the most demanding instructor — I'm glad I picked him." },
      { author: "Леван К.", initials: "ЛК", date: "февраль 2025", text: "Реально учит вождению, а не сдаче экзамена. Большой плюс." },
    ],
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
    bio: "14 лет, всю жизнь в Тбилиси. До инструктора работала переводчиком, поэтому свободно переключаюсь между языками. Часто беру учеников с международной школы, дипломатов, экспатов. Спокойная, методичная, всегда заранее предупреждаю что делать на следующем повороте.",
    reviews: [
      { author: "Emma W.", initials: "EW", date: "май 2025", text: "Tamar is wonderful. She makes every lesson feel manageable and structured." },
      { author: "Юлия С.", initials: "ЮС", date: "март 2025", text: "Тамара — это спокойствие. После неё я перестала бояться парковки." },
      { author: "Ия К.", initials: "ИК", date: "февраль 2025", text: "Лучший выбор для тех, кто хочет качественно а не быстро." },
      { author: "Carlos M.", initials: "CM", date: "январь 2025", text: "Spanish was not her language but she found a way. Amazing instructor." },
    ],
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
    bio: "6 лет преподаю, говорю только на грузинском. Идеально для местных учеников, которые хотят максимально понятный язык. Знаю каждый закоулок Тбилиси — где штрафуют, где экзамены принимают, где удобно парковаться.",
    reviews: [
      { author: "Гиоргий П.", initials: "ГП", date: "май 2025", text: "სანდრო შესანიშნავი მასწავლებელია. გვირაბები აღარ მაშინებს." },
      { author: "Нино М.", initials: "НМ", date: "март 2025", text: "Преподаёт только на грузинском, мне как местному это было даже плюсом." },
      { author: "Лука Т.", initials: "ЛТ", date: "февраль 2025", text: "Знает Тбилиси наизусть. На экзамене ехали по знакомым маршрутам." },
    ],
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
