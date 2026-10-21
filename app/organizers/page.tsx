import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import OrganizersView from '@/components/organizers/OrganizersView';
import type { DbOrganizerMember } from '@/lib/data/organizersData';

export const metadata: Metadata = {
  title: 'The Organizers | Nexus Vyoma',
  description:
    'Meet the chief patron, patron, conveners, advisory board, heads of departments, faculty coordinators, and student teams behind Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
  openGraph: {
    title: 'The Organizers | Nexus Vyoma',
    description:
      'Meet the patrons, conveners, faculty mentors, and student teams bringing Nexus Vyoma to life.',
    type: 'website',
  },
};

/** Loads organizer members from the existing `GET /api/organizer-member` route */
async function loadOrganizerMembers(): Promise<DbOrganizerMember[]> {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';

    const res = await fetch(`${proto}://${host}/api/organizer-member`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];

    const json = (await res.json()) as { data?: DbOrganizerMember[] | null };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function OrganizersPage() {
  const members = await loadOrganizerMembers();

  return (
    <div className="relative min-h-screen flex flex-col bg-[#050505] text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 — Shared Nexus Vyoma Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Editorial Organizers Content */}
      <main
        suppressHydrationWarning
        className="flex-1 flex flex-col items-center w-full px-2.5 sm:px-4 md:px-6 pt-24 sm:pt-28 pb-12 sm:pb-16 z-10"
      >
        <OrganizersView initialMembers={members} />
      </main>

      {/* 03 — Shared Cinematic Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
