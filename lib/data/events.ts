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
  image?: string;
  accentColor?: string;
  aspectRatio?: string;
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
    id: "auto-show",
    slug: "rpm-gear-up-expo",
    categoryId: "auto-expo",
    title: "RPM Auto Fest",
    tagline: "Cars | Drift | Culture | Community",
    caption: "CARS · DRIFT · CULTURE · COMMUNITY",
    date: "11 Nov 2026",
    day: "Day 2",
    time: "10:00 AM – 5:00 PM",
    venue: "Engineering Concourse & Arena",
    category: "Auto & Tech",
    entryType: "Team",
    price: 250,
    prizePool: "₹40,000",
    image: "/brand/flagship/rpm-auto-fest.jpg",
    accentColor: "#E11D2A",
    aspectRatio: "1 / 1",
    description:
      "Where power meets passion and engines ignite the adrenaline. RPM: Gear Up '26 brings together the world of automobiles, from roaring supercars to powerful superbikes, celebrating speed, style, and the spirit of automotive culture.",
    rules: [
      "Display vehicles must register specifications in advance.",
      "Engine revving tests only permitted within the designated acoustic dyno-zone.",
      "Follow all safety guidelines and marshals in pit and track inspection areas.",
    ],
  },
  {
    id: "dj",
    slug: "eclipse-404-dj",
    categoryId: "dj",
    title: "Eclipse 404",
    tagline: "High-Energy DJ Night",
    caption: "DJ NIGHT",
    date: "12 Nov 2026",
    day: "Day 3",
    time: "6:30 PM – 10:30 PM",
    venue: "ISL Mega Grounds",
    category: "Cultural",
    entryType: "Open Access",
    price: 349,
    image: "/brand/flagship/eclipse-404.webp",
    accentColor: "#FF1E27",
    aspectRatio: "1 / 1",
    description:
      "Eclipse 404 is a high-energy DJ event featuring electrifying beats, vibrant music, and exciting dance moves. Get ready to groove to the rhythm, unleash your energy, and experience an unforgettable musical vibe with friends",
    rules: [
      "Valid College ID and Festival Pass are strictly required at entry gates.",
      "Gates close promptly at 7:30 PM.",
      "Zero tolerance policy for unruly conduct.",
    ],
  },
  {
    id: "mehfil-e-hunar",
    slug: "mehfil-e-hunar",
    categoryId: "mehfil-e-hunar",
    title: "MEHFIL E HUNAR",
    tagline: "Paint · Sing · Dance · Recite · Perform",
    caption: "SHOWCASE YOUR TALENT",
    date: "10 Nov 2026",
    day: "Day 1",
    time: "2:00 PM – 6:00 PM",
    venue: "Main Auditorium",
    category: "Cultural",
    entryType: "Solo",
    price: 199,
    prizePool: "₹25,000",
    image: "/brand/flagship/mehfil-e-hunar.webp",
    accentColor: "#FFA702",
    aspectRatio: "682 / 1024",
    description:
      "A creative gathering where students showcase their talent through painting, singing, dancing, and poetry",
    rules: [
      "Open to individual presentations across Painting, Singing, Dancing, and Poetry.",
      "Performance time limit strictly adhered to by the judging panel.",
      "Original material and compositions are strongly encouraged.",
    ],
  },
  {
    id: "fandomania",
    slug: "fandomania",
    categoryId: "fandomania",
    title: "FANDOMANIA",
    tagline: "Your Fandom · Your Character · Your Stage",
    caption: "COSPLAY & POP CULTURE ARENA",
    date: "10 Nov 2026",
    day: "Day 1",
    time: "4:00 PM – 7:30 PM",
    venue: "Main Amphitheatre",
    category: "Gaming & Pop",
    entryType: "Solo",
    price: 199,
    prizePool: "₹25,000",
    image: "/brand/flagship/fandomania.webp",
    accentColor: "#FFC800",
    aspectRatio: "1 / 1",
    description:
      "Your fandom. Your character. Your stage. Dress up as any character and meet your fandom.",
    rules: [
      "Dress up as any character from anime, comics, gaming, or cinema.",
      "Costumes and props must comply with campus safety regulations.",
      "Stage showcase includes character walk, signature pose, and dialogue.",
    ],
  },
  {
    id: "riwayat",
    slug: "riwayat",
    categoryId: "riwayat",
    title: "RIWAYATH",
    tagline: "Rang · Reet · Riwaayat",
    caption: "WHERE CULTURE SPEAKS",
    date: "11 Nov 2026",
    day: "Day 2",
    time: "1:00 PM – 5:00 PM",
    venue: "Central Courtyard",
    category: "Cultural",
    entryType: "Team",
    price: 299,
    prizePool: "₹30,000",
    image: "/brand/flagship/riwayat.webp",
    accentColor: "#D4AF37",
    aspectRatio: "978 / 980",
    description: "Step into the world where culture speaks",
    rules: [
      "Traditional attire and cultural representation celebrated across all acts.",
      "Teams must submit performance audio tracks in advance.",
      "Judged on cultural authenticity, grace, coordination, and stage presence.",
    ],
  },
  {
    id: "qawwali",
    slug: "jashn-e-suroor-qawwali-night",
    categoryId: "qawwali",
    title: "Jashn-E-Suroor · Qawwali Night",
    tagline: "Some Melodies Stay Forever",
    caption: "SOULFUL SUFI & DEVOTIONAL POETRY",
    date: "10 Nov 2026",
    day: "Day 1",
    time: "7:00 PM – 10:00 PM",
    venue: "Central Courtyard",
    category: "Cultural",
    entryType: "Open Access",
    price: 249,
    image: "/brand/flagship/jashn-e-suroor.jpg",
    accentColor: "#FF8F1F",
    aspectRatio: "1 / 1",
    description:
      "A soulful musical event celebrating the rich tradition of Sufi music and devotional poetry. Talented Qawwali singers and performers captivate the audience with powerful vocals, rhythmic clapping, and traditional instruments creating a mesmerizing atmosphere filled with spirituality, emotion, and cultural richness.",
    rules: [
      "Traditional or formal modest attire recommended.",
      "Seating arranged on first-come, first-served basis.",
      "Experience the beauty of live harmonium, tabla, and rhythmic choral devotion.",
    ],
  },
  {
    id: "charcha",
    slug: "charcha-the-talk",
    categoryId: "charcha",
    title: "Charcha · Powered by De Cafe Studio",
    tagline: "Powered by De Cafe Studio",
    caption: "VOICES, VIBES & UNFORGETTABLE MOMENTS",
    date: "11 Nov 2026",
    day: "Day 2",
    time: "3:00 PM – 7:00 PM",
    venue: "Open-Air Amphitheatre",
    category: "Cultural",
    entryType: "Solo",
    price: 149,
    prizePool: "₹15,000",
    image: "/brand/flagship/charcha-the-talk.jpg",
    accentColor: "#EA8A19",
    aspectRatio: "1 / 1",
    description:
      "An exciting open mic event that celebrates creativity, talent, and self-expression. Welcoming stand-up comedians, poets, storytellers, musicians, and performers to share their ideas, entertain the audience, and express themselves in a lively atmosphere filled with laughter, stories, and meaningful conversations.",
    rules: [
      "Open to stand-up comedians, poets, storytellers, musicians, and live performers.",
      "Standard performance slot of 5 to 7 minutes per registered performer.",
      "Respectful campus-friendly content policy; expressive original material welcomed.",
    ],
  },
];
