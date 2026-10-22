import { EventCategoryId } from "@/components/brand/EventIcons";

export interface EventItem {
  id: string;
  _id?: string;
  slug: string;
  categoryId: EventCategoryId;
  title: string;
  tagline: string;
  caption: string;
  date: string;
  day: string;
  time: string;
  dateTime?: string;
  venue: string;
  category: "Cultural" | "Technical" | "Gaming & Pop" | "Culinary" | "Auto & Tech" | "Creative & Cultural" | "Entertainment" | string;
  entryType: "Solo" | "Team" | "Open Access" | "Individual" | string;
  price: number;
  prizePool?: string;
  participantLimit?: number;
  shortDescription?: string;
  longDescription?: string;
  description: string;
  rules: string[];
  requirements?: string[];
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
    id: "fandomania",
    _id: "6ad087ce3f54d0d1e8dfe1e0",
    slug: "fandomania-2k26",
    categoryId: "fandomania",
    title: "FanDoMania 2K26",
    tagline: "Your Fandom · Your Character · Your Stage",
    caption: "LIVE COSPLAY SHOWCASE",
    date: "11 Nov 2026",
    day: "Day 2",
    time: "1:00 PM",
    dateTime: "2026-11-11T13:00:00+05:30",
    venue: "Block A, Ground Floor",
    category: "Creative & Cultural",
    entryType: "Individual",
    price: 0,
    prizePool: "Exciting prizes",
    participantLimit: 50,
    image: "https://nexus-vyoma.s3.ap-south-2.amazonaws.com/event-banners/9040e6b1-d666-41c5-ab3f-3c3675bc284f.jpeg",
    accentColor: "#E020FF",
    aspectRatio: "1 / 1",
    shortDescription: "Your fandom. Your character. Your stage. Dress up as any character ",
    longDescription:
      "FanDoMania, presented by Nexus Vyoma, is a live cosplay showcase where you can bring your favourite characters from anime, games, Bollywood, Hollywood, and web series to life. Showcase your cosplay on stage, capture memorable moments at our photo booths, and compete for the Fan Favourite Cosplayer prize through audience voting. Solo registrations are open, while duo and group performances can be discussed with the organisers at the registration desk on the event day, and every participant receives a participation certificate",
    description:
      "FanDoMania, presented by Nexus Vyoma, is a live cosplay showcase where you can bring your favourite characters from anime, games, Bollywood, Hollywood, and web series to life. Showcase your cosplay on stage, capture memorable moments at our photo booths, and compete for the Fan Favourite Cosplayer prize through audience voting.",
    rules: [
      "Complete cosplay costume representing the registered character",
      "Cosplay accessories including wigs, masks, gloves, footwear and jewellery",
      "Character-related props complying with event safety rules",
      "Registration confirmation or registration ID",
      "Phone and essential personal belongings",
      "Basic repair kit including safety pins, tape, thread, needle and small items for emergency costume repairs.",
    ],
    requirements: [
      "Complete cosplay costume representing the registered character",
      "cosplay accessories including wigs",
      "masks",
      "gloves",
      "footwear and jewellery",
      "character-related props complying with event safety rules",
      "registration confirmation or registration ID",
      "phone and essential personal belongings",
      "basic repair kit including safety pins",
      "tape",
      "thread",
      "needle and other small items for emergency costume repairs.",
    ],
  },
  {
    id: "riwayat",
    _id: "6ad314244fd3ab4dfc61c640",
    slug: "riwayath",
    categoryId: "riwayat",
    title: "Riwayath",
    tagline: "Step into the world where culture speaks",
    caption: "CELEBRATION OF TRADITION & HERITAGE",
    date: "12 Nov 2026",
    day: "Day 3",
    time: "12:00 PM",
    dateTime: "2026-11-12T12:00:00+05:30",
    venue: "Block A,Ground floor",
    category: "Creative & Cultural",
    entryType: "Individual",
    price: 0,
    prizePool: "Exciting prizes",
    participantLimit: 50,
    image: "https://nexus-vyoma.s3.ap-south-2.amazonaws.com/event-banners/766d272b-7445-432c-81a5-38a5e338541d.jpeg",
    accentColor: "#D97706",
    aspectRatio: "1 / 1",
    shortDescription: "Step into the world where culture speaks",
    longDescription:
      "Riwayath is a celebration of tradition, culture, and heritage. It gives students an opportunity to express their cultural identity through traditional attire, confidence, and graceful presentation, celebrating the richness and diversity of our traditions",
    description:
      "Riwayath is a celebration of tradition, culture, and heritage. It gives students an opportunity to express their cultural identity through traditional attire, confidence, and graceful presentation, celebrating the richness and diversity of our traditions",
    rules: [
      "Every participant must wear traditional attire. Individual participation only.",
    ],
    requirements: [
      "Every participant must wear traditional attire. Individual participation only",
    ],
  },
  {
    id: "mehfil-e-hunar",
    _id: "6ad31fbcddce0d54768230b4",
    slug: "mehfil-e-hunar",
    categoryId: "mehfil-e-hunar",
    title: "Mehfil - E - Hunar",
    tagline: "Paint · Sing · Dance · Poetry",
    caption: "TALENT & ARTISTRY SHOWCASE",
    date: "11 Nov 2026",
    day: "Day 2",
    time: "10:00 AM",
    dateTime: "2026-11-11T10:00:00+05:30",
    venue: "Outdoor College Amphitheatre, ISL Engineering College",
    category: "Creative & Cultural",
    entryType: "Individual",
    price: 0,
    prizePool: "Exciting prizes",
    participantLimit: 400,
    image: "https://nexus-vyoma.s3.ap-south-2.amazonaws.com/event-banners/ef4635e1-8b32-4dc1-85e8-84468bae7bd9.jpeg",
    accentColor: "#FFB800",
    aspectRatio: "1 / 1",
    shortDescription:
      "A creative gathering where students showcase their talent through painting, singing, dancing, and poetry",
    longDescription:
      "Mehfil-e-Hunar is part of Nexus Vyoma, a three-day inter-college fest at ISL Engineering College. It brings together visual arts and live performances, giving students a platform to express their creativity through painting, singing, dancing, and poetry,Important Note for Participants\r\n\r\nThis is a professional event, and to ensure smooth coordination, all participants must complete the following at least 10 days before the event: \r\n\r\nFill out the registration  form after paying entry fees\r\nRegistration link: https://forms.gle/KyMpTQ1Karo155hv6",
    description:
      "A creative gathering where students showcase their talent through painting, singing, dancing, and poetry",
    rules: [
      "Open to individual presentations across Painting, Singing, Dancing, and Poetry.",
      "Fill out the registration form after paying entry fees (Link: https://forms.gle/KyMpTQ1Karo155hv6)",
    ],
    requirements: [],
  },
  {
    id: "dj",
    _id: "6ad32acf8fd375e15558c923",
    slug: "eclipse-404",
    categoryId: "dj",
    title: "Eclipse 404",
    tagline: "High-Energy DJ Night",
    caption: "DJ NIGHT & ELECTRIFYING BEATS",
    date: "10 Nov 2026",
    day: "Day 1",
    time: "4:00 PM",
    dateTime: "2026-11-10T16:00:00+05:30",
    venue: "Crown Hall,ISL Engineering college",
    category: "Entertainment",
    entryType: "Individual",
    price: 399,
    prizePool: "N / A",
    participantLimit: 500,
    image: "https://nexus-vyoma.s3.ap-south-2.amazonaws.com/event-banners/14e32b2c-5206-470e-b64e-9c373e5d35dd.jpeg",
    accentColor: "#FF6A00",
    aspectRatio: "1 / 1",
    shortDescription:
      "Eclipse 404 is a high-energy DJ event featuring electrifying beats, vibrant music, and exciting dance moves. Get ready to groove to the rhythm, unleash your energy, and experience an unforgettable musical vibe with friends",
    longDescription:
      "Eclipse 404 is an energetic DJ event featuring electrifying beats, exciting music, and an unforgettable atmosphere.\r\nThe event brings together music lovers to enjoy vibrant DJ mixes, trending tracks, and high-energy rhythms.\r\nParticipants can dance, vibe with friends, and immerse themselves in an exciting musical experience.\r\nWith powerful sound, dynamic beats, and an enthusiastic crowd, Eclipse 404 promises an exhilarating musical celebration.\r\nGet ready to feel the rhythm, unleash your energy, and make every beat count",
    description:
      "Eclipse 404 is a high-energy DJ event featuring electrifying beats, vibrant music, and exciting dance moves. Get ready to groove to the rhythm, unleash your energy, and experience an unforgettable musical vibe with friends",
    rules: [
      "Valid College ID and Festival Pass are strictly required at entry gates.",
      "Zero tolerance policy for unruly conduct.",
    ],
    requirements: ["N / A"],
  },
  {
    id: "auto-show",
    _id: "6ad5bfc3eed3b916645db675",
    slug: "rpm-gear-up-expo",
    categoryId: "auto-expo",
    title: "RPM Gear Up Expo - Fuel the Madness",
    tagline: "Fuel the Madness · Speed & Machines",
    caption: "SUPERCAR & SUPERBIKE SHOWCASE",
    date: "10 Nov 2026",
    day: "Day 1",
    time: "11:00 AM",
    dateTime: "2026-11-10T11:00:00+05:30",
    venue: "Law Ground and Volleyball Court",
    category: "Entertainment",
    entryType: "Individual",
    price: 0,
    prizePool: "N / A",
    participantLimit: 4000,
    image: "https://nexus-vyoma.s3.ap-south-2.amazonaws.com/event-banners/b8167e0f-c960-4f17-808a-6043f38040eb.jpg",
    accentColor: "#FF382E",
    aspectRatio: "1 / 1",
    shortDescription:
      "An electrifying celebration of speed, machines, and the culture that lives beyond the redline. Feel the rush. Live the drive",
    longDescription:
      "Where power meets passion and engines ignite the adrenaline. RPM: Gear Up '26 brings together the world of automobiles, from roaring supercars to powerful superbikes, celebrating speed, style, and the spirit of automotive culture",
    description:
      "Where power meets passion and engines ignite the adrenaline. RPM: Gear Up '26 brings together the world of automobiles, from roaring supercars to powerful superbikes, celebrating speed, style, and the spirit of automotive culture.",
    rules: [
      "Display vehicles must adhere to campus vehicle movement instructions.",
      "Follow all safety guidelines and marshals in pit and track inspection areas.",
    ],
    requirements: ["N / A"],
  },
  {
    id: "charcha",
    _id: "6ad5c28c4e44180db97a9343",
    slug: "charcha",
    categoryId: "charcha",
    title: "CHARCHA",
    tagline: "Voices, Vibes & Unforgettable Moments",
    caption: "OPEN MIC & LIVE PERFORMANCES",
    date: "11 Nov 2026",
    day: "Day 2",
    time: "3:00 PM",
    dateTime: "2026-11-11T15:00:00+05:30",
    venue: "Amphitheatre,ISL Engineering college",
    category: "Creative & Cultural",
    entryType: "Individual",
    price: 399,
    prizePool: "Exciting prizes",
    participantLimit: 500,
    image: "https://nexus-vyoma.s3.ap-south-2.amazonaws.com/event-banners/c4a93f0f-6f43-40c7-8f56-0262c55ff302.jpg",
    accentColor: "#F59E0B",
    aspectRatio: "1 / 1",
    shortDescription:
      "Charcha is a vibrant celebration of talent, creativity, and self-expression! From hilarious stand-up comedy and soulful singing to energetic rapping and exciting live performances, this event brings together diverse talents on one stage. Whether you want to perform, entertain, or simply enjoy the show, Chatshala Talk is the perfect place to express yourself, share your passion, and create unforgettable memories",
    longDescription:
      "Charcha is an exciting open mic event that celebrates creativity, talent, and self-expression.\r\nIt welcomes stand-up comedians, poets, storytellers, musicians, and performers to showcase their skills on stage.\r\nParticipants get the opportunity to share their ideas, entertain the audience, and express themselves freely.\r\nThe event creates a lively and engaging atmosphere filled with laughter, stories, music, and meaningful conversations.\r\nWhether you're performing or enjoying the show, Charcha is all about voices, vibes, and unforgettable moments",
    description:
      "An exciting open mic event that celebrates creativity, talent, and self-expression. Welcoming stand-up comedians, poets, storytellers, musicians, and performers to share their ideas, entertain the audience, and express themselves in a lively atmosphere filled with laughter, stories, and meaningful conversations.",
    rules: [
      "Open to stand-up comedians, poets, storytellers, musicians, and live performers.",
      "Respectful campus-friendly content policy; expressive original material welcomed.",
    ],
    requirements: ["N / A"],
  },
  {
    id: "qawwali",
    _id: "6ad5c4e4959eb51581b6c908",
    slug: "jashn-e-suroor",
    categoryId: "qawwali",
    title: "Jashn - E - Suroor",
    tagline: "Soulful Sufi & Timeless Devotional Music",
    caption: "QAWWALI NIGHT",
    date: "12 Nov 2026",
    day: "Day 3",
    time: "6:00 PM",
    dateTime: "2026-11-12T18:00:00+05:30",
    venue: "Block-A,Ground floor",
    category: "Entertainment",
    entryType: "Individual",
    price: 599,
    prizePool: "N / A",
    participantLimit: 500,
    image: "https://nexus-vyoma.s3.ap-south-2.amazonaws.com/event-banners/8c3657a4-488b-45e3-b05a-f84504d3b51e.jpeg",
    accentColor: "#FBB03B",
    aspectRatio: "1 / 1",
    shortDescription:
      "Qawwali is a traditional form of Sufi music that brings people together through soulful singing, rhythmic clapping, and powerful musical performances. It expresses love, devotion, spirituality, and deep emotions through captivating melodies and meaningful lyrics. Join us for an unforgettable evening filled with rhythm, energy, and soulful vibes as we celebrate the timeless beauty of Qawwali",
    longDescription:
      "Qawwali is a traditional form of Sufi devotional music that has a rich cultural and spiritual history, originating in the Indian subcontinent and flourishing for centuries. Known for its powerful vocals, rhythmic clapping, harmonium melodies, and energetic percussion, Qawwali creates an atmosphere that connects people through music, emotions, and shared experiences. It is more than just a musical performance; it is an expression of love, devotion, peace, and the search for a deeper connection with the divine,Our annual Qawwali event aims to bring this timeless musical tradition to life by creating an evening filled with soulful melodies, cultural richness, and unforgettable moments. It offers participants an opportunity to experience the magic of live traditional music, appreciate the heritage behind the art form, and connect with others through the universal language of rhythm and emotion",
    description:
      "Qawwali is a traditional form of Sufi music that brings people together through soulful singing, rhythmic clapping, and powerful musical performances. It expresses love, devotion, spirituality, and deep emotions through captivating melodies and meaningful lyrics.",
    rules: [
      "Traditional or formal modest attire recommended.",
      "Seating arranged on first-come, first-served basis.",
      "Experience the beauty of live harmonium, rhythmic clapping, and soulful devotional music.",
    ],
    requirements: ["N / A"],
  },
];
