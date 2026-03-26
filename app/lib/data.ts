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
    thumbnail: "https://i.ytimg.com/vi/a3zBdK4LrX4/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "The all-new Tesla Model Y gets a major refresh. Is the Juniper the best electric SUV you can buy?",
    youtubeId: "a3zBdK4LrX4",
  },
  {
    id: "2",
    title: "BYD Seal U – Tesla Model Y Killer?",
    thumbnail: "https://i.ytimg.com/vi/7oUy5H_w4yQ/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "BYD's hybrid SUV challenges the competition. Complete review with driving impressions.",
    youtubeId: "7oUy5H_w4yQ",
  },
  {
    id: "3",
    title: "Xiaomi SU7 – Driving Xiaomi's Electric Car",
    thumbnail: "https://i.ytimg.com/vi/Mb6H7trzMfI/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Xiaomi enters the car world with an electric sedan. MKBHD's first impressions.",
    youtubeId: "Mb6H7trzMfI",
  },
  {
    id: "4",
    title: "Porsche Taycan Turbo GT – Should Tesla Be Scared?",
    thumbnail: "https://i.ytimg.com/vi/9bsrHv2QG0o/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "The Porsche Taycan Turbo GT is the fastest electric Porsche ever. Full review.",
    youtubeId: "9bsrHv2QG0o",
  },
  {
    id: "5",
    title: "BMW iX3 Neue Klasse – BMW's Future",
    thumbnail: "https://i.ytimg.com/vi/qgJp1Sg3cEc/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "BMW's Neue Klasse platform debuts with the iX3. Is it good enough?",
    youtubeId: "qgJp1Sg3cEc",
  },
  {
    id: "6",
    title: "Hyundai Ioniq 5 N – Drag Race & Lap Time",
    thumbnail: "https://i.ytimg.com/vi/JVwfEOh0KBI/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Hyundai made a performance EV that simulates gear shifts. Full performance test.",
    youtubeId: "JVwfEOh0KBI",
  },
  {
    id: "7",
    title: "Mercedes G580 Electric – Is It Still a True G-Class?",
    thumbnail: "https://i.ytimg.com/vi/S6oToAnS404/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "The iconic G-Wagon goes electric. Can it maintain its off-road legend status?",
    youtubeId: "S6oToAnS404",
  },
  {
    id: "8",
    title: "Kia EV9 – Still The Best Electric SUV?",
    thumbnail: "https://i.ytimg.com/vi/PWigi5V-5mY/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Kia's flagship electric SUV seats seven and charges ultra fast. Owner review.",
    youtubeId: "PWigi5V-5mY",
  },
  {
    id: "9",
    title: "Solid State Battery Revolution – Battery 4.0",
    thumbnail: "https://i.ytimg.com/vi/Db-VVJCQ5u4/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Solid-state batteries promise 1200km range. Will they change everything?",
    youtubeId: "Db-VVJCQ5u4",
  },
  {
    id: "10",
    title: "Say Hello to R2 – Rivian's Affordable EV",
    thumbnail: "https://i.ytimg.com/vi/1YV3fZaOQWA/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "Rivian's smaller and more affordable R2 aims to shake up the EV market. Official reveal.",
    youtubeId: "1YV3fZaOQWA",
  },

  // ─── Electric Cars (15 videos) ──────────────────────────
  {
    id: "11",
    title: "Tesla Model 3 Highland – The Best Tesla Yet?",
    thumbnail: "https://i.ytimg.com/vi/Qf7y-g2Xk5A/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "MKBHD reviews the refreshed Tesla Model 3 Highland. Better interior, improved range.",
    youtubeId: "Qf7y-g2Xk5A",
  },
  {
    id: "12",
    title: "BYD Dolphin – The Best Cheap EV?",
    thumbnail: "https://i.ytimg.com/vi/R9IqYlZlI3Q/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Is the BYD Dolphin the best budget electric car on the market right now?",
    youtubeId: "R9IqYlZlI3Q",
  },
  {
    id: "13",
    title: "BMW iX – 0-60mph, Autobahn & Range Test",
    thumbnail: "https://i.ytimg.com/vi/VoWqeaNMJOM/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "BMW's flagship electric SUV reviewed with full performance and range testing.",
    youtubeId: "VoWqeaNMJOM",
  },
  {
    id: "14",
    title: "Hyundai Ioniq 6 – Better Than Tesla Model 3?",
    thumbnail: "https://i.ytimg.com/vi/fT6i-h94GIA/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Hyundai's gorgeous streamliner with fast charging and incredible efficiency reviewed.",
    youtubeId: "fT6i-h94GIA",
  },
  {
    id: "15",
    title: "Rivian R1S – The Best SUV Ever?",
    thumbnail: "https://i.ytimg.com/vi/wR-0knMVSGw/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "MKBHD reviews the Rivian R1S. Off-road capable and adventure ready.",
    youtubeId: "wR-0knMVSGw",
  },
  {
    id: "16",
    title: "BYD Atto 3 – In-Depth Review",
    thumbnail: "https://i.ytimg.com/vi/FemVjBnGP3g/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "The BYD Atto 3 brings practical electric motoring to families on a budget. carwow review.",
    youtubeId: "FemVjBnGP3g",
  },
  {
    id: "17",
    title: "Mercedes EQS – The Electric S-Class Tested",
    thumbnail: "https://i.ytimg.com/vi/_uI_hWmVCjo/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Mercedes brings S-Class luxury to the EV world. 0-60 and full review by carwow.",
    youtubeId: "_uI_hWmVCjo",
  },
  {
    id: "18",
    title: "Polestar 2 – It Just Got Way Better",
    thumbnail: "https://i.ytimg.com/vi/-9RtP8OKLYw/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Scandinavian design meets electric performance. The updated Polestar 2 reviewed.",
    youtubeId: "-9RtP8OKLYw",
  },
  {
    id: "19",
    title: "VW ID.7 – It's Not What You Think",
    thumbnail: "https://i.ytimg.com/vi/L58V0GT7knE/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "VW finally gets it right with the ID.7. carwow's full review of VW's best EV.",
    youtubeId: "L58V0GT7knE",
  },
  {
    id: "20",
    title: "Audi Q8 e-tron – Unbeatable Electric SUV?",
    thumbnail: "https://i.ytimg.com/vi/uW0OK8MzyIE/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Audi's flagship electric SUV reviewed by What Car? with updated range and tech.",
    youtubeId: "uW0OK8MzyIE",
  },
  {
    id: "21",
    title: "NIO ET7 – Mercedes' Deadliest Rival",
    thumbnail: "https://i.ytimg.com/vi/SLfbtv769cY/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "NIO's flagship sedan features battery swap tech. Is this the future of EV charging?",
    youtubeId: "SLfbtv769cY",
  },
  {
    id: "22",
    title: "BYD Seal – Better Than a Tesla?",
    thumbnail: "https://i.ytimg.com/vi/DHRxnTPrzOQ/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "What Car? reviews the BYD Seal. Is this Chinese EV really better than a Tesla?",
    youtubeId: "DHRxnTPrzOQ",
  },
  {
    id: "23",
    title: "Hyundai Ioniq 5 2025 – Six Months Later",
    thumbnail: "https://i.ytimg.com/vi/GItH7vwTR6k/mqdefault.jpg",
    category: "Electric Cars",
    year: 2025,
    description:
      "The refreshed Ioniq 5 after six months of ownership. More range, faster charging.",
    youtubeId: "GItH7vwTR6k",
  },
  {
    id: "24",
    title: "Kia EV6 GT – Faster Than a Lamborghini",
    thumbnail: "https://i.ytimg.com/vi/ff2p3o6FFCw/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Kia's performance EV smokes supercars to 100 km/h. carwow's full review.",
    youtubeId: "ff2p3o6FFCw",
  },
  {
    id: "25",
    title: "Volvo EX30 – Fab or Flawed?",
    thumbnail: "https://i.ytimg.com/vi/w5IffpLajrE/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Volvo's smallest EV packs premium features into a compact, affordable package. Autotrader review.",
    youtubeId: "w5IffpLajrE",
  },

  // ─── Reviews (10 videos) ────────────────────────────────
  {
    id: "26",
    title: "2024 Toyota Supra 3.0 Premium Review",
    thumbnail: "https://i.ytimg.com/vi/bAAiCy5V-gg/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "We test the Toyota Supra to see if it lives up to its legendary name.",
    youtubeId: "bAAiCy5V-gg",
  },
  {
    id: "27",
    title: "2024 Mazda MX-5 – More Perfecter",
    thumbnail: "https://i.ytimg.com/vi/_S0xY_fS_mQ/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "The refreshed Mazda MX-5 Miata reviewed by Throttle House. Still pure driving joy.",
    youtubeId: "_S0xY_fS_mQ",
  },
  {
    id: "28",
    title: "Porsche 911 GT3 RS – Basically a Race Car",
    thumbnail: "https://i.ytimg.com/vi/rC3x5m9_g7Q/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "carwow takes the Porsche 911 GT3 RS to its absolute limits. Full review.",
    youtubeId: "rC3x5m9_g7Q",
  },
  {
    id: "29",
    title: "Ford Mustang Dark Horse – This Is The One To Buy",
    thumbnail: "https://i.ytimg.com/vi/ZuqrGAo5xb8/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "The Straight Pipes review the most powerful naturally aspirated Mustang ever made.",
    youtubeId: "ZuqrGAo5xb8",
  },
  {
    id: "30",
    title: "Honda Civic Type R – Is It Really Better?",
    thumbnail: "https://i.ytimg.com/vi/K0mE-YKyV84/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "Honda's ultimate hot hatch goes on a full test. carwow's complete review.",
    youtubeId: "K0mE-YKyV84",
  },
  {
    id: "31",
    title: "BMW M3 Touring – The World's Best Car?",
    thumbnail: "https://i.ytimg.com/vi/Wa2X5kYjSHs/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "BMW finally made an M3 wagon. carwow says it might be the best car in the world.",
    youtubeId: "Wa2X5kYjSHs",
  },
  {
    id: "32",
    title: "AMG GT 63 – Has Mercedes Ruined Its Best Sports Car?",
    thumbnail: "https://i.ytimg.com/vi/2vWh2kaeZkI/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "Mercedes' flagship sports car reviewed by carwow. Is the new GT a step back?",
    youtubeId: "2vWh2kaeZkI",
  },
  {
    id: "33",
    title: "2024 Nissan Z NISMO – Quick Review",
    thumbnail: "https://i.ytimg.com/vi/pePMmx1MmBU/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "The Nissan Z gets the Nismo treatment. Twin-turbo V6, track-tuned suspension.",
    youtubeId: "pePMmx1MmBU",
  },
  {
    id: "34",
    title: "Lamborghini Revuelto – Real World Test",
    thumbnail: "https://i.ytimg.com/vi/nLi-pBoqzXM/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "Lamborghini's first hybrid supercar with V12 plus electric motors. 0-60 and review.",
    youtubeId: "nLi-pBoqzXM",
  },
  {
    id: "35",
    title: "Alpine A290 – New Hot Hatch Champion?",
    thumbnail: "https://i.ytimg.com/vi/6p3G7L_u08A/mqdefault.jpg",
    category: "Reviews",
    year: 2025,
    description:
      "Alpine's first EV is a fun, nimble hot hatch. Does it deliver driving pleasure?",
    youtubeId: "6p3G7L_u08A",
  },

  // ─── Comparisons (10 videos) ────────────────────────────
  {
    id: "36",
    title: "Tesla Model 3 vs BYD Seal – Ultimate Review",
    thumbnail: "https://i.ytimg.com/vi/tezLYZHWkK4/mqdefault.jpg",
    category: "Comparisons",
    year: 2024,
    description:
      "carwow puts the two most popular electric sedans head to head. Which one wins?",
    youtubeId: "tezLYZHWkK4",
  },
  {
    id: "37",
    title: "Hyundai Ioniq 5 vs Kia EV6 – Which Is Best?",
    thumbnail: "https://i.ytimg.com/vi/g5c4bHmgC8s/mqdefault.jpg",
    category: "Comparisons",
    year: 2024,
    description:
      "Same platform, different vibes. carwow compares Hyundai and Kia's best EVs.",
    youtubeId: "g5c4bHmgC8s",
  },
  {
    id: "38",
    title: "Best Electric Cars 2025 – And The Ones To Avoid",
    thumbnail: "https://i.ytimg.com/vi/lO4rVikAslM/mqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "What Car? picks the best and worst electric cars you can buy in 2025.",
    youtubeId: "lO4rVikAslM",
  },
  {
    id: "39",
    title: "BMW iX vs Tesla Model Y – Is The Luxury Worth It?",
    thumbnail: "https://i.ytimg.com/vi/s5ZSPgD7JW4/mqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "Two electric SUVs compared: value, range, performance, and quality.",
    youtubeId: "s5ZSPgD7JW4",
  },
  {
    id: "40",
    title: "Longest Range Electric Cars 2025 – Ranked",
    thumbnail: "https://i.ytimg.com/vi/e802fcRHnAU/mqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "Which electric cars go the furthest on a single charge? The definitive range ranking.",
    youtubeId: "e802fcRHnAU",
  },
  {
    id: "41",
    title: "GT-R NISMO vs 911 Turbo S vs R8 – Drag Race",
    thumbnail: "https://i.ytimg.com/vi/If38HXa9jUA/mqdefault.jpg",
    category: "Comparisons",
    year: 2024,
    description:
      "Three iconic sports cars go head to head in a straight-line drag race.",
    youtubeId: "If38HXa9jUA",
  },
  {
    id: "42",
    title: "BYD vs Tesla – Battle To Be #1",
    thumbnail: "https://i.ytimg.com/vi/JLB3l-5ZvvM/mqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "The EV giants compared brand-wide: tech, value, lineup, and reliability.",
    youtubeId: "JLB3l-5ZvvM",
  },
  {
    id: "43",
    title: "Best EVs On Sale Today – Complete Buyer's Guide",
    thumbnail: "https://i.ytimg.com/vi/qgGRyAjUKKg/mqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "The best electric cars, trucks and SUVs you can buy right now across all budgets.",
    youtubeId: "qgGRyAjUKKg",
  },
  {
    id: "44",
    title: "Toyota GR Corolla vs Honda Civic Type R – Drag Race",
    thumbnail: "https://i.ytimg.com/vi/koxar2licVQ/mqdefault.jpg",
    category: "Comparisons",
    year: 2024,
    description:
      "Two of the hottest hot hatches battle it out in a drag race showdown.",
    youtubeId: "koxar2licVQ",
  },
  {
    id: "45",
    title: "EV Charging Costs: Home vs Public – Explained",
    thumbnail: "https://i.ytimg.com/vi/oUo1aI-pC-g/mqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "How much does it really cost to charge an electric car? Home vs public compared.",
    youtubeId: "oUo1aI-pC-g",
  },

  // ─── Tuning (5 videos) ──────────────────────────────────
  {
    id: "46",
    title: "Building a Toyota Supra Turbo (MKIV)",
    thumbnail: "https://i.ytimg.com/vi/IT_kp7oHKfs/mqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "Watch this iconic Toyota Supra MKIV turbo build come together from start to finish.",
    youtubeId: "IT_kp7oHKfs",
  },
  {
    id: "47",
    title: "R34 GT-R Full Restoration – Better Than Factory",
    thumbnail: "https://i.ytimg.com/vi/gDq8Sq2ZW5k/mqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "A legendary R34 GT-R gets a complete ground-up restoration over 4 months.",
    youtubeId: "gDq8Sq2ZW5k",
  },
  {
    id: "48",
    title: "20 Cheap Mods That Transform Your Car",
    thumbnail: "https://i.ytimg.com/vi/rXj06V6J7iY/mqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "You don't need a big budget to make your car look amazing. Top affordable mods.",
    youtubeId: "rXj06V6J7iY",
  },
  {
    id: "49",
    title: "Liberty Walk BMW M4 Widebody – This Is INSANE",
    thumbnail: "https://i.ytimg.com/vi/4zSzCGXKmas/mqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "A BMW M4 gets the full Liberty Walk widebody treatment. Insane transformation.",
    youtubeId: "4zSzCGXKmas",
  },
  {
    id: "50",
    title: "Tesla Model 3: Top 3 Performance Mods",
    thumbnail: "https://i.ytimg.com/vi/e5sT6HnHZu4/mqdefault.jpg",
    category: "Tuning",
    year: 2024,
    description:
      "Can you tune an electric car? The best performance upgrades for the Model 3.",
    youtubeId: "e5sT6HnHZu4",
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
    image: "https://i.ytimg.com/vi/Z3vN6iH-fEw/mqdefault.jpg",
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
    image: "https://i.ytimg.com/vi/FemVjBnGP3g/mqdefault.jpg",
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
    image: "https://i.ytimg.com/vi/GItH7vwTR6k/mqdefault.jpg",
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
    image: "https://i.ytimg.com/vi/DHRxnTPrzOQ/mqdefault.jpg",
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
    image: "https://i.ytimg.com/vi/a3zBdK4LrX4/mqdefault.jpg",
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
