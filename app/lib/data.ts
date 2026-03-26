export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  year: number;
  description: string;
  youtubeId: string;
}

export interface Car {
  id: string;
  name: string;
  brand: string;
  type: "EV" | "Hybrid" | "ICE";
  range?: string;
  battery?: string;
  price?: string;
  image: string;
  relatedVideoIds: string[];
}

export const videos: Video[] = [
  // ─── Trending (10 videos) ───────────────────────────────
  {
    id: "1",
    title: "2025 Tesla Model Y Juniper – Full Review",
    thumbnail: "https://img.youtube.com/vi/RGHZiWgmYXc/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "The all-new Tesla Model Y gets a major refresh. Is the Juniper the best electric SUV you can buy?",
    youtubeId: "RGHZiWgmYXc",
  },
  {
    id: "2",
    title: "BYD Seal U – Tesla Model Y Killer?",
    thumbnail: "https://img.youtube.com/vi/x_hSn5B5Ynk/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "BYD's electric SUV challenges Tesla's dominance. Complete review and comparison.",
    youtubeId: "x_hSn5B5Ynk",
  },
  {
    id: "3",
    title: "Xiaomi SU7 Ultra – The Fastest Chinese EV",
    thumbnail: "https://img.youtube.com/vi/G9E8Nk3C1hQ/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Xiaomi enters the car world with an insane performance sedan. First impressions.",
    youtubeId: "G9E8Nk3C1hQ",
  },
  {
    id: "4",
    title: "Porsche Taycan Turbo GT – New Nurburgring Record",
    thumbnail: "https://img.youtube.com/vi/9LFPO_qvGO8/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "The Porsche Taycan Turbo GT smashes the EV lap record at the Nurburgring.",
    youtubeId: "9LFPO_qvGO8",
  },
  {
    id: "5",
    title: "New BMW iX3 2025 – Next-Gen Electric SUV",
    thumbnail: "https://img.youtube.com/vi/CDlQrhHbOkQ/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "BMW's Neue Klasse platform debuts with the iX3. A game changer?",
    youtubeId: "CDlQrhHbOkQ",
  },
  {
    id: "6",
    title: "Hyundai Ioniq 5 N – The Hot Hatch EV",
    thumbnail: "https://img.youtube.com/vi/sJ8K0LAsHxE/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Hyundai made a performance EV that simulates gear shifts. Is this the future of driving fun?",
    youtubeId: "sJ8K0LAsHxE",
  },
  {
    id: "7",
    title: "Mercedes EQG – Electric G-Wagon First Drive",
    thumbnail: "https://img.youtube.com/vi/PCVQKR_Ij4I/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "The iconic G-Wagon goes electric. Can it maintain its off-road legend status?",
    youtubeId: "PCVQKR_Ij4I",
  },
  {
    id: "8",
    title: "2025 Kia EV9 GT – 7 Seat Electric SUV",
    thumbnail: "https://img.youtube.com/vi/v1zrR3fF6_A/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Kia's flagship electric SUV seats seven and charges ultra fast.",
    youtubeId: "v1zrR3fF6_A",
  },
  {
    id: "9",
    title: "Toyota Solid State Battery Breakthrough 2025",
    thumbnail: "https://img.youtube.com/vi/GHCUgjT3LMk/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Toyota claims 1200km range with new solid-state battery tech. Will it change everything?",
    youtubeId: "GHCUgjT3LMk",
  },
  {
    id: "10",
    title: "Rivian R2 Reveal – The Affordable Adventure EV",
    thumbnail: "https://img.youtube.com/vi/xinz2P5bEMk/hqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Rivian's smaller and more affordable R2 aims to shake up the EV market.",
    youtubeId: "xinz2P5bEMk",
  },

  // ─── Electric Cars (15 videos) ──────────────────────────
  {
    id: "11",
    title: "Tesla Model 3 Highland – Complete Review",
    thumbnail: "https://img.youtube.com/vi/VkBqoFpFAYM/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "The refreshed Tesla Model 3 Highland reviewed. Better interior, improved range, new tech.",
    youtubeId: "VkBqoFpFAYM",
  },
  {
    id: "12",
    title: "BYD Dolphin – Best Affordable EV?",
    thumbnail: "https://img.youtube.com/vi/BOZK7drZqaw/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Is the BYD Dolphin the best budget electric car on the market right now?",
    youtubeId: "BOZK7drZqaw",
  },
  {
    id: "13",
    title: "BMW iX xDrive50 – Luxury Electric SUV",
    thumbnail: "https://img.youtube.com/vi/dVcfCpFNhMg/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "BMW's flagship electric SUV reviewed in detail. Comfort, tech, and range tested.",
    youtubeId: "dVcfCpFNhMg",
  },
  {
    id: "14",
    title: "Hyundai Ioniq 6 – The Aerodynamic EV",
    thumbnail: "https://img.youtube.com/vi/kMqEfEB-oNA/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Hyundai's gorgeous streamliner with fast charging and incredible efficiency.",
    youtubeId: "kMqEfEB-oNA",
  },
  {
    id: "15",
    title: "Rivian R1S – Adventure Electric SUV",
    thumbnail: "https://img.youtube.com/vi/h5hcVbrdWpM/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Off-road capable electric SUV from Rivian. Built for adventure.",
    youtubeId: "h5hcVbrdWpM",
  },
  {
    id: "16",
    title: "BYD Atto 3 – Affordable Family EV",
    thumbnail: "https://img.youtube.com/vi/Z-9GEHoKDMw/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "The BYD Atto 3 brings practical electric motoring to families on a budget.",
    youtubeId: "Z-9GEHoKDMw",
  },
  {
    id: "17",
    title: "Mercedes EQS 450+ – The Electric S-Class",
    thumbnail: "https://img.youtube.com/vi/VB99cXwSz0A/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Mercedes brings S-Class luxury to the EV world. Is it worth the premium?",
    youtubeId: "VB99cXwSz0A",
  },
  {
    id: "18",
    title: "Polestar 2 Long Range – Volvo's Electric Sports Sedan",
    thumbnail: "https://img.youtube.com/vi/b0dST0dZ4NA/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Scandinavian design meets electric performance. The Polestar 2 reviewed.",
    youtubeId: "b0dST0dZ4NA",
  },
  {
    id: "19",
    title: "Volkswagen ID.7 – VW's Best Electric Car Yet",
    thumbnail: "https://img.youtube.com/vi/g5S7QLcIuI0/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "VW finally gets it right with the ID.7. A proper electric sedan with real range.",
    youtubeId: "g5S7QLcIuI0",
  },
  {
    id: "20",
    title: "Audi Q8 e-tron – Premium Electric SUV",
    thumbnail: "https://img.youtube.com/vi/91bO8z3orDQ/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Audi's flagship electric SUV gets updated with more range and improved tech.",
    youtubeId: "91bO8z3orDQ",
  },
  {
    id: "21",
    title: "NIO ET7 – Chinese Luxury EV with Swappable Batteries",
    thumbnail: "https://img.youtube.com/vi/X2JOk-yVWrA/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "NIO's flagship sedan features battery swap tech. Is this the future of EV charging?",
    youtubeId: "X2JOk-yVWrA",
  },
  {
    id: "22",
    title: "BYD Seal – The Tesla Model 3 Rival",
    thumbnail: "https://img.youtube.com/vi/Q11W0vqBhBo/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "BYD Seal takes on Tesla's best seller. Design, performance, and value compared.",
    youtubeId: "Q11W0vqBhBo",
  },
  {
    id: "23",
    title: "Hyundai Ioniq 5 2025 – Still The Best EV?",
    thumbnail: "https://img.youtube.com/vi/4LgHAJpk0V4/hqdefault.jpg",
    category: "Electric Cars",
    year: 2025,
    description:
      "The refreshed Ioniq 5 brings more range, faster charging, and a new look.",
    youtubeId: "4LgHAJpk0V4",
  },
  {
    id: "24",
    title: "Kia EV6 GT – 585HP Electric Hot Hatch",
    thumbnail: "https://img.youtube.com/vi/YFmL0gU_J50/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Kia's performance EV smokes supercars to 100 km/h. Full review and performance test.",
    youtubeId: "YFmL0gU_J50",
  },
  {
    id: "25",
    title: "Volvo EX30 – The Tiny Premium EV",
    thumbnail: "https://img.youtube.com/vi/7e7R3y-qwZ0/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Volvo's smallest EV packs premium features into a compact, affordable package.",
    youtubeId: "7e7R3y-qwZ0",
  },

  // ─── Reviews (10 videos) ────────────────────────────────
  {
    id: "26",
    title: "Toyota Supra MK5 – Worth the Hype?",
    thumbnail: "https://img.youtube.com/vi/x8R7BdV9F1g/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "We test the Toyota Supra to see if it lives up to its legendary name.",
    youtubeId: "x8R7BdV9F1g",
  },
  {
    id: "27",
    title: "Mazda MX-5 – Pure Driving Joy",
    thumbnail: "https://img.youtube.com/vi/iC3yvEr2n1c/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "The Mazda MX-5 Miata continues to be the benchmark for driving fun.",
    youtubeId: "iC3yvEr2n1c",
  },
  {
    id: "28",
    title: "Porsche 911 GT3 RS – Track Monster",
    thumbnail: "https://img.youtube.com/vi/n37E7cFaPsU/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "The naturally aspirated Porsche 911 GT3 RS pushed to its limits on track.",
    youtubeId: "n37E7cFaPsU",
  },
  {
    id: "29",
    title: "Ford Mustang Dark Horse Review",
    thumbnail: "https://img.youtube.com/vi/7aEIurp2EGA/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "The most powerful naturally aspirated Mustang ever made. Is V8 still alive?",
    youtubeId: "7aEIurp2EGA",
  },
  {
    id: "30",
    title: "Honda Civic Type R – Hot Hatch King",
    thumbnail: "https://img.youtube.com/vi/eNdHFsHU0Mo/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "Honda's ultimate hot hatch goes on a full test. Manual perfection.",
    youtubeId: "eNdHFsHU0Mo",
  },
  {
    id: "31",
    title: "BMW M3 Touring – The Best Daily Sports Car",
    thumbnail: "https://img.youtube.com/vi/2x_kvL_FQco/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "BMW finally made an M3 wagon. Practical, powerful, and absolute perfection.",
    youtubeId: "2x_kvL_FQco",
  },
  {
    id: "32",
    title: "Mercedes AMG GT 63 – V8 Supercoupe",
    thumbnail: "https://img.youtube.com/vi/h1TsHUMDr5E/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "Mercedes' flagship sports car with a handcrafted AMG engine. Worth the money?",
    youtubeId: "h1TsHUMDr5E",
  },
  {
    id: "33",
    title: "Nissan Z Nismo – JDM Performance Lives On",
    thumbnail: "https://img.youtube.com/vi/_R-0BqDWfpE/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "The Nissan Z gets the Nismo treatment. Twin-turbo V6, track-tuned suspension.",
    youtubeId: "_R-0BqDWfpE",
  },
  {
    id: "34",
    title: "Lamborghini Revuelto – V12 Hybrid Supercar",
    thumbnail: "https://img.youtube.com/vi/yKnRFE_qmCk/hqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "Lamborghini's first hybrid supercar combines a V12 with electric motors for 1015HP.",
    youtubeId: "yKnRFE_qmCk",
  },
  {
    id: "35",
    title: "Alpine A290 – French Electric Hot Hatch",
    thumbnail: "https://img.youtube.com/vi/TJakNi0GHFY/hqdefault.jpg",
    category: "Reviews",
    year: 2025,
    description:
      "Alpine's first EV is a fun, nimble hot hatch. Does it deliver driving pleasure?",
    youtubeId: "TJakNi0GHFY",
  },

  // ─── Comparisons (10 videos) ────────────────────────────
  {
    id: "36",
    title: "Tesla Model 3 vs BYD Seal – Ultimate Comparison",
    thumbnail: "https://img.youtube.com/vi/7CqkGjMlvzE/hqdefault.jpg",
    category: "Comparisons",
    year: 2024,
    description:
      "The two most popular electric sedans go head to head. Which one should you buy?",
    youtubeId: "7CqkGjMlvzE",
  },
  {
    id: "37",
    title: "Hyundai Ioniq 5 vs Kia EV6 – Which Is Better?",
    thumbnail: "https://img.youtube.com/vi/5dA5aCjktcE/hqdefault.jpg",
    category: "Comparisons",
    year: 2024,
    description:
      "Same platform, different vibes. We compare Hyundai and Kia's best EVs.",
    youtubeId: "5dA5aCjktcE",
  },
  {
    id: "38",
    title: "Best EVs Under $40,000 in 2025",
    thumbnail: "https://img.youtube.com/vi/sbU7MEq-3lU/hqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "Affordable doesn't mean boring. The best budget-friendly electric cars right now.",
    youtubeId: "sbU7MEq-3lU",
  },
  {
    id: "39",
    title: "Tesla Model Y vs BMW iX3 vs Volvo EX30",
    thumbnail: "https://img.youtube.com/vi/T4ioajdrGQA/hqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "Three electric SUVs compared: value, range, performance, and quality.",
    youtubeId: "T4ioajdrGQA",
  },
  {
    id: "40",
    title: "Top 10 EVs with Longest Range 2025",
    thumbnail: "https://img.youtube.com/vi/dKl6Pd3VfeY/hqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "Which electric cars go the furthest on a single charge? The definitive range ranking.",
    youtubeId: "dKl6Pd3VfeY",
  },
  {
    id: "41",
    title: "Porsche 911 vs Nissan GT-R vs BMW M4 – Drag Race",
    thumbnail: "https://img.youtube.com/vi/S7MQNBpZpBo/hqdefault.jpg",
    category: "Comparisons",
    year: 2024,
    description:
      "Three iconic sports cars go head to head in a straight-line drag race.",
    youtubeId: "S7MQNBpZpBo",
  },
  {
    id: "42",
    title: "BYD vs Tesla – Which Brand Is Better in 2025?",
    thumbnail: "https://img.youtube.com/vi/IFJGIx9c5CU/hqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "The EV giants compared brand-wide: tech, value, lineup, and reliability.",
    youtubeId: "IFJGIx9c5CU",
  },
  {
    id: "43",
    title: "Best Electric SUVs 2025 – Buyer's Guide",
    thumbnail: "https://img.youtube.com/vi/KfHjV_KeUws/hqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "Looking for an electric SUV? Here are the best options across all budgets.",
    youtubeId: "KfHjV_KeUws",
  },
  {
    id: "44",
    title: "Honda Civic Type R vs Toyota GR Corolla",
    thumbnail: "https://img.youtube.com/vi/2LgPWIShYKc/hqdefault.jpg",
    category: "Comparisons",
    year: 2024,
    description:
      "Two of the hottest hot hatches battle it out on track and street.",
    youtubeId: "2LgPWIShYKc",
  },
  {
    id: "45",
    title: "EV Charging Costs: Home vs Public vs Supercharger",
    thumbnail: "https://img.youtube.com/vi/J8rODT4UcfI/hqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "How much does it really cost to charge an electric car? We break down every option.",
    youtubeId: "J8rODT4UcfI",
  },

  // ─── Tuning (5 videos) ──────────────────────────────────
  {
    id: "46",
    title: "1000HP Toyota Supra Build – Full Transformation",
    thumbnail: "https://img.youtube.com/vi/FfYYH6NmGac/hqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "From stock to 1000HP – watch this insane Toyota Supra build come together.",
    youtubeId: "FfYYH6NmGac",
  },
  {
    id: "47",
    title: "Nissan Skyline R34 GT-R Full Restoration",
    thumbnail: "https://img.youtube.com/vi/gxvp3WIz4vA/hqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "A legendary R34 GT-R gets a complete ground-up restoration and upgrade.",
    youtubeId: "gxvp3WIz4vA",
  },
  {
    id: "48",
    title: "Best Car Mods Under $500 – Budget Tuning Guide",
    thumbnail: "https://img.youtube.com/vi/n8cJt-APC0c/hqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "You don't need a big budget to make your car faster. Top mods for any car.",
    youtubeId: "n8cJt-APC0c",
  },
  {
    id: "49",
    title: "BMW M4 Widebody Build – Liberty Walk Kit",
    thumbnail: "https://img.youtube.com/vi/PExXaVk6e8s/hqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "A BMW M4 gets the full Liberty Walk widebody treatment. The transformation is insane.",
    youtubeId: "PExXaVk6e8s",
  },
  {
    id: "50",
    title: "Tesla Model 3 Performance Mods – What Works?",
    thumbnail: "https://img.youtube.com/vi/yKHG-wdYoiU/hqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "Can you tune an electric car? We test the best performance upgrades for the Model 3.",
    youtubeId: "yKHG-wdYoiU",
  },
];

