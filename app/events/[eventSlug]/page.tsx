import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import EventDetailsView from '@/components/events/EventDetailsView';
import { getEventBySlug, getAllEventSlugs } from '@/lib/data/eventsCatalog';

interface EventDetailsPageProps {
  params: Promise<{
    eventSlug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllEventSlugs();
  return slugs.map((slug) => ({
    eventSlug: slug,
  }));
}

export async function generateMetadata({
  params,
}: EventDetailsPageProps): Promise<Metadata> {
  const { eventSlug } = await params;
  const event = getEventBySlug(eventSlug);

  if (!event) {
    return {
      title: 'Event Not Found | Nexus Vyoma',
      description: 'The requested event could not be found.',
    };
  }

  return {
    title: `${event.title} | Nexus Vyoma`,
    description: event.shortDescription,
    openGraph: {
      title: `${event.title} | Nexus Vyoma`,
      description: event.shortDescription,
      type: 'website',
    },
  };
}

function EventDetailsSkeleton() {
  return (
    <div className="w-full min-h-[500px] animate-pulse flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-[380px] lg:w-[420px] aspect-[4/3] rounded-xl bg-zinc-900/60 border border-zinc-800/60" />
      <div className="flex-1 space-y-4 pt-2">
        <div className="h-4 w-28 bg-zinc-800/80 rounded" />
        <div className="h-10 w-3/4 bg-zinc-800/80 rounded" />
        <div className="h-20 w-full bg-zinc-900/50 rounded" />
        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="h-14 bg-zinc-900/60 rounded-lg" />
          <div className="h-14 bg-zinc-900/60 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

async function EventDetailsContent({ params }: EventDetailsPageProps) {
  const { eventSlug } = await params;
  const event = getEventBySlug(eventSlug);

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
          <Suspense fallback={<EventDetailsSkeleton />}>
            <EventDetailsContent params={params} />
          </Suspense>
        </div>
      </main>

      {/* 03 — Shared Cinematic Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
