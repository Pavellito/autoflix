export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  category: string;
  year: number;
  description: string;
  youtubeId: string;
}

export const videos: Video[] = [
  // Electric Cars
  {
    id: "1",
    title: "Tesla Model 3 Highland – Full Review",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description: "Complete review of the refreshed Tesla Model 3 Highland with all the new features.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "BYD Dolphin – Best Budget EV?",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description: "Is the BYD Dolphin the best affordable electric car on the market?",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "3",
    title: "BMW iX – Luxury Electric SUV",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description: "BMW's flagship electric SUV reviewed in detail.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "4",
    title: "Hyundai Ioniq 6 – Design Revolution",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description: "The aerodynamic Hyundai Ioniq 6 streamliner reviewed.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "5",
    title: "Rivian R1S – Adventure Electric SUV",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Electric Cars",
    year: 2024,
    description: "Off-road capable electric SUV from Rivian.",
    youtubeId: "dQw4w9WgXcQ",
  },
  // Car Reviews
  {
    id: "6",
    title: "Toyota Supra MK5 – Worth the Hype?",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Car Reviews",
    year: 2024,
    description: "We test the Toyota Supra to see if it lives up to its legendary name.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "7",
    title: "Mazda MX-5 – Pure Driving Joy",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Car Reviews",
    year: 2024,
    description: "The Mazda MX-5 Miata continues to be the benchmark for driving fun.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "8",
    title: "Porsche 911 GT3 – Track Monster",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Car Reviews",
    year: 2024,
    description: "The naturally aspirated Porsche 911 GT3 on track.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "9",
    title: "Ford Mustang Dark Horse Review",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Car Reviews",
    year: 2024,
    description: "The most powerful Mustang ever made.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "10",
    title: "Honda Civic Type R – Hot Hatch King",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Car Reviews",
    year: 2024,
    description: "Honda's ultimate hot hatch goes on a full test.",
    youtubeId: "dQw4w9WgXcQ",
  },
  // Tips & Maintenance
  {
    id: "11",
    title: "10 Car Maintenance Mistakes to Avoid",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Tips & Maintenance",
    year: 2024,
    description: "Common mistakes that can damage your car.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "12",
    title: "How to Detail Your Car Like a Pro",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Tips & Maintenance",
    year: 2024,
    description: "Professional car detailing techniques you can do at home.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "13",
    title: "Winter Driving Tips – Stay Safe",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Tips & Maintenance",
    year: 2024,
    description: "Essential tips for driving in snow and ice.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "14",
    title: "Best Dashcams 2024 – Buyer's Guide",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Tips & Maintenance",
    year: 2024,
    description: "Top dashcams reviewed and compared.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "15",
    title: "DIY Oil Change – Step by Step",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Tips & Maintenance",
    year: 2024,
    description: "Save money by changing your own oil.",
    youtubeId: "dQw4w9WgXcQ",
  },
  // Motorsport
  {
    id: "16",
    title: "F1 2024 Season Highlights",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Motorsport",
    year: 2024,
    description: "The best moments from the Formula 1 season.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "17",
    title: "Nurburgring Lap Record Attempts",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Motorsport",
    year: 2024,
    description: "Watch cars battle for the fastest Nurburgring lap time.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "18",
    title: "Rally Racing – Dirt and Glory",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Motorsport",
    year: 2024,
    description: "The thrill of World Rally Championship racing.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "19",
    title: "Le Mans 24h – Ultimate Endurance",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Motorsport",
    year: 2024,
    description: "Highlights from the world's greatest endurance race.",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "20",
    title: "Drag Racing – 0-100 in Under 2 Seconds",
    thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    category: "Motorsport",
    year: 2024,
    description: "The fastest drag racing cars on the planet.",
    youtubeId: "dQw4w9WgXcQ",
  },
];

export const categories = [...new Set(videos.map((v) => v.category))];

export function getVideosByCategory(category: string): Video[] {
  return videos.filter((v) => v.category === category);
}

export function getVideoById(id: string): Video | undefined {
  return videos.find((v) => v.id === id);
}
