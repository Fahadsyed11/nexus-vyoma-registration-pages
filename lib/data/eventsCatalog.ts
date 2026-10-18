export interface CatalogEvent {
  id: string;
  slug: string;
  mockId: string;
  title: string;
  shortDescription: string;
  description?: string[];
  requirements?: string[];
  venue: string;
  date: string;
  time: string;
  category: string;
  participationType: string;
  feeText?: string;
  prizePool?: string;
  imageUrl?: string;
  registrationUrl?: string | null;
  isFlagship: boolean;
  statusNote?: string;
}

export const SAMPLE_EVENT: CatalogEvent = {
  id: 'sample-event',
  slug: 'sample-event',
  mockId: 'SAMPLE',
  title: 'SAMPLE EVENT',
  shortDescription:
    'This is mock content for layout testing, not a confirmed NEXUS VYOMA event.',
  description: [
    'This is mock content for layout testing, not a confirmed NEXUS VYOMA event. This sample experience brings participants together for an engaging session of exploration, hands-on challenges, and shared ideas. The final event format and schedule will be supplied by the organizing team.',
    'Participants will have time to understand the sample brief, develop an approach, and share their work. This paragraph demonstrates how a longer event description flows naturally without clipping. Replace it with official instructions, judging criteria, and any important information before opening registration.',
  ],
  requirements: [
    'Sample equipment: bring a laptop and charger.',
    'Sample eligibility: open to student participants.',
    'Sample conditions: individual participation; final rules pending.',
  ],
  venue: 'Sample venue',
  date: '10 November (sample)',
  time: '10:00 AM (sample)',
  category: 'Workshop (sample)',
  participationType: 'Individual (sample)',
  feeText: '₹200 (sample amount)',
  prizePool: 'N/A',
  isFlagship: false,
  statusNote: 'Sample event only. Registration is not active.',
};

