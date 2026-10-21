import { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import EntryTicketView, { FreeEventItem } from '@/components/tickets/EntryTicketView';
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

interface EntryTicketApiResponse {
  message?: string;
  data?: Record<string, unknown> | null;
  error?: unknown;
  redirect: boolean;
  redirectUrl: string | null;
}

interface ApiEventRaw {
  _id: string;
  title: string;
  short_description?: string;
  long_description?: string;
  venue?: string;
  date_time?: string;
  image_url?: string;
  category?: string;
  participants_type?: string;
  team_size?: number;
  min_team_size?: number;
  max_team_size?: number;
  prize?: string;
  entry_fee?: number;
}

/**
 * Calls GET /api/entry-ticket with incoming cookies to check ticket & auth status.
 * Handles redirects based on the API response contract.
 */
async function checkEntryTicketStatus(): Promise<{ redirect: boolean; redirectUrl: string | null }> {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';
    const cookie = h.get('cookie') ?? '';

    const res = await fetch(`${proto}://${host}/api/entry-ticket`, {
      headers: { cookie },
      cache: 'no-store',
    });

    const json = (await res.json()) as EntryTicketApiResponse;
    return {
      redirect: Boolean(json.redirect),
      redirectUrl: json.redirectUrl ?? null,
    };
  } catch {
    return {
      redirect: true,
      redirectUrl: '/register/check-email',
    };
  }
}

/** Decodes session token data locally to pre-fill attendee info (no DB access). */
async function getSessionUser() {
  try {
    const cookieStore = await cookies();
    const userToken = cookieStore.get('nv-session')?.value;
    const tempToken = cookieStore.get('nv-session-temp')?.value;

    if (!userToken || !tempToken) {
      return null;
    }

    const userData = verifyJWT(userToken) as SessionTokenData | null;
    const tempData = verifyJWT(tempToken) as SessionTokenData | null;

    if (
      !userData?.user?.id ||
      !tempData?.user?.id ||
      userData.user.id !== tempData.user.id
    ) {
      return null;
    }

    return {
      id: userData.user.id,
      name: userData.user.name || '',
      email: userData.user.email || '',
    };
  } catch {
    return null;
  }
}

function parseEventSchedule(rawDateStr: string): { date: string; time: string } {
  if (!rawDateStr || rawDateStr === 'Schedule TBA') {
    return { date: '10–12 Nov', time: 'Schedule TBA' };
  }
  try {
    const d = new Date(rawDateStr);
    if (isNaN(d.getTime())) {
      const parts = rawDateStr.split(',');
      if (parts.length >= 2) {
        return { date: parts[0].trim(), time: parts.slice(1).join(',').trim() };
      }
      return { date: rawDateStr, time: '' };
    }
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = d.getDate();
    const month = months[d.getMonth()] || 'Nov';
    const hours = d.getHours();
    const minutes = d.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return {
      date: `${day} ${month}`,
      time: `${formattedHours}:${formattedMinutes} ${ampm}`,
    };
  } catch {
    return { date: rawDateStr, time: '' };
  }
}

/** Loads free events from GET /api/event without any direct DB query. */
async function getFreeEvents(): Promise<FreeEventItem[]> {
  try {
    const h = await headers();
    const host = h.get('x-forwarded-host') ?? h.get('host');
    const proto = h.get('x-forwarded-proto') ?? 'http';

    const res = await fetch(`${proto}://${host}/api/event`, { cache: 'no-store' });
    if (!res.ok) return [];

    const json = (await res.json()) as { data?: ApiEventRaw[] | null };
    const events = json.data ?? [];

    return events
      .filter((e) => !e.entry_fee || Number(e.entry_fee) === 0)
      .map((e) => {
        const rawSchedule = e.date_time || 'Schedule TBA';
        const { date, time } = parseEventSchedule(rawSchedule);

        return {
          _id: String(e._id),
          title: e.title,
          short_description: e.short_description || '',
          long_description: e.long_description || '',
          venue: e.venue || 'ISL Campus',
          date_time: rawSchedule,
          formatted_date: date,
          formatted_time: time,
          image_url: e.image_url || '',
          category: e.category || 'General',
          participants_type: (e.participants_type === 'team' ? 'team' : 'individual') as 'individual' | 'team',
          team_size: e.team_size || 1,
          min_team_size: e.min_team_size || 1,
          max_team_size: e.max_team_size || 1,
          prize: e.prize || 'Exciting Prizes & Certificates',
        };
      });
  } catch (err) {
    console.error('Error fetching free events for entry ticket:', err);
    return [];
  }
}

async function EntryTicketContent() {
  await connection();

  const ticketStatus = await checkEntryTicketStatus();

  // If API indicates redirect (e.g. not authenticated -> /check-email, or paid -> /enroll-event)
  if (ticketStatus.redirect && ticketStatus.redirectUrl) {
    redirect(ticketStatus.redirectUrl);
  }

  const [user, freeEvents] = await Promise.all([
    getSessionUser(),
    getFreeEvents(),
  ]);

  return (
    <EntryTicketView
      initialUser={user}
      initialIsPurchased={false}
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
          <Suspense
            fallback={
              <div className="w-full py-20 flex flex-col items-center justify-center gap-3 text-zinc-500 font-mono text-xs">
                <div className="w-6 h-6 border-2 border-[#FF6A00] border-t-transparent rounded-full animate-spin" />
                <span>Loading Entry Pass Portal...</span>
              </div>
            }
          >
            <EntryTicketContent />
          </Suspense>
        </div>
      </main>

      {/* 03 — Official Footer */}
      <FooterSection />
    </div>
  );
}
