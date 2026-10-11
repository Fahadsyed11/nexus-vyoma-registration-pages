export interface CatalogEvent {
  id: string;
  slug: string;
  mockId: string;
  title: string;
  shortDescription: string;
  venue: string;
  date: '10 November' | '11 November' | '12 November';
  time: string;
  category: 'Workshop' | 'Competition' | 'Talk';
  participationType: 'Individual' | 'Team';
  isFlagship: boolean;
  statusNote?: string;
}

export const EVENTS_CATALOG: CatalogEvent[] = [
  {
    id: 'rpm-auto-show',
    slug: 'rpm-gear-up-auto-show',
    mockId: '01 / MOCK',
    title: 'RPM (Gear Up) — Auto Show',
    shortDescription:
      'A showcase and exhibition of custom performance engines, tuned machines, and automotive engineering concepts.',
    venue: 'Sample Concourse Arena',
    date: '11 November',
    time: '10:00 AM (sample)',
    category: 'Competition',
    participationType: 'Team',
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
    venue: 'Sample Amphitheatre',
    date: '12 November',
    time: '06:30 PM (sample)',
    category: 'Talk',
    participationType: 'Individual',
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
    venue: 'Sample Tech Quad',
    date: '10 November',
    time: '11:00 AM (sample)',
    category: 'Competition',
    participationType: 'Team',
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
    venue: 'Sample Innovation Lab',
    date: '11 November',
    time: '02:00 PM (sample)',
    category: 'Competition',
    participationType: 'Individual',
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
    venue: 'Sample Auditorium',
    date: '10 November',
    time: '01:00 PM (sample)',
    category: 'Competition',
    participationType: 'Team',
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
    venue: 'Sample Seminar Hall 1',
    date: '10 November',
    time: '10:30 AM (sample)',
    category: 'Workshop',
    participationType: 'Individual',
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
    venue: 'Sample Design Studio',
    date: '11 November',
    time: '11:30 AM (sample)',
    category: 'Workshop',
    participationType: 'Team',
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
    venue: 'Sample Bio-Tech Block',
    date: '12 November',
    time: '03:00 PM (sample)',
    category: 'Talk',
    participationType: 'Individual',
    isFlagship: false,
    statusNote: 'Awaiting official keynote confirmation',
  },
];
