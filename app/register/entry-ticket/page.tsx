import { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import EntryTicketView, { FreeEventItem } from '@/components/tickets/EntryTicketView';
import { connectToDatabase } from '@/database/db';
import RegisterUser from '@/database/schema/register-user.schema';
import EntryTicket from '@/database/schema/entry-ticket.schema';
import Event from '@/database/schema/event.schema';
import { verifyJWT } from '@/utilities/jwt';

export const metadata: Metadata = {
  title: 'Entry Ticket | Nexus Vyoma 2026',
  description:
    'Purchase your official 3-day all-access entry ticket for ₹299 to Nexus Vyoma 2026 (10–12 Nov 2026) at ISL Engineering College, Hyderabad. Includes free access to featured festival events.',
  openGraph: {
    title: 'Entry Ticket | Nexus Vyoma 2026',
    description:
      'All-access 3-day fest pass (₹299) to Nexus Vyoma 2026 at ISL Engineering College, Hyderabad. Includes free entry to official festival events.',
    type: 'website',
  },
};

interface SessionTokenData {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
}

async function getInitialAttendeeState() {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get('nv-session')?.value;
    const tempToken = cookieStore.get('nv-session-temp')?.value;

    if (!userToken || !tempToken) {
      return { user: null, isPurchased: false };
    }

    const userData = verifyJWT(userToken) as SessionTokenData | null;
    const tempData = verifyJWT(tempToken) as SessionTokenData | null;

    if (
      !userData?.user?.id ||
      !tempData?.user?.id ||
      userData.user.id !== tempData.user.id
    ) {
      return { user: null, isPurchased: false };
    }

    await connectToDatabase();

    const dbUser = await RegisterUser.findById(userData.user.id).lean();
    if (!dbUser) {
      return { user: null, isPurchased: false };
    }

    const normalizedEmail = String(dbUser.email ?? '').trim().toLowerCase();
    const paidTicket = await EntryTicket.findOne({
      $or: [{ userId: dbUser._id }, { email: normalizedEmail }],
      isPaid: true,
    }).lean();

    return {
      user: {
        id: dbUser._id.toString(),
        name: dbUser.full_name,
        email: dbUser.email,
        phone_number: dbUser.phone_number,
        institution: dbUser.institution,
      },
      isPurchased: Boolean(paidTicket),
    };
  } catch {
    return { user: null, isPurchased: false };
  }
}

async function getFreeEvents(): Promise<FreeEventItem[]> {
  try {
    await connectToDatabase();
    const docs = await Event.find({
      $or: [{ entry_fee: 0 }, { entry_fee: { $exists: false } }],
    })
      .sort({ date_time: 1 })
      .lean();

    return docs.map((e) => ({
      _id: e._id.toString(),
      title: e.title,
      short_description: e.short_description || '',
      long_description: e.long_description || '',
      venue: e.venue || 'ISL Campus',
      date_time: e.date_time || 'Schedule TBA',
      image_url: e.image_url || '',
      category: e.category || 'General',
      participants_type: (e.participants_type === 'team' ? 'team' : 'individual') as 'individual' | 'team',
      team_size: e.team_size || 1,
      min_team_size: e.min_team_size || 1,
      max_team_size: e.max_team_size || 1,
      prize: e.prize || 'Exciting Prizes & Certificates',
    }));
  } catch (err) {
    console.error('Error fetching free events for entry ticket:', err);
    return [];
  }
}

async function EntryTicketContent() {
  const [attendeeState, freeEvents] = await Promise.all([
    getInitialAttendeeState(),
    getFreeEvents(),
  ]);

  return (
    <EntryTicketView
      initialUser={attendeeState.user}
      initialIsPurchased={attendeeState.isPurchased}
      freeEvents={freeEvents}
    />
  );
}

export default function EntryTicketPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 — Official Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Framed Section Container (Matching /events) */}
      <main
        suppressHydrationWarning
        className="flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-14 z-10"
      >
        <div className="w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl border border-zinc-800/90 bg-black/70 p-4 xs:p-5 sm:p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)]">
          <Suspense fallback={null}>
            <EntryTicketContent />
          </Suspense>
        </div>
      </main>

      {/* 03 — Official Footer */}
      <FooterSection />
    </div>
  );
}
