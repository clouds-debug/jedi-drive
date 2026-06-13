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
  {
    id: "zurab",
    name: "Зураб Багратиони",
    initials: "ЗБ",
    avatarColor: "emerald",
    rating: 4.8,
    reviewsCount: 88,
    experienceYears: 7,
    car: "Toyota Corolla 2023, АКПП",
    languages: ["ru", "ge"],
    bio: "7 лет преподаю, до этого работал таксистом. Знаю весь Тбилиси с закрытыми глазами. Спокойный, говорю немного, объясняю по делу.",
    reviews: [
      { author: "Дмитрий Р.", initials: "ДР", date: "май 2025", text: "Зураб помог разобраться со сложными перекрёстками. Минимум слов, максимум смысла." },
      { author: "Елена Т.", initials: "ЕТ", date: "март 2025", text: "Очень хороший инструктор для тех кто учится «по делу»." },
    ],
  },
  {
    id: "nikita",
    name: "Никита Воронин",
    initials: "НВ",
    avatarColor: "indigo",
    rating: 4.6,
    reviewsCount: 52,
    experienceYears: 4,
    car: "Hyundai Elantra 2022, АКПП",
    languages: ["ru", "en"],
    bio: "Молодой и энергичный, 4 года стажа. Хорошо работает с подростками и студентами — общий язык находится сразу. Сам только что прошёл переаттестацию.",
    reviews: [
      { author: "Артём К.", initials: "АК", date: "май 2025", text: "Никита близок мне по возрасту, говорим на одном языке. Сдал быстро." },
      { author: "Daria S.", initials: "DS", date: "март 2025", text: "Helpful and very patient with English-speaking students." },
    ],
  },
  {
    id: "maria",
    name: "Мария Челидзе",
    initials: "МЧ",
    avatarColor: "violet",
    rating: 4.9,
    reviewsCount: 134,
    experienceYears: 9,
    car: "Kia Cerato 2023, АКПП",
    languages: ["ru", "ge", "en"],
    bio: "9 лет в профессии, говорю на трёх языках свободно. Ученики часто отмечают, что я объясняю одно и то же по-разному, пока не «зайдёт». Терпения у меня много.",
    reviews: [
      { author: "Анастасия Б.", initials: "АБ", date: "май 2025", text: "Мария — это терпение в чистом виде. Не сдаётся пока ты не поймёшь." },
      { author: "Гогита Л.", initials: "ГЛ", date: "март 2025", text: "Лучший вариант если тебе нужны разные языки на одних занятиях." },
      { author: "James W.", initials: "JW", date: "февраль 2025", text: "Maria's trilingual approach is unique. Highly recommend." },
    ],
  },
  {
    id: "anna",
    name: "Анна Феофилова",
    initials: "АФ",
    avatarColor: "rose",
    rating: 5.0,
    reviewsCount: 167,
    experienceYears: 13,
    car: "Toyota Corolla 2023, АКПП",
    languages: ["ru", "ge"],
    bio: "13 лет преподаю, со стажа в кампусе образовательного центра. Перфекционист — мои ученики выезжают с правами и реальным умением водить, а не «сдавать тест».",
    reviews: [
      { author: "Олеся Н.", initials: "ОН", date: "май 2025", text: "Анна — это качество. Если хочется не «сдать», а «уметь» — это к ней." },
      { author: "Ираклий М.", initials: "ИМ", date: "март 2025", text: "Самый требовательный инструктор. Это плюс." },
      { author: "Татьяна Р.", initials: "ТР", date: "февраль 2025", text: "После Анны я водитель, а не «сдавший на права»." },
    ],
  },
  {
    id: "tengiz",
    name: "Тенгиз Гогуа",
    initials: "ТГ",
    avatarColor: "orange",
    rating: 4.7,
    reviewsCount: 91,
    experienceYears: 8,
    car: "Hyundai Elantra 2022, АКПП",
    languages: ["ge"],
    bio: "8 лет преподаю, только на грузинском. Подход — без лишних слов, главное — действие. Хорошо работаю с теми, кто хочет «сесть и поехать» без долгих теорий.",
    reviews: [
      { author: "Шота Г.", initials: "ШГ", date: "май 2025", text: "ტენგიზი მკაცრი მაგრამ მართალი. სამოდელო ინსტრუქტორი." },
      { author: "Резо М.", initials: "РМ", date: "март 2025", text: "Если ищете инструктора, который не лезет в душу — это к Тенгизу." },
    ],
  },
  {
    id: "olga",
    name: "Ольга Романова",
    initials: "ОР",
    avatarColor: "indigo",
    rating: 4.5,
    reviewsCount: 41,
    experienceYears: 5,
    car: "Kia Cerato 2023, АКПП",
    languages: ["ru", "en"],
    bio: "5 лет преподаю, до этого 10 лет водила сама в разных странах. Хорошо понимаю учеников которые «уже почти умеют» — помогаю с дошлифовкой и адаптацией к Тбилисским дорогам.",
    reviews: [
      { author: "Виктор Б.", initials: "ВБ", date: "май 2025", text: "Ольга — лучший выбор если уже водили где-то и нужно перенастроиться на Тбилиси." },
      { author: "Sophie M.", initials: "SM", date: "март 2025", text: "Friendly, professional, great English." },
    ],
  },
  {
    id: "beso",
    name: "Бесо Двалишвили",
    initials: "БД",
    avatarColor: "emerald",
    rating: 4.8,
    reviewsCount: 112,
    experienceYears: 11,
    car: "Toyota Corolla 2022, АКПП",
    languages: ["ge", "ru"],
    bio: "11 лет в школе, считаюсь «спокойным дядей» в коллективе. Никогда не слышали чтобы я повышал голос — это не мой стиль. Главное в обучении — комфорт ученика.",
    reviews: [
      { author: "Натия К.", initials: "НК", date: "май 2025", text: "Бесо просто Будда за рулём. Полное спокойствие передаётся ученику." },
      { author: "Тамаз Ш.", initials: "ТШ", date: "март 2025", text: "Если боишься или нервничаешь — иди к Бесо." },
      { author: "Майя Г.", initials: "МГ", date: "февраль 2025", text: "Очень мягкий подход. Никогда не сердится." },
    ],
  },
  {
    id: "karina",
    name: "Карина Лазарева",
    initials: "КЛ",
    avatarColor: "violet",
    rating: 4.9,
    reviewsCount: 156,
    experienceYears: 10,
    car: "Hyundai Elantra 2023, АКПП",
    languages: ["ru", "ge"],
    bio: "10 лет, специализируюсь на ускоренном обучении. Если у тебя сжатые сроки — приходи. За 15-20 занятий ставлю крепкий уровень, проверено сотней учеников.",
    reviews: [
      { author: "Денис К.", initials: "ДК", date: "май 2025", text: "Карина выручила — мне нужно было сдать за месяц до отъезда. Сдал." },
      { author: "Лия М.", initials: "ЛМ", date: "март 2025", text: "Если ты в дедлайне — это к Карине. Чудесница." },
    ],
  },
  {
    id: "shota",
    name: "Шота Накани",
    initials: "ШН",
    avatarColor: "orange",
    rating: 4.7,
    reviewsCount: 73,
    experienceYears: 6,
    car: "Kia Cerato 2022, АКПП",
    languages: ["ge"],
    bio: "6 лет преподаю, только на грузинском. Молодой энергичный — много шуток за рулём, но не в ущерб дисциплине. Хорошо для тех кто устал от строгости.",
    reviews: [
      { author: "Гиорги В.", initials: "ГВ", date: "май 2025", text: "С Шотой не скучно. Уроки пролетают, а навыки растут." },
      { author: "Лали Г.", initials: "ЛГ", date: "март 2025", text: "Лёгкий в общении, но при этом профи. Сдала с первого." },
    ],
  },
  {
    id: "irina",
    name: "Ирина Маркова",
    initials: "ИМ",
    avatarColor: "rose",
    rating: 4.8,
    reviewsCount: 104,
    experienceYears: 8,
    car: "Toyota Corolla 2023, АКПП",
    languages: ["ru", "ge", "en"],
    bio: "8 лет преподаю, мама троих детей. Особое внимание к безопасности — учу не только водить, но и предвидеть опасные ситуации. Люблю работать с молодыми мамами и подростками.",
    reviews: [
      { author: "Елена С.", initials: "ЕС", date: "май 2025", text: "Ирина — это про безопасность. Учит видеть дорогу на 10 секунд вперёд." },
      { author: "Кэти Б.", initials: "КБ", date: "март 2025", text: "Замечательно работает с женщинами. Тёплый подход." },
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