export const EVENTS_CATALOG: CatalogEvent[] = [
  {
    id: 'rpm-auto-show',
    slug: 'rpm-gear-up-auto-show',
    mockId: '01 / MOCK',
    title: 'RPM (Gear Up) — Auto Show',
    shortDescription:
      'A showcase and exhibition of custom performance engines, tuned machines, and automotive engineering concepts.',
    description: [
      'A showcase and exhibition of custom performance engines, tuned machines, and automotive engineering concepts. Explore aerodynamic modifications, engine tuning configurations, and cutting-edge mechanical design.',
      'Participants and engineering enthusiasts will have the opportunity to showcase custom builds, interact with industry professionals, and study high-performance vehicle tuning.',
    ],
    requirements: [
      'Sample equipment: safety gear required in pit inspection zones.',
      'Sample eligibility: open to student automotive teams.',
      'Sample conditions: vehicle technical documentation must be submitted.',
    ],
    venue: 'Sample Concourse Arena',
    date: '11 November',
    time: '10:00 AM (sample)',
    category: 'Competition',
    participationType: 'Team',
    feeText: '₹250 (sample amount)',
    prizePool: '₹40,000',
    isFlagship: true,
    statusNote: 'Awaiting official schedule confirmation',
  },
  {
    id: 'eclipse-404-dj',
    slug: 'eclipse-404-dj',
    mockId: '02 / MOCK',
    title: 'Eclipse 404 — DJ',
    shortDescription:
      'High-energy electronic music session, audio synthesis showcase, and live acoustic performance.',
    description: [
      'High-energy electronic music session, audio synthesis showcase, and live acoustic performance bringing cutting-edge sound engineering to the amphitheatre.',
      'Learn about modular synthesis, DAW production pipelines, live performance controllers, and frequency modulation directly from electronic audio performers.',
    ],
    requirements: [
      'Sample equipment: personal headphones recommended for listening tests.',
      'Sample eligibility: open to all festival pass holders.',
      'Sample conditions: amphitheatre seating on first-come basis.',
    ],
    venue: 'Sample Amphitheatre',
    date: '12 November',
    time: '06:30 PM (sample)',
    category: 'Entertainment',
    participationType: 'Individual',
    feeText: '₹150 (sample amount)',
    prizePool: 'N/A',
    isFlagship: true,
    statusNote: 'Awaiting official lineup confirmation',
  },
  {
    id: 'signal-hunt',
    slug: 'signal-hunt',
    mockId: '03 / MOCK',
    title: 'Signal Hunt',
    shortDescription:
      'Campus-wide radio frequency and cryptic signal hunt challenging deduction and rapid problem solving.',
    description: [
      'Campus-wide radio frequency and cryptic signal hunt challenging deduction and rapid problem solving. Teams trace RF transmitters and decode cipher packets hidden across campus.',
      'Demonstrate rapid thinking, signal triangulation, and algorithmic decryption in a timed outdoor competition testing both hardware and software dexterity.',
    ],
    requirements: [
      'Sample equipment: SDR dongle or smartphone with compass sensor.',
      'Sample eligibility: teams of 2–3 participants.',
      'Sample conditions: campus bounds strictly enforced.',
    ],
    venue: 'Sample Tech Quad',
    date: '10 November',
    time: '11:00 AM (sample)',
    category: 'Competition',
    participationType: 'Team',
    feeText: '₹200 (sample amount)',
    prizePool: '₹15,000',
    isFlagship: false,
    statusNote: 'Awaiting official schedule confirmation',
  },
  {
    id: 'vibe-coding-codecraft',
    slug: 'vibe-coding-codecraft',
    mockId: '04 / MOCK',
    title: 'Vibe Coding — CodeCraft',
    shortDescription:
      'Speed programming, algorithmic problem-solving, and creative software orchestration sprint.',
    description: [
      'Speed programming, algorithmic problem-solving, and creative software orchestration sprint. Tackle rapid data structure dilemmas and AI tool-augmented software development.',
      'Compete against time in multi-tiered coding heats where elegance, execution velocity, and edge-case handling dictate leaderboards.',
    ],
    requirements: [
      'Sample equipment: bring your laptop with preferred IDE pre-installed.',
      'Sample eligibility: individual student participation.',
      'Sample conditions: internet access restricted to designated sandboxes.',
    ],
    venue: 'Sample Innovation Lab',
    date: '11 November',
    time: '02:00 PM (sample)',
    category: 'Hackathon',
    participationType: 'Individual',
    feeText: '₹100 (sample amount)',
    prizePool: '₹25,000',
    isFlagship: false,
    statusNote: 'Awaiting official schedule confirmation',
  },
  {
    id: 'nexus-arena-esports',
    slug: 'nexus-arena-esports',
    mockId: '05 / MOCK',
    title: 'Nexus Arena — E-Sports',
    shortDescription:
      'Multiplayer tactical gaming tournament spanning marquee competitive PC and console titles.',
    description: [
      'Multiplayer tactical gaming tournament spanning marquee competitive PC and console titles. High-framerate setups, spectator casting, and elimination brackets.',
      'Coordinate team strategies, tactical utility usage, and swift mechanical reflexes under championship stage lighting.',
    ],
    requirements: [
      'Sample equipment: personal peripherals (mouse, keyboard, headset) permitted.',
      'Sample eligibility: 5-player teams with optional 1 substitute.',
      'Sample conditions: standard fair-play tournament guidelines apply.',
    ],
    venue: 'Sample Auditorium',
    date: '10 November',
    time: '01:00 PM (sample)',
    category: 'Competition',
    participationType: 'Team',
    feeText: '₹300 (sample amount)',
    prizePool: '₹30,000',
    isFlagship: true,
    statusNote: 'Awaiting official bracket confirmation',
  },
  {
    id: 'financial-detective',
    slug: 'financial-detective',
    mockId: '06 / MOCK',
    title: 'Financial Detective',
    shortDescription:
      'Interactive forensic accounting and financial statement analysis workshop uncovering corporate anomalies.',
    description: [
      'Interactive forensic accounting and financial statement analysis workshop uncovering corporate anomalies and disguised balance sheet discrepancies.',
      'Learn how forensic analysts detect fraudulent reporting, reconstruct cash flow patterns, and evaluate forensic audit trails in real-world corporate case studies.',
    ],
    requirements: [
      'Sample equipment: notebook, scientific or financial calculator.',
      'Sample eligibility: open to students across all streams.',
      'Sample conditions: case study dossiers provided at workshop start.',
    ],
    venue: 'Sample Seminar Hall 1',
    date: '10 November',
    time: '10:30 AM (sample)',
    category: 'Workshop',
    participationType: 'Individual',
    feeText: '₹150 (sample amount)',
    prizePool: 'N/A',
    isFlagship: false,
    statusNote: 'Awaiting official speaker confirmation',
  },
  {
    id: 'future-city',
    slug: 'future-city',
    mockId: '07 / MOCK',
    title: 'Future City',
    shortDescription:
      'Sustainable urban planning, green architecture, and smart transit prototyping workshop.',
    description: [
      'Sustainable urban planning, green architecture, and smart transit prototyping workshop exploring zero-emission infrastructure and modern civil solutions.',
      'Collaborate on modular city grid blueprints, clean energy distribution simulations, and dynamic public transit networks.',
    ],
    requirements: [
      'Sample equipment: drafting kit or tablet for schematic sketching.',
      'Sample eligibility: interdisciplinary teams of 2–4 students.',
      'Sample conditions: physical modeling supplies provided on site.',
    ],
    venue: 'Sample Design Studio',
    date: '11 November',
    time: '11:30 AM (sample)',
    category: 'Workshop',
    participationType: 'Team',
    feeText: '₹200 (sample amount)',
    prizePool: 'N/A',
    isFlagship: false,
    statusNote: 'Awaiting official mentor confirmation',
  },
  {
    id: 'drug-discovery-challenge',
    slug: 'drug-discovery-challenge',
    mockId: '08 / MOCK',
    title: 'Drug Discovery Challenge',
    shortDescription:
      'Computational bio-modeling session focusing on molecular docking pipelines and therapeutic research.',
    description: [
      'Computational bio-modeling session focusing on molecular docking pipelines and therapeutic research against contemporary pathogenic targets.',
      'Work with ligand design databases, molecular docking simulators, and pharmacokinetic analysis tools in an interactive lab environment.',
    ],
    requirements: [
      'Sample equipment: laptop with 8GB RAM minimum for 3D molecular viewer.',
      'Sample eligibility: open to biotechnology, pharmacy, and science students.',
      'Sample conditions: software links distributed prior to session.',
    ],
    venue: 'Sample Bio-Tech Block',
    date: '12 November',
    time: '03:00 PM (sample)',
    category: 'Talk',
    participationType: 'Individual',
    feeText: '₹150 (sample amount)',
    prizePool: 'N/A',
    isFlagship: false,
    statusNote: 'Awaiting official keynote confirmation',
  },
];

