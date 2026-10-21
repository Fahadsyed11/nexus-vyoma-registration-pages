import { Suspense, cache } from 'react';
import { headers } from 'next/headers';
import { connection } from 'next/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import EventDetailsView from '@/components/events/EventDetailsView';
import {
  mapApiEventToCatalog,
  type ApiEvent,
  type CatalogEvent,
} from '@/lib/data/eventsCatalog';

interface EventDetailsPageProps {
  params: Promise<{
    eventSlug: string;
  }>;
}

/** Loads one event from the existing `GET /api/event/:id` route (no direct DB access). */
const loadEvent = cache(async (id: string): Promise<CatalogEvent | null> => {
  await connection();
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';

    const res = await fetch(
      `${proto}://${host}/api/event/${encodeURIComponent(id)}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;

    const json = (await res.json()) as { data?: ApiEvent | null };
    return json.data ? mapApiEventToCatalog(json.data) : null;
  } catch {
    return null;
  }
});

export const metadata: Metadata = {
  title: 'Event Details | Nexus Vyoma',
  description:
    'Explore event details, schedule, prize, venue, and registration for Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
  openGraph: {
    title: 'Event Details | Nexus Vyoma',
    description:
      'Official event details and registration for Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
    type: 'website',
  },
};

async function EventDetailsContent({ params }: EventDetailsPageProps) {
  const { eventSlug } = await params;
  const event = await loadEvent(eventSlug);

  if (!event) {
    notFound();
  }

  return <EventDetailsView event={event} />;
}

export default function EventDetailsPage({ params }: EventDetailsPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 — Shared Nexus Vyoma Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Framed Event Details Section Container */}
      <main
        suppressHydrationWarning
        className="flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-14 z-10"
      >
        <div className="w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl border border-zinc-800/90 bg-black/70 p-4 xs:p-5 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <Suspense fallback={null}>
            <EventDetailsContent params={params} />
          </Suspense>
        </div>
      </main>

      {/* 03 — Shared Cinematic Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
