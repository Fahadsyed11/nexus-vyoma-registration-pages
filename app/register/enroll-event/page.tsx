import { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import EventEnrollmentView, {
  SerializedEvent,
  SerializedEnrolledEvent,
} from '@/components/registration/EventEnrollmentView';
import { verifyJWT } from '@/utilities/jwt';
import { connectToDatabase } from '@/database/db';
import Event from '@/database/schema/event.schema';
import RegisterUser from '@/database/schema/register-user.schema';
import EnrolledIndividualEvent from '@/database/schema/enrolled-individual-event.schema';
import EnrolledTeamEvent from '@/database/schema/enrolled-team-event.schema';

interface SessionTokenData {
  user?: { id?: string; name?: string; email?: string };
}

/** Read + verify both session cookies set by /api/registration/verify-email. */
async function getVerifiedSessionUser() {
  const cookieStore = await cookies();
  const userToken = cookieStore.get('nv-session')?.value;
  const tempToken = cookieStore.get('nv-session-temp')?.value;
  if (!userToken || !tempToken) return null;

  const userData = verifyJWT(userToken) as SessionTokenData | null;
  const tempData = verifyJWT(tempToken) as SessionTokenData | null;
  if (!userData?.user?.email || !tempData?.user?.email) return null;
  if (userData.user.email !== tempData.user.email) return null;

  return {
    name: userData.user.name || 'Attendee',
    email: userData.user.email,
  };
}

export const metadata: Metadata = {
  title: 'Event Enrolment | Nexus Vyoma 2026',
  description:
    'Enroll in individual and team events, competitions, and workshops for Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
};

// ---------------------------------------------------------------------------
// Mappers: Mongoose doc -> Serialized shape expected by EventEnrollmentView
// ---------------------------------------------------------------------------

function mapEvent(e: Record<string, unknown>): SerializedEvent {
  return {
    _id: String(e._id),
    title: String(e.title ?? ''),
    short_description: e.short_description ? String(e.short_description) : undefined,
    long_description: e.long_description ? String(e.long_description) : undefined,
    venue: e.venue ? String(e.venue) : undefined,
    date_time: e.date_time ? String(e.date_time) : undefined,
    image_url: e.image_url ? String(e.image_url) : undefined,
    entry_fee: typeof e.entry_fee === 'number' ? e.entry_fee : undefined,
    participants_type: (e.participants_type as 'individual' | 'team') ?? undefined,
    team_size: typeof e.team_size === 'number' ? e.team_size : undefined,
    min_team_size: typeof e.min_team_size === 'number' ? e.min_team_size : undefined,
    max_team_size: typeof e.max_team_size === 'number' ? e.max_team_size : undefined,
    category: e.category ? String(e.category) : undefined,
  };
}

function mapEnrolledIndividual(
  doc: Record<string, unknown>,
  eventsMap: Map<string, SerializedEvent>,
): SerializedEnrolledEvent {
  const eventId = String(doc.event_id);
  const eventDetails = eventsMap.get(eventId) ?? null;
  return {
    _id: String(doc._id),
    event_id: eventId,
    event_title: eventDetails?.title ?? 'Unknown Event',
    participation_type: 'individual',
    event_details: eventDetails,
  };
}

function mapEnrolledTeam(
  doc: Record<string, unknown>,
  eventsMap: Map<string, SerializedEvent>,
  leaderEmail: string,
): SerializedEnrolledEvent {
  const eventId = String(doc.event_id);
  const eventDetails = eventsMap.get(eventId) ?? null;
  const teamEmails = Array.isArray(doc.team_emails)
    ? (doc.team_emails as string[])
    : [];
  return {
    _id: String(doc._id),
    event_id: eventId,
    event_title: eventDetails?.title ?? 'Unknown Event',
    participation_type: 'team',
    team_name: doc.team_name ? String(doc.team_name) : null,
    team_leader_email: leaderEmail,
    team_size: typeof doc.team_length === 'number' ? doc.team_length : teamEmails.length + 1,
    team_members: teamEmails,
    event_details: eventDetails,
  };
}

// ---------------------------------------------------------------------------
// Server-side data fetcher
// ---------------------------------------------------------------------------

async function fetchEnrollmentData(cookieHeader: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3000';

  const [enrollRes, paidRes, eventsRes] = await Promise.all([
    // pending reservations + available events (auth required)
    fetch(`${baseUrl}/api/enrollement/enroll-event`, {
      method: 'GET',
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    }),
    // paid enrolled events (auth required)
    fetch(`${baseUrl}/api/enrollement/enrolled-event`, {
      method: 'GET',
      headers: { cookie: cookieHeader },
      cache: 'no-store',
    }),
    // all events for event_details lookup
    fetch(`${baseUrl}/api/event`, {
      method: 'GET',
      cache: 'no-store',
    }),
  ]);

  const enrollJson = await enrollRes.json().catch(() => null);
  const paidJson   = await paidRes.json().catch(() => null);
  const eventsJson = await eventsRes.json().catch(() => null);

  return { enrollJson, enrollStatus: enrollRes.status, paidJson, eventsJson };
}

// ---------------------------------------------------------------------------
// Main async server component
// ---------------------------------------------------------------------------

async function EnrollEventContent() {
  await connection();
  // Server-side session guard.
  const sessionUser = await getVerifiedSessionUser();
  if (!sessionUser) {
    redirect('/register/check-email');
  }

  // Forward cookies so the API route can verify the session.
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ');

  const { enrollJson, enrollStatus, paidJson, eventsJson } = await fetchEnrollmentData(cookieHeader);

  // Honour redirect responses from the API (e.g. expired token).
  if (enrollJson?.redirect && enrollJson?.redirectUrl) {
    redirect(enrollJson.redirectUrl as string);
  }

  // Hard failure — send user back to the start.
  if (enrollStatus !== 200 || !enrollJson?.data) {
    redirect('/register/check-email');
  }

  const { data } = enrollJson as {
    data: {
      user: { id: string; name: string; email: string };
      availableEvents: {
        individualEvents: Record<string, unknown>[];
        teamEvents: Record<string, unknown>[];
      };
      enrollUserEvents: {
        individualEvents: Record<string, unknown>[];
        teamEvents: Record<string, unknown>[];
      };
    };
  };

  // Build a lookup map of ALL events for populating event_details on enrolled docs.
  // Falls back to available events from the enroll route if /api/event fails.
  const allRawEvents: Record<string, unknown>[] = Array.isArray(eventsJson?.data)
    ? (eventsJson.data as Record<string, unknown>[])
    : [
        ...data.availableEvents.individualEvents,
        ...data.availableEvents.teamEvents,
      ];

  const eventsMap = new Map<string, SerializedEvent>(
    allRawEvents.map((e) => {
      const mapped = mapEvent(e);
      return [mapped._id, mapped];
    }),
  );

  // Available events (user has NOT enrolled yet).
  const availableEvents: SerializedEvent[] = [
    ...data.availableEvents.individualEvents.map(mapEvent),
    ...data.availableEvents.teamEvents.map(mapEvent),
  ];

  // --- Pending (isPaid: false, reservation active) enrolled events ---
  const individualPending: SerializedEnrolledEvent[] =
    data.enrollUserEvents.individualEvents.map((doc) =>
      mapEnrolledIndividual(doc, eventsMap),
    );

  const teamPending: SerializedEnrolledEvent[] =
    data.enrollUserEvents.teamEvents.map((doc) =>
      mapEnrolledTeam(doc, eventsMap, data.user.email),
    );

  // --- Paid (isPaid: true) enrolled events — from /api/enrollement/enrolled-event ---
  const paidData = (paidJson?.data as {
    paidEvents?: {
      individualEvents: Record<string, unknown>[];
      teamEvents: Record<string, unknown>[];
    };
  } | null);

  const individualPaid: SerializedEnrolledEvent[] =
    (paidData?.paidEvents?.individualEvents ?? []).map((doc) =>
      mapEnrolledIndividual(doc, eventsMap),
    );

  const teamPaid: SerializedEnrolledEvent[] =
    (paidData?.paidEvents?.teamEvents ?? []).map((doc) =>
      mapEnrolledTeam(doc, eventsMap, data.user.email),
    );

  const userName = data.user.name || sessionUser.name;
  const userEmail = data.user.email || sessionUser.email;

  return (
    <EventEnrollmentView
      userName={userName}
      userEmail={userEmail}
      availableEvents={availableEvents}
      initialIndividualEnrolled={individualPaid}
      initialTeamEnrolled={teamPaid}
      initialIndividualPending={individualPending}
      initialTeamPending={teamPending}
    />
  );
}

export default function EnrollEventPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Enrolment Stage */}
      <main
        suppressHydrationWarning
        className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 bg-[#000000]"
      >
        <Suspense
          fallback={
            <div className="w-full max-w-7xl mx-auto py-20 flex items-center justify-center font-mono text-zinc-500 text-sm">
              Loading Enrolment Portal...
            </div>
          }
        >
          <EnrollEventContent />
        </Suspense>
      </main>

      {/* 03 — Footer */}
      <FooterSection />
    </div>
  );
}