import { OFFICIAL_FLAGSHIP_EVENTS } from './events';

export function getEventBySlug(slug: string): CatalogEvent | undefined {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  if (normalized === 'sample-event' || normalized === 'sample') {
    return SAMPLE_EVENT;
  }
  const fromCatalog = EVENTS_CATALOG.find(
    (e) => e.slug.toLowerCase() === normalized || e.id.toLowerCase() === normalized
  );
  if (fromCatalog) return fromCatalog;

  const flagship = OFFICIAL_FLAGSHIP_EVENTS.find(
    (e) => e.slug.toLowerCase() === normalized || e.id.toLowerCase() === normalized
  );
  if (flagship) {
    return {
      id: flagship.id,
      slug: flagship.slug,
      mockId: 'FLAGSHIP',
      title: flagship.title,
      shortDescription: flagship.description,
      description: [flagship.description],
      requirements: flagship.rules,
      venue: flagship.venue,
      date: flagship.day ? `${flagship.day} (${flagship.date})` : flagship.date,
      time: flagship.time,
      category: flagship.category,
      participationType: flagship.entryType,
      feeText: `₹${flagship.price}`,
      prizePool: flagship.prizePool || 'N/A',
      isFlagship: true,
      statusNote: 'Official Flagship Arena',
    };
  }

  return undefined;
}

export function getAllEventSlugs(): string[] {
  const catalogSlugs = EVENTS_CATALOG.map((e) => e.slug);
  const flagshipSlugs = OFFICIAL_FLAGSHIP_EVENTS.map((e) => e.slug);
  return Array.from(new Set(['sample-event', ...catalogSlugs, ...flagshipSlugs]));
}
