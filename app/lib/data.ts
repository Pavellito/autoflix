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
  range?: string; // Marketing range (WLTP)
  realWorldRange?: {
    city: string;
    highway: string;
    winter: string; // Critical for Russia/Cold climates
  };
  battery?: string;
  chargingCurve?: {
    maxSpeed: string; // e.g., "250 kW"
    tenToEighty: string; // e.g., "27 mins"
  };
  price?: string; // Base/Global price
  prices?: {
    il: string;
    ru: string;
    us: string;
    ar: string;
  };
  depreciation?: {
    yr3: string; // e.g., "-25%"
    resaleValue: "Excellent" | "Good" | "Average" | "Poor";
  };
  regionalAdvice?: {
    il: string;
    ru: string;
    us: string;
    ar: string;
  };
  image: string;
  relatedVideoIds: string[];
  // Extended data from FuelEconomy.gov / NHTSA (on-demand enrichment)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  externalData?: Record<string, any>;
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
    thumbnail: "https://i.ytimg.com/vi/IFP1c5QZkA8/mqdefault.jpg",
    category: "Trending",
    year: 2025,
    description:
      "BMW's Neue Klasse platform debuts with the iX3. Is it good enough?",
    youtubeId: "IFP1c5QZkA8",
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
    thumbnail: "https://i.ytimg.com/vi/z_3F98XIIKA/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "MKBHD reviews the refreshed Tesla Model 3 Highland. Better interior, improved range.",
    youtubeId: "z_3F98XIIKA",
  },
  {
    id: "12",
    title: "BYD Dolphin – The Best Cheap EV?",
    thumbnail: "https://i.ytimg.com/vi/hFNE51tURBU/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Is the BYD Dolphin the best budget electric car on the market right now?",
    youtubeId: "hFNE51tURBU",
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
    thumbnail: "https://i.ytimg.com/vi/Ca8QypN-fYA/mqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description:
      "Hyundai's gorgeous streamliner with fast charging and incredible efficiency reviewed.",
    youtubeId: "Ca8QypN-fYA",
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
    thumbnail: "https://i.ytimg.com/vi/uH_JcnrkElY/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "The refreshed Mazda MX-5 Miata reviewed by Throttle House. Still pure driving joy.",
    youtubeId: "uH_JcnrkElY",
  },
  {
    id: "28",
    title: "Porsche 911 GT3 RS – Basically a Race Car",
    thumbnail: "https://i.ytimg.com/vi/usQiSjKFaso/mqdefault.jpg",
    category: "Reviews",
    year: 2024,
    description:
      "carwow takes the Porsche 911 GT3 RS to its absolute limits. Full review.",
    youtubeId: "usQiSjKFaso",
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
    thumbnail: "https://i.ytimg.com/vi/VLTm4STELVU/mqdefault.jpg",
    category: "Comparisons",
    year: 2025,
    description:
      "How much does it really cost to charge an electric car? Home vs public compared.",
    youtubeId: "VLTm4STELVU",
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
    realWorldRange: {
      city: "490 km",
      highway: "375 km",
      winter: "310 km",
    },
    battery: "60 kWh",
    chargingCurve: {
      maxSpeed: "170 kW",
      tenToEighty: "25 mins",
    },
    price: "From $38,990",
    prices: {
      il: "₪210,000",
      ru: "4,200,000 ₽",
      us: "$38,990",
      ar: "146,000 SAR",
    },
    depreciation: {
      yr3: "-35%",
      resaleValue: "Excellent",
    },
    regionalAdvice: {
      il: "Perfect for Israel's distances; extensive Supercharger network in the center and south. Excellent resale demand.",
      ru: "Requires heated garage in winter (drops to 310km range); check CCS2 adapter availability for local stations.",
      us: "Eligible for federal tax credits; best value EV on the US market today.",
      ar: "Heat-resistant battery tech performs well; Service centers readily available in Riyadh and Dubai.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/9/91/2019_Tesla_Model_3_Performance_AWD_Front.jpg",
    relatedVideoIds: ["11", "36", "50"],
  },
  {
    id: "car-2",
    name: "BYD Atto 3",
    brand: "BYD",
    type: "EV",
    range: "420 km",
    realWorldRange: {
      city: "380 km",
      highway: "290 km",
      winter: "270 km",
    },
    battery: "60.5 kWh",
    chargingCurve: {
      maxSpeed: "88 kW",
      tenToEighty: "44 mins",
    },
    price: "From $38,000",
    prices: {
      il: "₪168,500",
      ru: "3,500,000 ₽",
      us: "N/A (Import only)",
      ar: "135,000 SAR",
    },
    depreciation: {
      yr3: "-42%",
      resaleValue: "Good",
    },
    regionalAdvice: {
      il: "The absolute best-selling EV in Israel. Unbeatable value, massive local supply chain, and strong resale market.",
      ru: "Gaining immense popularity via parallel import; software localized to Russian is widely available.",
      us: "Not officially sold in the US; high import tariffs and no service network.",
      ar: "Blade Battery tech handles extreme GCC heat exceptionally well; rapidly growing service network.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3e/BYD_Atto_3_1X7A6491.jpg",
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
    prices: {
      il: "₪215,000",
      ru: "4,800,000 ₽",
      us: "$41,800",
      ar: "165,000 SAR",
    },
    regionalAdvice: {
      il: "Fastest charging in Israel (800V); uses 350kW chargers at Afek and roadside stations.",
      ru: "E-GMP platform performs well in cold; heat pump is standard on most trims.",
      us: "Solid range and retro-future design; widely available at Hyundai dealers.",
      ar: "Standard V2L feature is great for desert camping; fast AC charging for home use.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Hyundai_Ioniq_5_AWD_Techniq-Paket_%E2%80%93_f_31122024.jpg",
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
    prices: {
      il: "₪210,000",
      ru: "4,600,000 ₽",
      us: "N/A",
      ar: "175,000 SAR",
    },
    regionalAdvice: {
      il: "The 'Tesla Killer' of the Israeli market; premium interior at a competitive price.",
      ru: "All-wheel drive versions are popular for year-round stability in snowy regions.",
      us: "Competitive specs but currently limited by trade restrictions.",
      ar: "Intelligent thermal management keeps the cabin cool in GCC summer peaks.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/6/60/2022_BYD_Seal.jpg",
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
    prices: {
      il: "₪235,000",
      ru: "5,500,000 ₽",
      us: "$44,990",
      ar: "190,000 SAR",
    },
    regionalAdvice: {
      il: "The gold standard for family EVs in Israel; massive trunk space for local trips.",
      ru: "Check for European spec (CCS2) vs US spec (NACS) before buying locally.",
      us: "Best selling car in the world for a reason; unmatched software and charging.",
      ar: "White interior recommended for GCC sunshine; Glass roof handles heat well.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/3/3d/2024_Tesla_Model_Y_RWD_front.jpg",
    relatedVideoIds: ["1", "2", "39"],
  },
  {
    id: "car-6",
    name: "MG4 Electric",
    brand: "MG",
    type: "EV",
    range: "435 km",
    battery: "64 kWh",
    price: "From $34,000",
    prices: {
      il: "₪158,888",
      ru: "3,200,000 ₽",
      us: "$34,000",
      ar: "128,000 SAR",
    },
    regionalAdvice: {
      il: "Best value hatchback in Israel; high demand for city and long distance.",
      ru: "Compact and efficient; gaining attention via official import channels.",
      us: "Affordable alternative but limited dealer network.",
      ar: "Compact size makes it a great secondary city car for GCC families.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/1/12/MG4_Electric_%E2%80%93_f_21042025.jpg",
    relatedVideoIds: ["10", "15"],
  },
  {
    id: "car-7",
    name: "Volvo EX30",
    brand: "Volvo",
    type: "EV",
    range: "480 km",
    battery: "69 kWh",
    price: "From $36,245",
    prices: {
      il: "₪189,900",
      ru: "4,500,000 ₽",
      us: "$36,245",
      ar: "145,000 SAR",
    },
    regionalAdvice: {
      il: "The trendiest compact SUV in Israel right now; premium safety at a lower tax bracket.",
      ru: "Handles snow exceptionally well; high demand for parallel imports from Europe.",
      us: "Volvo's entry-level EV; small size but premium minimalist interior.",
      ar: "High-quality AC system; great for urban premium lifestyles in Dubai/Riyadh.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Volvo_EX30_IMG_8923.jpg",
    relatedVideoIds: ["5", "18"],
  },
  {
    id: "car-8",
    name: "Kia EV6",
    brand: "Kia",
    type: "EV",
    range: "528 km",
    battery: "77.4 kWh",
    price: "From $48,500",
    prices: {
      il: "₪249,000",
      ru: "5,800,000 ₽",
      us: "$48,500",
      ar: "195,000 SAR",
    },
    regionalAdvice: {
      il: "Unbeatable 800V charging speed; perfect for long trips from Metula to Eilat.",
      ru: "Very stable battery in freezing temps; high resale value among Korean imports.",
      us: "Top-tier electric crossover; rivals the Model Y in tech and charging speed.",
      ar: "Futuristic design stands out; massive dealership support across the Middle East.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/2021_Kia_EV6_GT-Line_S.jpg",
    relatedVideoIds: ["3", "27"],
  },
  {
    id: "car-9",
    name: "Hyundai Ioniq 6",
    brand: "Hyundai",
    type: "EV",
    range: "614 km",
    battery: "77.4 kWh",
    price: "From $42,450",
    prices: {
      il: "₪219,900",
      ru: "5,200,000 ₽",
      us: "$42,450",
      ar: "170,000 SAR",
    },
    regionalAdvice: {
      il: "The king of efficiency in Israel; highest range for the price.",
      ru: "Sleek aerodynamics make it great for highway efficiency; high-tech interior.",
      us: "One of the best long-distance cruisers; exceptional drag coefficient.",
      ar: "Cools down very quickly due to smart aerodynamics; great for luxury commutes.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/9/96/2023_Hyundai_Ioniq_6_Limited%2C_front_4.27.23.jpg",
    relatedVideoIds: ["24", "41"],
  },
  {
    id: "car-10",
    name: "Ford Mustang Mach-E",
    brand: "Ford",
    type: "EV",
    range: "490 km",
    battery: "91 kWh",
    price: "From $45,995",
    prices: {
      il: "₪285,000",
      ru: "6,800,000 ₽",
      us: "$45,995",
      ar: "215,000 SAR",
    },
    regionalAdvice: {
      il: "Muscular American design with great local dealer support; very fun to drive.",
      ru: "Solid performance in cold; the 'pony' badge has a strong following locally.",
      us: "Practical family crossover with the soul of a Mustang; great blue cruise tech.",
      ar: "High-spec interior stays premium in heat; iconic design for the GCC streets.",
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/4/49/2021_Ford_Mustang_Mach-E_Standard_Range_Front.jpg",
    relatedVideoIds: ["7", "33"],
  },
  {
    id: "car-11",
    name: "Porsche Taycan Turbo GT",
    brand: "Porsche",
    type: "EV",
    range: "555 km",
    battery: "105 kWh",
    price: "From $230,000",
    prices: { il: "₪1,200,000", ru: "25,000,000 ₽", us: "$230,000", ar: "865,000 SAR" },
    regionalAdvice: { il: "The ultimate status symbol EV in Tel Aviv.", ru: "Low ground clearance makes it tough for deep snow.", us: "The fastest 4-door EV on the planet.", ar: "Top-tier AC and sustained high-speed performance." },
    image: "https://upload.wikimedia.org/wikipedia/commons/d/dc/2020_Porsche_Taycan_4S_79kWh_Front.jpg",
    relatedVideoIds: ["4", "28"]
  },
  {
    id: "car-12",
    name: "Audi Q8 e-tron",
    brand: "Audi",
    type: "EV",
    range: "582 km",
    battery: "114 kWh",
    price: "From $74,400",
    prices: { il: "₪520,000", ru: "12,000,000 ₽", us: "$74,400", ar: "320,000 SAR" },
    regionalAdvice: { il: "Silent, massive, and luxurious for family trips.", ru: "Heavy with great AWD Quattro traction.", us: "Combines legacy luxury with electric efficiency.", ar: "Huge road presence and premium interior." },
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/2020_Audi_e-Tron_Sport_50_Quattro.jpg",
    relatedVideoIds: ["20", "38"]
  },
  {
    id: "car-13",
    name: "Mercedes EQS",
    brand: "Mercedes",
    type: "EV",
    range: "717 km",
    battery: "118 kWh",
    price: "From $104,400",
    prices: { il: "₪850,000", ru: "18,000,000 ₽", us: "$104,400", ar: "550,000 SAR" },
    regionalAdvice: { il: "The Electric S-Class. Huge range.", ru: "AWD available. Needs heated garage for battery care.", us: "The aerodynamics king of highway cruising.", ar: "Flagship luxury with an aggressive AC system." },
    image: "https://upload.wikimedia.org/wikipedia/commons/e/ef/Mercedes-Benz_V297_Classic-Days_2022_DSC_0016.jpg",
    relatedVideoIds: ["17", "32"]
  },
  {
    id: "car-14",
    name: "Rivian R1S",
    brand: "Rivian",
    type: "EV",
    range: "643 km",
    battery: "135 kWh",
    price: "From $74,900",
    prices: { il: "N/A", ru: "14,000,000 ₽ (Import)", us: "$74,900", ar: "350,000 SAR (Import)" },
    regionalAdvice: { il: "Very rare import, heavy taxation applies.", ru: "Excellent off-roader for serious winter terrain.", us: "The ultimate outdoor adventure family SUV.", ar: "Massive presence and great dune bashing potential." },
    image: "https://upload.wikimedia.org/wikipedia/commons/8/89/2023_Rivian_R1S_Adventure%2C_front_1.29.23.jpg",
    relatedVideoIds: ["15", "10"]
  },
  {
    id: "car-15",
    name: "Polestar 2",
    brand: "Polestar",
    type: "EV",
    range: "654 km",
    battery: "82 kWh",
    price: "From $49,900",
    prices: { il: "₪245,000", ru: "5,500,000 ₽", us: "$49,900", ar: "195,000 SAR" },
    regionalAdvice: { il: "A sportier alternative to the Model 3 with Android built-in.", ru: "Volvo DNA makes it fantastic in the snow.", us: "Great lease deals often available.", ar: "Unique styling that stands out." },
    image: "https://upload.wikimedia.org/wikipedia/commons/c/ca/Polestar_2_%E2%80%93_f_02042021.jpg",
    relatedVideoIds: ["18", "38"]
  },
  {
    id: "car-16",
    name: "Zeekr 7X",
    brand: "Zeekr",
    type: "EV",
    range: "605 km",
    realWorldRange: { city: "550 km", highway: "460 km", winter: "410 km" },
    battery: "100 kWh",
    chargingCurve: { maxSpeed: "500 kW", tenToEighty: "11 mins" },
    price: "From $33,500 (China Base)",
    prices: { il: "N/A (Expected 2025)", ru: "5,800,000 ₽", us: "N/A", ar: "145,000 SAR" },
    depreciation: { yr3: "-40%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "Highly anticipated family SUV; wait for official importer launch for warranty.", 
      ru: "800V architecture makes it incredible for winter charging speeds. Major parallel import favorite.", 
      us: "Geely brands face 100% tariffs; will not enter the US market.", 
      ar: "Luxury alternative to Tesla Model Y with far superior interior quality for the GCC heat." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/4/47/Zeekr_7X_001.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-17",
    name: "Xiaomi SU7",
    brand: "Xiaomi",
    type: "EV",
    range: "800 km",
    realWorldRange: { city: "710 km", highway: "580 km", winter: "500 km" },
    battery: "101 kWh",
    chargingCurve: { maxSpeed: "350 kW", tenToEighty: "15 mins" },
    price: "From $29,900 (China Base)",
    prices: { il: "N/A", ru: "6,500,000 ₽", us: "N/A", ar: "185,000 SAR (Import)" },
    depreciation: { yr3: "-35%", resaleValue: "Excellent" },
    regionalAdvice: { 
      il: "Not officially imported yet, extremely high hype.", 
      ru: "The hottest parallel import car of the year. Porsche Taycan killer.", 
      us: "Smartphone integration is unparalleled but totally banned in the US.", 
      ar: "Hypercar acceleration with the intelligence of a smartphone. A tech-lovers dream in Dubai." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Xiaomi_SU7_Max_007.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-18",
    name: "Zeekr 001",
    brand: "Zeekr",
    type: "EV",
    range: "620 km",
    realWorldRange: { city: "530 km", highway: "440 km", winter: "390 km" },
    battery: "100 kWh",
    chargingCurve: { maxSpeed: "200 kW", tenToEighty: "28 mins" },
    price: "From $55,000",
    prices: { il: "₪270,000", ru: "6,000,000 ₽", us: "N/A", ar: "220,000 SAR" },
    depreciation: { yr3: "-45%", resaleValue: "Average" },
    regionalAdvice: { 
      il: "The premier luxury shooting brake. Superior ride quality over Model Y.", 
      ru: "One of the most popular premium EVs. Air suspension handles bad roads perfectly.", 
      us: "Geely's masterpiece, sadly unavailable in North America.", 
      ar: "Aggressive styling and incredibly opulent interior for the Saudi market." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/0/0a/2022_Zeekr_001_%28front%29.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-19",
    name: "Xpeng G9",
    brand: "Xpeng",
    type: "EV",
    range: "570 km",
    realWorldRange: { city: "510 km", highway: "410 km", winter: "360 km" },
    battery: "98 kWh",
    chargingCurve: { maxSpeed: "300 kW", tenToEighty: "20 mins" },
    price: "From $65,000",
    prices: { il: "₪290,000", ru: "7,000,000 ₽", us: "N/A", ar: "240,000 SAR" },
    depreciation: { yr3: "-42%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "Ultra-fast charging 800V architecture makes road trips across the country a breeze.", 
      ru: "Luxury SUV with great cold weather battery management system.", 
      us: "Unavailable.", 
      ar: "Incredible ADAS (Advanced Driver Assistance) and top-tier massage seats." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7f/2022_XPeng_G9_%28front%29.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-20",
    name: "NIO ET7",
    brand: "NIO",
    type: "EV",
    range: "700 km",
    realWorldRange: { city: "620 km", highway: "500 km", winter: "430 km" },
    battery: "100 kWh",
    chargingCurve: { maxSpeed: "130 kW", tenToEighty: "40 mins" },
    price: "From $70,000",
    prices: { il: "N/A", ru: "8,500,000 ₽", us: "N/A", ar: "300,000 SAR (Import)" },
    depreciation: { yr3: "-50%", resaleValue: "Poor" },
    regionalAdvice: { 
      il: "Battery swapping network not deployed in Israel, somewhat defeating the purpose.", 
      ru: "High luxury executive sedan. No battery swap stations in RU, so relies on slow charging.", 
      us: "Unavailable in the US market.", 
      ar: "Pinnacle of Chinese EV luxury sedans. NOMI digital assistant is highly advanced." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/7/70/NIO_ET7_1X7A6679_%28cropped%29.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-21",
    name: "Lucid Air Grand Touring",
    brand: "Lucid",
    type: "EV",
    range: "830 km",
    realWorldRange: { city: "780 km", highway: "690 km", winter: "600 km" },
    battery: "112 kWh",
    chargingCurve: { maxSpeed: "300 kW", tenToEighty: "21 mins" },
    price: "From $109,900",
    prices: { il: "N/A", ru: "16,000,000 ₽", us: "$109,900", ar: "450,000 SAR" },
    depreciation: { yr3: "-55%", resaleValue: "Poor" },
    regionalAdvice: { 
      il: "Not officially imported. Extremely expensive to service locally.", 
      ru: "Exotic and highly complex. Winter drastically affects the massive range.", 
      us: "The absolute king of EV range and motor efficiency. Nothing comes close.", 
      ar: "Backed by the Saudi PIF. Excellent availability and service network in KSA." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/b/be/Lucid_Air.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-22",
    name: "Geely Galaxy E8",
    brand: "Geely",
    type: "EV",
    range: "665 km",
    realWorldRange: { city: "600 km", highway: "510 km", winter: "450 km" },
    battery: "76 kWh",
    chargingCurve: { maxSpeed: "150 kW", tenToEighty: "28 mins" },
    price: "From $25,000 (China Base)",
    prices: { il: "₪170,000", ru: "3,800,000 ₽", us: "N/A", ar: "120,000 SAR" },
    depreciation: { yr3: "-38%", resaleValue: "Average" },
    regionalAdvice: { 
      il: "Massive 45-inch 8K screen inside. Serious rival to BYD Seal.", 
      ru: "A beautiful, aerodynamic sedan that handles snow remarkably well for an RWD.", 
      us: "Unavailable.", 
      ar: "Stunning drag coefficient (0.199 Cd) makes it hyper-efficient on long desert highways." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Geely_Galaxy_logo_%28Chinese%2C_vertical%29.svg",
    relatedVideoIds: []
  },
  {
    id: "car-23",
    name: "Ford Mustang Mach-E",
    brand: "Ford",
    type: "EV",
    range: "470 km",
    realWorldRange: { city: "420 km", highway: "350 km", winter: "280 km" },
    battery: "91 kWh",
    chargingCurve: { maxSpeed: "150 kW", tenToEighty: "45 mins" },
    price: "From $42,995",
    prices: { il: "₪265,000", ru: "6,500,000 ₽ (Import)", us: "$42,995", ar: "210,000 SAR" },
    depreciation: { yr3: "-48%", resaleValue: "Average" },
    regionalAdvice: { 
      il: "Great driving dynamics but faces stiff pricing competition from Chinese rivals.", 
      ru: "Heavy import tariffs apply. Winter range drop is significant.", 
      us: "Direct Model Y competitor. Excellent BlueCruise hands-free highway driving.", 
      ar: "Muscle car heritage with an EV twist. Solid ride quality." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/4/49/2021_Ford_Mustang_Mach-E_Standard_Range_Front.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-24",
    name: "Volkswagen ID.4",
    brand: "Volkswagen",
    type: "EV",
    range: "510 km",
    realWorldRange: { city: "480 km", highway: "390 km", winter: "320 km" },
    battery: "77 kWh",
    chargingCurve: { maxSpeed: "135 kW", tenToEighty: "33 mins" },
    price: "From $39,735",
    prices: { il: "₪215,000", ru: "4,000,000 ₽ (Crozz Import)", us: "$39,735", ar: "150,000 SAR" },
    depreciation: { yr3: "-40%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "European build quality. Very popular among traditional car buyers.", 
      ru: "ID.4 Crozz (China assembled) dominates the parallel import market.", 
      us: "Comfortable, quiet commuter SUV. Software is occasionally buggy.", 
      ar: "Highly reliable A-to-B family hauler with strong local parts availability." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/5/55/2025_Volkswagen_ID4_Pro_Redspot_front.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-25",
    name: "Nissan Ariya",
    brand: "Nissan",
    type: "EV",
    range: "530 km",
    realWorldRange: { city: "490 km", highway: "400 km", winter: "340 km" },
    battery: "87 kWh",
    chargingCurve: { maxSpeed: "130 kW", tenToEighty: "35 mins" },
    price: "From $43,190",
    prices: { il: "₪240,000", ru: "5,200,000 ₽", us: "$43,190", ar: "185,000 SAR" },
    depreciation: { yr3: "-35%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "Lounge-like interior. Beautiful Japanese minimalism.", 
      ru: "e-4ORCE AWD system is legendary in thick snow.", 
      us: "A massive step up from the Leaf. Extremely luxurious ride.", 
      ar: "Exceptional AC performance and incredibly quiet cabin isolation." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/e/eb/Nissan_Ariya_e-4ORCE_Evolve_Pack_%E2%80%93_f_31122024.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-26",
    name: "MG4 XPower",
    brand: "MG",
    type: "EV",
    range: "385 km",
    realWorldRange: { city: "340 km", highway: "280 km", winter: "220 km" },
    battery: "64 kWh",
    chargingCurve: { maxSpeed: "140 kW", tenToEighty: "26 mins" },
    price: "From $45,000",
    prices: { il: "₪175,000", ru: "3,500,000 ₽", us: "N/A", ar: "130,000 SAR" },
    depreciation: { yr3: "-50%", resaleValue: "Poor" },
    regionalAdvice: { 
      il: "Ferrari-level acceleration (0-100 in 3.8s) for the price of a standard crossover.", 
      ru: "Fun dual-motor sleeper. Harsh suspension on broken winter roads.", 
      us: "Unavailable.", 
      ar: "Incredible cheap thrills, though the range is quite poor under heavy throttle." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/1/12/MG4_Electric_%E2%80%93_f_21042025.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-27",
    name: "BYD Seal",
    brand: "BYD",
    type: "EV",
    range: "570 km",
    realWorldRange: { city: "520 km", highway: "410 km", winter: "360 km" },
    battery: "82.5 kWh",
    chargingCurve: { maxSpeed: "150 kW", tenToEighty: "37 mins" },
    price: "From $45,000",
    prices: { il: "₪210,000", ru: "5,500,000 ₽", us: "N/A", ar: "185,000 SAR" },
    depreciation: { yr3: "-38%", resaleValue: "Excellent" },
    regionalAdvice: { 
      il: "The primary Tesla Model 3 rival in Israel. Better interior and build quality, but charging network is standard CCS.", 
      ru: "One of the most popular luxury sedans from BYD. High demand in Moscow.", 
      us: "Unavailable due to tariffs.", 
      ar: "CTB (Cell-to-Body) technology makes it feel incredibly rigid and safe on high-speed highways." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/6/60/2022_BYD_Seal.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-28",
    name: "Kia EV6",
    brand: "Kia",
    type: "EV",
    range: "528 km",
    realWorldRange: { city: "480 km", highway: "370 km", winter: "310 km" },
    battery: "77.4 kWh",
    chargingCurve: { maxSpeed: "240 kW", tenToEighty: "18 mins" },
    price: "From $42,600",
    prices: { il: "₪245,000", ru: "6,000,000 ₽", us: "$42,600", ar: "210,000 SAR" },
    depreciation: { yr3: "-40%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "V2L (Vehicle-to-Load) is a killer feature for camping in the Galilee. Fast charging is unmatched.", 
      ru: "Aggressive styling and solid AWD performance for slippery roads.", 
      us: "Built on the same E-GMP platform as the Ioniq 5. Stunning futuristic looks.", 
      ar: "Excellent reliability record in the GCC. Futuristic design stands out in Dubai traffic." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d9/2021_Kia_EV6_GT-Line_S.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-29",
    name: "Hyundai Ioniq 5",
    brand: "Hyundai",
    type: "EV",
    range: "507 km",
    realWorldRange: { city: "460 km", highway: "350 km", winter: "290 km" },
    battery: "77.4 kWh",
    chargingCurve: { maxSpeed: "233 kW", tenToEighty: "18 mins" },
    price: "From $41,450",
    prices: { il: "₪220,000", ru: "5,800,000 ₽", us: "$41,450", ar: "195,000 SAR" },
    depreciation: { yr3: "-35%", resaleValue: "Excellent" },
    regionalAdvice: { 
      il: "One of Israel's favorite family EVs. Spacious interior feels like a lounge.", 
      ru: "AWD versions are very capable in winter. Retro-modern look is very popular.", 
      us: "Fastest charging in its class. Huge US tax credit eligibility for US-made units.", 
      ar: "Iconic design and very comfortable seats for long weekend drives from Riyadh." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/8/85/Hyundai_Ioniq_5_AWD_Techniq-Paket_%E2%80%93_f_31122024.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-30",
    name: "BMW i4 eDrive40",
    brand: "BMW",
    type: "EV",
    range: "590 km",
    realWorldRange: { city: "530 km", highway: "440 km", winter: "380 km" },
    battery: "83.9 kWh",
    chargingCurve: { maxSpeed: "205 kW", tenToEighty: "31 mins" },
    price: "From $57,300",
    prices: { il: "₪360,000", ru: "9,000,000 ₽", us: "$57,300", ar: "310,000 SAR" },
    depreciation: { yr3: "-45%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "The best driving range for a German luxury sedan in this price bracket.", 
      ru: "Classic BMW handling with electric torque. Great prestige in all cities.", 
      us: "Excellent lease deals often available. Feels like a real BMW, not a gadget.", 
      ar: "High-speed stability on the highway is typical German excellence. AC is robust." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ad/BMW_i4_IMG_6695.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-31",
    name: "Mercedes EQE Sedan",
    brand: "Mercedes",
    type: "EV",
    range: "613 km",
    realWorldRange: { city: "560 km", highway: "480 km", winter: "410 km" },
    battery: "90 kWh",
    chargingCurve: { maxSpeed: "170 kW", tenToEighty: "32 mins" },
    price: "From $74,900",
    prices: { il: "₪510,000", ru: "11,500,000 ₽", us: "$74,900", ar: "380,000 SAR" },
    depreciation: { yr3: "-52%", resaleValue: "Average" },
    regionalAdvice: { 
      il: "Incredible interior luxury and massive range for cross-country executive travel.", 
      ru: "Needs the HEPA filter option for Moscow's air. Fantastic ride quality.", 
      us: "Junior EQS. Great tech-heavy luxury experience.", 
      ar: "Unmatched cabin isolation and premium materials for a quiet commute." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cb/Mercedes-Benz_V295_350%2B_Classic-Days_2022_DSC_0018.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-32",
    name: "Rivian R1T",
    brand: "Rivian",
    type: "EV",
    range: "643 km",
    realWorldRange: { city: "590 km", highway: "480 km", winter: "410 km" },
    battery: "135 kWh",
    chargingCurve: { maxSpeed: "220 kW", tenToEighty: "35 mins" },
    price: "From $69,900",
    prices: { il: "N/A", ru: "15,000,000 ₽ (Import)", us: "$69,900", ar: "360,000 SAR" },
    depreciation: { yr3: "-40%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "None officially. Very expensive to grey-import.", 
      ru: "A status symbol monster SUV. Quad-motor version is insane in heavy snow.", 
      us: "The best electric truck ever made. Better than the F-150 Lightning for enthusiasts.", 
      ar: "Perfect for dune bashing. The 'Tank Turn' (now legacy) was a legend in Riyadh." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/e/e1/2022_Rivian_R1T_%28in_Glacier_White%29%2C_front_6.21.22.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-33",
    name: "NIO ES8 (EL8)",
    brand: "NIO",
    type: "EV",
    range: "580 km",
    realWorldRange: { city: "510 km", highway: "420 km", winter: "350 km" },
    battery: "100 kWh",
    chargingCurve: { maxSpeed: "125 kW", tenToEighty: "45 mins" },
    price: "From $75,000",
    prices: { il: "N/A", ru: "9,500,000 ₽", us: "N/A", ar: "330,000 SAR" },
    depreciation: { yr3: "-55%", resaleValue: "Poor" },
    regionalAdvice: { 
      il: "Battery swap model is great in Norway, but in Israel, it's just a regular SUV.", 
      ru: "King of Chinese premium SUVs in Moscow. Huge luxury inside.", 
      us: "Unavailable.", 
      ar: "Luxurious 6-seater that rivals the BMW X7 for interior comfort." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/2/29/%28CHN-Jiangsu%29_Showcar_Nio_ES8_No-plate_2025-12-20.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-34",
    name: "NIO ET5",
    brand: "NIO",
    type: "EV",
    range: "590 km",
    realWorldRange: { city: "530 km", highway: "440 km", winter: "380 km" },
    battery: "75 kWh",
    chargingCurve: { maxSpeed: "140 kW", tenToEighty: "30 mins" },
    price: "From $45,000",
    prices: { il: "N/A", ru: "5,500,000 ₽", us: "N/A", ar: "185,000 SAR" },
    depreciation: { yr3: "-45%", resaleValue: "Average" },
    regionalAdvice: { 
      il: "None officially. Battery swap is its main advantage elsewhere.", 
      ru: "Compact luxury sedan that's becoming a common sight in Moscow.", 
      us: "Unavailable.", 
      ar: "Beautiful, sleek alternative to the Tesla Model 3 with a more premium interior." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/7/7b/NIO_ET5_IMG_8291.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-35",
    name: "Xpeng P7",
    brand: "Xpeng",
    type: "EV",
    range: "576 km",
    realWorldRange: { city: "520 km", highway: "410 km", winter: "350 km" },
    battery: "80 kWh",
    chargingCurve: { maxSpeed: "175 kW", tenToEighty: "28 mins" },
    price: "From $48,000",
    prices: { il: "₪210,000", ru: "4,800,000 ₽", us: "N/A", ar: "175,000 SAR" },
    depreciation: { yr3: "-42%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "One of the first Chinese premium sedans to arrive in Israel. Very popular.", 
      ru: "Stunning design and solid tech. Excellent value for money.", 
      us: "Unavailable.", 
      ar: "Scissor-door version (P7 Wing) is a head-turner in Dubai." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/0/06/XPeng_P7_II_MY2025_IMG03.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-36",
    name: "BYD Han",
    brand: "BYD",
    type: "EV",
    range: "605 km",
    realWorldRange: { city: "550 km", highway: "460 km", winter: "400 km" },
    battery: "85.4 kWh",
    chargingCurve: { maxSpeed: "120 kW", tenToEighty: "40 mins" },
    price: "From $60,000 (Global)",
    prices: { il: "₪310,000", ru: "6,500,000 ₽", us: "N/A", ar: "250,000 SAR" },
    depreciation: { yr3: "-40%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "The executive sedan from BYD. Rivals the Tesla Model S for significantly less money.", 
      ru: "Luxurious, comfortable, and AWD performance for year-round driving.", 
      us: "Unavailable.", 
      ar: "Palatial interior and incredibly quiet ride quality." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/a/ab/2023_BYD_Han_DM-i_%28facelift%29%2C_front_8.17.23.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-37",
    name: "BYD Tang",
    brand: "BYD",
    type: "EV",
    range: "528 km",
    realWorldRange: { city: "480 km", highway: "370 km", winter: "310 km" },
    battery: "108.8 kWh",
    chargingCurve: { maxSpeed: "170 kW", tenToEighty: "30 mins" },
    price: "From $72,000",
    prices: { il: "₪325,000", ru: "7,500,000 ₽", us: "N/A", ar: "280,000 SAR" },
    depreciation: { yr3: "-42%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "Powerful 7-seater SUV. Great for larger families wanting to go electric.", 
      ru: "AWD tank that handles snow with ease. One of the best 7-seat EVs.", 
      us: "Unavailable.", 
      ar: "Massive road presence and premium seating for the whole family." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/b/bb/BYD_Tang_DM-p_front_quarter_trimmed_2.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-38",
    name: "MG ZS EV",
    brand: "MG",
    type: "EV",
    range: "440 km",
    realWorldRange: { city: "400 km", highway: "300 km", winter: "260 km" },
    battery: "72.6 kWh",
    chargingCurve: { maxSpeed: "94 kW", tenToEighty: "42 mins" },
    price: "From $35,000",
    prices: { il: "₪158,000", ru: "3,200,000 ₽", us: "N/A", ar: "125,000 SAR" },
    depreciation: { yr3: "-35%", resaleValue: "Excellent" },
    regionalAdvice: { 
      il: "The car that started the EV revolution in Israel. Unbeatable value and support.", 
      ru: "Reliable, simple, and well-supported by many service centers.", 
      us: "Unavailable.", 
      ar: "Great entry-level EV for city commuting in Riyadh or Jeddah." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/c/cf/MG_ZS_%28crossover%2C_second_generation%29_DSC_8542.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-39",
    name: "GWM Ora 03 (Good Cat)",
    brand: "GWM",
    type: "EV",
    range: "420 km",
    realWorldRange: { city: "380 km", highway: "280 km", winter: "240 km" },
    battery: "63 kWh",
    chargingCurve: { maxSpeed: "67 kW", tenToEighty: "46 mins" },
    price: "From $32,000",
    prices: { il: "₪145,000", ru: "2,800,000 ₽", us: "N/A", ar: "115,000 SAR" },
    depreciation: { yr3: "-40%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "Retro-chic styling and a surprising amount of tech for the price.", 
      ru: "Fun city car that turns heads. Interior is surprisingly premium.", 
      us: "Unavailable.", 
      ar: "Unique design makes it a favorite among younger drivers in the region." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/1/1c/GWM_Ora_03_%E2%80%93_f_12102025.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-40",
    name: "Audi e-tron GT",
    brand: "Audi",
    type: "EV",
    range: "488 km",
    realWorldRange: { city: "440 km", highway: "360 km", winter: "310 km" },
    battery: "93.4 kWh",
    chargingCurve: { maxSpeed: "270 kW", tenToEighty: "22 mins" },
    price: "From $106,500",
    prices: { il: "₪780,000", ru: "14,000,000 ₽", us: "$106,500", ar: "490,000 SAR" },
    depreciation: { yr3: "-50%", resaleValue: "Average" },
    regionalAdvice: { 
      il: "One of the most beautiful cars on Israeli roads, period.", 
      ru: "AWD precision and stunning presence. Perfect for the luxury segment.", 
      us: "Share's the Taycan's DNA. One of the best looking EVs in America.", 
      ar: "Sustained high-speed performance and incredible road handling." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Audi_e-tron_GT_IMG_5689.jpg",
    relatedVideoIds: []
  },
  {
    id: "car-41",
    name: "BMW iX xDrive50",
    brand: "BMW",
    type: "EV",
    range: "630 km",
    realWorldRange: { city: "580 km", highway: "490 km", winter: "430 km" },
    battery: "111.5 kWh",
    chargingCurve: { maxSpeed: "195 kW", tenToEighty: "35 mins" },
    price: "From $87,100",
    prices: { il: "₪590,000", ru: "11,000,000 ₽", us: "$87,100", ar: "420,000 SAR" },
    depreciation: { yr3: "-45%", resaleValue: "Good" },
    regionalAdvice: { 
      il: "The ultimate electric luxury SUV. Range is phenomenal for its size.", 
      ru: "Massive interior and ultra-luxurious feel. Great AWD for all seasons.", 
      us: "BMW's electric flagship. Best interior of any BMW today.", 
      ar: "Commanding road presence and exceptional cooling performance." 
    },
    image: "https://upload.wikimedia.org/wikipedia/commons/b/b2/BMW_iX_IAA_2021_1X7A0204.jpg",
    relatedVideoIds: []
  }
];

export function getCarById(id: string): Car | undefined {
  return cars.find((c) => c.id === id);
}

export function getRelatedVideosForCar(car: Car): Video[] {
  return car.relatedVideoIds
    .map((vid) => getVideoById(vid))
    .filter((v): v is Video => v !== undefined);
}
