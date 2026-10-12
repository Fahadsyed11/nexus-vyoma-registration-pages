import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import EventsExplorer from '@/components/events/EventsExplorer';
import FooterSection from '@/components/footer/FooterSection';

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

export default function EventsPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 — Shared Nexus Vyoma Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Framed Events Section Container */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-14 z-10">
        <div className="w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl border border-zinc-800/90 bg-black/70 p-4 xs:p-5 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <EventsExplorer />
        </div>
      </main>

      {/* 03 — Shared Cinematic Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
