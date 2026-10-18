import { EventCategoryId } from "@/components/brand/EventIcons";

export interface EventItem {
  id: string;
  slug: string;
  categoryId: EventCategoryId;
  title: string;
  tagline: string;
  caption: string;
  date: string;
  day: string;
  time: string;
  venue: string;
  category: "Cultural" | "Technical" | "Gaming & Pop" | "Culinary" | "Auto & Tech";
  entryType: "Solo" | "Team" | "Open Access";
  price: number;
  prizePool?: string;
  description: string;
  rules: string[];
}

export const FEST_METADATA = {
  name: "NEXUS VYOMA",
  tagline: "A THREE-DAY INTER-COLLEGE FEST",
  college: "ISL Engineering College",
  location: "Bandlaguda, Chandrayangutta, Hyderabad, Telangana 500005",
  dates: "10 · 11 · 12 NOV 2026",
  days: [
    { day: "Day 1", date: "10 Nov 2026", title: "Ignition & Cultural Grandeur" },
    { day: "Day 2", date: "11 Nov 2026", title: "Tech Conquests & Auto Arena" },
    { day: "Day 3", date: "12 Nov 2026", title: "Mega DJ Concert & Grand Finale" },
  ],
  motto: "Ideas • People • Culture • Beyond",
};

export const OFFICIAL_FLAGSHIP_EVENTS: EventItem[] = [
  {
    id: "cosplay-championship",
    slug: "cosplay-championship",
    categoryId: "cosplay",
    title: "Cosplay Championship",
    tagline: "Characters Live On",
    caption: "CHARACTERS LIVE ON",
    date: "2026-11-10",
    day: "Day 1",
    time: "4:00 PM – 7:30 PM",
    venue: "Main Amphitheatre",
    category: "Gaming & Pop",
    entryType: "Solo",
    price: 199,
    prizePool: "₹25,000",
    description:
      "Embody your favorite characters from anime, gaming, comics, and cinema. Showcase craft, persona, and stage presence before an esteemed panel of international judges.",
    rules: [
      "Costumes must be at least 60% handcrafted.",
      "Props must comply with safety regulations (no sharp metal, live projectiles, or dangerous pyrotechnics).",
      "Stage performance time limit is 2 minutes per contestant.",
    ],
  },
  {
    id: "mega-dj-night",
    slug: "mega-dj-night",
    categoryId: "dj",
    title: "Mega DJ Night",
    tagline: "Feel Every Beat",
    caption: "FEEL EVERY BEAT",
    date: "2026-11-12",
    day: "Day 3",
    time: "6:30 PM – 10:30 PM",
    venue: "ISL Mega Grounds",
    category: "Cultural",
    entryType: "Open Access",
    price: 349,
    description:
      "The crowning finale concert of Nexus Vyoma. High-energy EDM, Bollywood remix juggernauts, sub-bass tremors, and lasers under the Hyderabad sky.",
    rules: [
      "Valid College ID and Festival Pass are strictly required at entry gates.",
      "Gates close promptly at 7:30 PM.",
      "Zero tolerance policy for unruly conduct.",
    ],
  },
  {
    id: "automobile-expo",
    slug: "automobile-expo",
    categoryId: "auto-expo",
    title: "Automobile Expo",
    tagline: "Machines Move People",
    caption: "MACHINES MOVE PEOPLE",
    date: "2026-11-11",
    day: "Day 2",
    time: "10:00 AM – 5:00 PM",
    venue: "Engineering Concourse & Arena",
    category: "Auto & Tech",
    entryType: "Team",
    price: 299,
    prizePool: "₹40,000",
    description:
      "The premier automotive showcase featuring custom-tuned supercars, electric hyper-prototypes, drift rigs, and student formula racing machines.",
    rules: [
      "Display vehicles must register specifications in advance.",
      "Engine revving tests only permitted within the designated acoustic dyno-zone.",
    ],
  },
  {
    id: "qawwali-night",
    slug: "qawwali-night",
    categoryId: "qawwali",
    title: "Sufi & Qawwali Night",
    tagline: "Let The Soul Sing",
    caption: "LET THE SOUL SING",
    date: "2026-11-10",
    day: "Day 1",
    time: "7:00 PM – 10:00 PM",
    venue: "Central Courtyard",
    category: "Cultural",
    entryType: "Open Access",
    price: 249,
    description:
      "An ethereal evening of soulful classical melodies, Sufi poetry, harmonium riffs, and ecstatic percussion celebrating the cultural heritage of Hyderabad.",
    rules: [
      "Traditional or formal modest attire recommended.",
      "Seating arranged on first-come, first-served basis.",
    ],
  },
  {
    id: "tech-battles",
    slug: "tech-battles",
    categoryId: "tech-battles",
    title: "Tech Battles & Hackathon",
    tagline: "Think. Build. Conquer.",
    caption: "THINK. BUILD. CONQUER.",
    date: "2026-11-11",
    day: "Day 2",
    time: "9:00 AM – 9:00 PM (12-Hour Sprint)",
    venue: "ISL Innovation Labs",
    category: "Technical",
    entryType: "Team",
    price: 399,
    prizePool: "₹50,000",
    description:
      "A high-stakes 12-hour technical sprint covering AI agent building, algorithmic challenges, security CTFs, and rapid hardware prototyping.",
    rules: [
      "Teams of 2 to 4 members.",
      "All code repositories must be initiated at the hackathon kick-off.",
      "Plagiarism or pre-built solutions will result in immediate disqualification.",
    ],
  },
  {
    id: "food-carnival",
    slug: "food-carnival",
    categoryId: "food-fest",
    title: "Culinary & Food Fest",
    tagline: "Taste The Celebration",
    caption: "TASTE THE CELEBRATION",
    date: "2026-11-10",
    day: "Day 1 to Day 3",
    time: "11:00 AM – 10:00 PM Daily",
    venue: "Boulevard Promenade",
    category: "Culinary",
    entryType: "Open Access",
    price: 99,
    description:
      "Over 40 curated culinary stalls, authentic Hyderabadi biryani cook-offs, fusion street snacks, artisanal mocktails, and sweet dessert corners.",
    rules: [
      "Digital pass includes ₹50 redeemable tasting coupon.",
      "Eco-friendly, biodegradable cutlery strictly enforced across all stalls.",
    ],
  },
];
