import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import OrganizersView from '@/components/organizers/OrganizersView';

export const metadata: Metadata = {
  title: 'The Organizers | Nexus Vyoma',
  description:
    'Meet the patrons, co-patrons, board members, tech team, and coordinators behind Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
  openGraph: {
    title: 'The Organizers | Nexus Vyoma',
    description:
      'Meet the patrons, mentors, and student teams bringing Nexus Vyoma to life.',
    type: 'website',
  },
};

export default function OrganizersPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#050505] text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 — Shared Nexus Vyoma Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Editorial Organizers Content */}
      <main
        suppressHydrationWarning
        className="flex-1 flex flex-col items-center w-full px-2.5 sm:px-4 md:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 z-10"
      >
        <OrganizersView />
      </main>

      {/* 03 — Shared Cinematic Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
