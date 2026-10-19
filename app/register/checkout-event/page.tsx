import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { connection } from 'next/server';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import CheckoutEventView, {
  UnpaidIndividualEvent,
  UnpaidTeamEvent,
} from '@/components/registration/CheckoutEventView';
import { verifyJWT } from '@/utilities/jwt';

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata: Metadata = {
  title: 'Checkout Event | Nexus Vyoma 2026',
  description:
    'Confirm your event enrollments and complete checkout for Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
};

// ---------------------------------------------------------------------------
// Session helper (mirrors enroll-event pattern)
// ---------------------------------------------------------------------------

interface SessionTokenData {
  user?: { id?: string; name?: string; email?: string };
}

async function getVerifiedSessionUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('nv-session')?.value;
  if (!token) return null;
  try {
    const data = verifyJWT(token) as SessionTokenData | null;
    if (!data?.user?.id) return null;
    return {
      id: data.user.id,
      name: data.user.name ?? '',
      email: data.user.email ?? '',
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Types that mirror the order-summary API response
// ---------------------------------------------------------------------------

interface ApiMember {
  email: string;
  name?: string;
  isRegistered: boolean;
  isEntryTicketPurchased: boolean;
  entryTicketPrice: number;
  requiresRegistration: boolean;
}

interface ApiTeamEventDetail {
  enrollmentId: unknown;
  teamName: string;
  eventId: unknown;
  eventName: string;
  eventPrice: number;
  teamMembers: ApiMember[];
}

interface ApiIndividualEventDetail {
  enrollmentId: unknown;
  eventId: unknown;
  eventName: string;
  eventPrice: number;
}

interface ApiOrderSummaryData {
  user: { id: unknown; name: string; email: string };
  individualEventDetails: ApiIndividualEventDetail[];
  teamEventDetails: ApiTeamEventDetail[];
  entryTicketDetails: { isPurchased: boolean; price: number };
  pricing: {
    totalTeamEventsPrice: number;
    totalIndividualEventsPrice: number;
    totalEntryTicketPrice: number;
    grandTotal: number;
    currency: string;
  };
}

interface ApiEventDoc {
  _id?: unknown;
  venue?: unknown;
  date_time?: unknown;
  category?: unknown;
  short_description?: unknown;
}

// ---------------------------------------------------------------------------
// Server-side data fetcher
// ---------------------------------------------------------------------------

async function fetchCheckoutData(cookieHeader: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

  const [orderRes, eventsRes] = await Promise.all([
    // Order summary — computes grand total server-side (auth required)
    fetch(`${baseUrl}/api/checkout/order-summary`, {
      method: 'POST',
      headers: {
        cookie: cookieHeader,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    }),
    // Full event catalogue for venue / date / category lookup
    fetch(`${baseUrl}/api/event`, {
      method: 'GET',
      cache: 'no-store',
    }),
  ]);

  const orderJson = await orderRes.json().catch(() => null);
  const eventsJson = await eventsRes.json().catch(() => null);

  return { orderJson, orderStatus: orderRes.status, eventsJson };
}

// ---------------------------------------------------------------------------
// Async Server Component
// ---------------------------------------------------------------------------

async function CheckoutEventContent() {
  await connection();
  // Auth guard
  const sessionUser = await getVerifiedSessionUser();
  if (!sessionUser) {
    redirect('/register/check-email');
  }

  // Forward cookies so API route can verify the session
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const { orderJson, orderStatus, eventsJson } = await fetchCheckoutData(cookieHeader);

  // Honour API-level redirects (expired session, no active reservations, etc.)
  if (orderJson?.redirect && orderJson?.redirectUrl) {
    redirect(orderJson.redirectUrl as string);
  }

  // Hard failure — send user back to enrolment
  if (orderStatus !== 200 || !orderJson?.data) {
    redirect('/register/enroll-event');
  }

  const { data } = orderJson as { data: ApiOrderSummaryData };

  // Build a lookup map: eventId → venue, date_time, category, short_description
  const eventsMap = new Map<
    string,
    { venue?: string; date_time?: string; category?: string; short_description?: string }
  >();

  if (Array.isArray(eventsJson?.data)) {
    for (const ev of eventsJson.data as ApiEventDoc[]) {
      const id = String(ev._id ?? '').trim();
      if (!id) continue;
      eventsMap.set(id, {
        venue:             ev.venue            ? String(ev.venue)            : undefined,
        date_time:         ev.date_time        ? String(ev.date_time)        : undefined,
        category:          ev.category         ? String(ev.category)         : undefined,
        short_description: ev.short_description ? String(ev.short_description) : undefined,
      });
    }
  }

  // Map individual event enrollments
  const unpaidIndividualEvents: UnpaidIndividualEvent[] =
    (data.individualEventDetails ?? []).map((ev) => {
      const eventId = String(ev.eventId ?? '');
      const details = eventsMap.get(eventId);
      return {
        _id:               String(ev.enrollmentId ?? ''),
        event_id:          eventId,
        event_title:       ev.eventName,
        entry_fee:         ev.eventPrice,
        venue:             details?.venue,
        date_time:         details?.date_time,
        category:          details?.category,
        participation_type: 'individual' as const,
      };
    });

  // Map team event enrollments (includes per-member entry ticket data)
  const unpaidTeamEvents: UnpaidTeamEvent[] =
    (data.teamEventDetails ?? []).map((ev) => {
      const eventId = String(ev.eventId ?? '');
      const details = eventsMap.get(eventId);
      const members: ApiMember[] = Array.isArray(ev.teamMembers) ? ev.teamMembers : [];

      return {
        _id:               String(ev.enrollmentId ?? ''),
        event_id:          eventId,
        event_title:       ev.eventName,
        entry_fee:         ev.eventPrice,
        venue:             details?.venue,
        date_time:         details?.date_time,
        category:          details?.category,
        short_description: details?.short_description,
        participation_type: 'team' as const,
        team_name:         ev.teamName,
        team_leader_email: data.user.email,
        // team_size = other members + leader
        team_size:         members.length + 1,
        team_members:      members.map((m) => m.email),
        memberEntryTickets: members.map((m) => ({
          email:             m.email,
          entryTicketPrice:  m.entryTicketPrice ?? 0,
          isRegistered:      Boolean(m.isRegistered),
          requiresRegistration: Boolean(m.requiresRegistration),
        })),
      };
    });

  return (
    <CheckoutEventView
      userName={data.user.name || sessionUser.name}
      userEmail={data.user.email || sessionUser.email}
      unpaidIndividualEvents={unpaidIndividualEvents}
      unpaidTeamEvents={unpaidTeamEvents}
      entryTicketDetails={data.entryTicketDetails}
      serverPricing={data.pricing}
    />
  );
}

// ---------------------------------------------------------------------------
// Page shell
// ---------------------------------------------------------------------------

export default function CheckoutEventPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — Official Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Stage */}
      <main
        suppressHydrationWarning
        className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 bg-[#000000]"
      >
        <Suspense
          fallback={
            <div className="w-full max-w-4xl mx-auto py-20 flex items-center justify-center font-mono text-zinc-500 text-sm">
              Loading Checkout Portal...
            </div>
          }
        >
          <CheckoutEventContent />
        </Suspense>
      </main>

      {/* 03 — Official Footer */}
      <FooterSection />
    </div>
  );
}
