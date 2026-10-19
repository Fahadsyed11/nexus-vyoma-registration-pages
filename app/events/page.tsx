import { Suspense } from 'react';
import { headers } from 'next/headers';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import EventsExplorer from '@/components/events/EventsExplorer';
import FooterSection from '@/components/footer/FooterSection';
import {
  mapApiEventToCatalog,
  type ApiEvent,
  type CatalogEvent,
} from '@/lib/data/eventsCatalog';

export const metadata: Metadata = {
  title: 'Events | Nexus Vyoma',
  description:
    'Explore the official schedule of events, competitions, workshops, talks, and flagship arenas at Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
  openGraph: {
    title: 'Events | Nexus Vyoma',
    description:
      'Official event lineup and schedule for Nexus Vyoma 2026 (10–12 Nov 2026) at ISL Engineering College, Hyderabad.',
    type: 'website',
  },
};

/** Loads events from the existing `GET /api/event` route (no direct DB access). */
async function loadEvents(): Promise<CatalogEvent[]> {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';

    const res = await fetch(`${proto}://${host}/api/event`, { cache: 'no-store' });
    if (!res.ok) return [];

    const json = (await res.json()) as { data?: ApiEvent[] | null };
    return (json.data ?? []).map((doc, i) => mapApiEventToCatalog(doc, i));
  } catch {
    return [];
  }
}

async function EventsContent() {
  const events = await loadEvents();
  return <EventsExplorer events={events} />;
}

export default function EventsPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 — Shared Nexus Vyoma Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Framed Events Section Container */}
      <main
        suppressHydrationWarning
        className="flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-14 z-10"
      >
        <div className="w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl border border-zinc-800/90 bg-black/70 p-4 xs:p-5 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <Suspense fallback={null}>
            <EventsContent />
          </Suspense>
        </div>
      </main>

      {/* 03 — Shared Cinematic Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