export const categories = [
  "Trending",
  "Electric Cars",
  "Reviews",
  "Comparisons",
  "Tuning",
];

export function getVideosByCategory(category: string): Video[] {
  return videos.filter((v) => v.category === category);
}

export function getVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}

// ─── Car Data (5 starter cars) ────────────────────────────
export const cars: Car[] = [
  {
    id: "car-1",
    name: "Tesla Model 3",
    brand: "Tesla",
    type: "EV",
    range: "513 km",
    battery: "60 kWh",
    price: "From $38,990",
    image: "https://img.youtube.com/vi/VkBqoFpFAYM/hqdefault.jpg",
    relatedVideoIds: ["11", "36", "50"],
  },
  {
    id: "car-2",
    name: "BYD Atto 3",
    brand: "BYD",
    type: "EV",
    range: "420 km",
    battery: "60.5 kWh",
    price: "From $38,000",
    image: "https://img.youtube.com/vi/Z-9GEHoKDMw/hqdefault.jpg",
    relatedVideoIds: ["16", "12"],
  },
  {
    id: "car-3",
    name: "Hyundai Ioniq 5",
    brand: "Hyundai",
    type: "EV",
    range: "507 km",
    battery: "84 kWh",
    price: "From $41,800",
    image: "https://img.youtube.com/vi/4LgHAJpk0V4/hqdefault.jpg",
    relatedVideoIds: ["23", "6", "37"],
  },
  {
    id: "car-4",
    name: "BYD Seal",
    brand: "BYD",
    type: "EV",
    range: "570 km",
    battery: "82.5 kWh",
    price: "From $44,900",
    image: "https://img.youtube.com/vi/Q11W0vqBhBo/hqdefault.jpg",
    relatedVideoIds: ["22", "36", "42"],
  },
  {
    id: "car-5",
    name: "Tesla Model Y",
    brand: "Tesla",
    type: "EV",
    range: "533 km",
    battery: "75 kWh",
    price: "From $44,990",
    image: "https://img.youtube.com/vi/RGHZiWgmYXc/hqdefault.jpg",
    relatedVideoIds: ["1", "2", "39"],
  },
];

export function getCarById(id: string): Car | undefined {
  return cars.find((c) => c.id === id);
}

export function getRelatedVideosForCar(car: Car): Video[] {
  return car.relatedVideoIds
    .map((vid) => getVideoById(vid))
    .filter((v): v is Video => v !== undefined);
}
