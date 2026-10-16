import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import CheckoutEventView, {
  UnpaidIndividualEvent,
  UnpaidTeamEvent,
} from '@/components/registration/CheckoutEventView';
import { verifyJWT } from '@/utilities/jwt';
import { connectToDatabase } from '@/database/db';
import Event from '@/database/schema/event.schema';
import RegisterUser from '@/database/schema/register-user.schema';
import EnrolledIndividualEvent from '@/database/schema/enrolled-individual-event.schema';
import EnrolledTeamEvent from '@/database/schema/enrolled-team-event.schema';

export const metadata: Metadata = {
  title: 'Checkout Event | Nexus Vyoma 2026',
  description:
    'Confirm your event enrollments and complete checkout for Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
};

interface TokenPayload {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
  email?: string;
}

interface CheckoutEventPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function CheckoutEventContent({ searchParams }: CheckoutEventPageProps) {
  const params = searchParams ? await searchParams : {};
  const queryEmail = typeof params.email === 'string' ? params.email.trim() : undefined;

  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get('nv-session')?.value || cookieStore.get('nv-session-temp')?.value;

  let userEmail: string | undefined;
  let userId: string | undefined;

  if (sessionToken) {
    const payload = verifyJWT(sessionToken) as TokenPayload | null;
    userEmail = payload?.user?.email || payload?.email;
    userId = payload?.user?.id;
  }

  // Development or query fallback to allow direct page testing without re-authenticating
  if (!userEmail && !userId && (process.env.NODE_ENV === 'development' || queryEmail)) {
    userEmail = queryEmail || 'syedaliquadri100@gmail.com';
  }

  if (!userEmail && !userId) {
    redirect('/register/check-email');
  }

  await connectToDatabase();

  // 1. Fetch real participant details
  const user = userId
    ? await RegisterUser.findById(userId)
    : await RegisterUser.findOne({ email: userEmail });

  if (!user) {
    redirect('/register/check-email');
  }

  // 2. Fetch real unpaid enrolled individual events
  const unpaidIndDocs = await EnrolledIndividualEvent.find({
    register_user_id: user._id,
    isPaid: false,
  }).lean();

  // 3. Fetch real unpaid enrolled team events
  const unpaidTeamDocs = await EnrolledTeamEvent.find({
    $or: [
      { team_leader_register_user_id: user._id },
      { team_emails: user.email },
    ],
    isPaid: false,
  }).lean();

  // 4. Fetch associated event definitions
  const allEventIds = [
    ...unpaidIndDocs.map((doc) => doc.event_id),
    ...unpaidTeamDocs.map((doc) => doc.event_id),
  ].filter(Boolean);

  const matchedEvents = await Event.find({ _id: { $in: allEventIds } }).lean();
  const eventMap = new Map(matchedEvents.map((e) => [String(e._id), e]));

  // 5. Build serialized view data
  const unpaidIndividualEvents: UnpaidIndividualEvent[] = unpaidIndDocs.map((doc) => {
    const ev = eventMap.get(String(doc.event_id));
    return {
      _id: String(doc._id),
      event_id: String(doc.event_id),
      event_title: ev?.title || 'Enrolled Event',
      entry_fee: Number(ev?.entry_fee) || 0,
      venue: ev?.venue,
      date_time: ev?.date_time,
      category: ev?.category,
      participation_type: 'individual',
    };
  });

  const unpaidTeamEvents: UnpaidTeamEvent[] = unpaidTeamDocs.map((doc) => {
    const ev = eventMap.get(String(doc.event_id));
    return {
      _id: String(doc._id),
      event_id: String(doc.event_id),
      event_title: ev?.title || 'Enrolled Team Event',
      entry_fee: Number(ev?.entry_fee) || 0,
      venue: ev?.venue,
      date_time: ev?.date_time,
      category: ev?.category,
      short_description: ev?.short_description,
      participation_type: 'team',
      team_name: doc.team_name,
      team_leader_email: user.email,
      team_size: doc.team_length || (doc.team_emails ? doc.team_emails.length + 1 : 1),
      team_members: doc.team_emails || [],
    };
  });

  let finalIndividualEvents = unpaidIndividualEvents;
  let finalTeamEvents = unpaidTeamEvents;

  // Development fallback: populate sample individual and team events for testing checkout UI
  if (
    finalIndividualEvents.length === 0 &&
    finalTeamEvents.length === 0 &&
    process.env.NODE_ENV === 'development'
  ) {
    finalIndividualEvents = [
      {
        _id: 'test-ind-1',
        event_id: '6ad08d7f9f9ab3a98264a4ac',
        event_title: 'Game Night',
        entry_fee: 99,
        venue: 'Mech Quadrangle Lab',
        date_time: '10 Nov 2026 • 02:00 PM',
        category: 'Technical',
        participation_type: 'individual',
      },
      {
        _id: 'test-ind-2',
        event_id: '6ad09e0582a80681a78c8b59',
        event_title: 'Gemini Genie- Vibe coding Hackathon',
        entry_fee: 199,
        venue: 'Turing Computing Center',
        date_time: '11 Nov 2026 • 10:00 AM',
        category: 'Technical',
        participation_type: 'individual',
      },
    ];

    finalTeamEvents = [
      {
        _id: 'test-team-1',
        event_id: '6ad1cfba257b463d35f9d976',
        event_title: 'WEB 2 BUILD – Startup Initiative Hackathon',
        entry_fee: 99,
        venue: 'Main Auditorium Hall B',
        date_time: '11 Nov 2026 • 11:30 AM',
        category: 'Technical',
        short_description:
          'High-impact 24h startup sprint to ideate, build MVP, and pitch to angel investors.',
        participation_type: 'team',
        team_name: 'HyperNova',
        team_leader_email: user.email,
        team_size: 3,
        team_members: ['aarav.sharma@gmail.com', 'priya.patel@gmail.com'],
      },
      {
        _id: 'test-team-2',
        event_id: '6ad0a57232a7f6aff8ae41c9',
        event_title: 'Financial Detectives',
        entry_fee: 99,
        venue: 'Seminar Hall 2',
        date_time: '12 Nov 2026 • 01:00 PM',
        category: 'MCQ (QUIZ)',
        short_description:
          'Solve complex corporate financial crime scenarios and forensic anomalies under time pressure.',
        participation_type: 'team',
        team_name: 'Alpha Analysts',
        team_leader_email: user.email,
        team_size: 2,
        team_members: ['zoya.khan@gmail.com'],
      },
    ];
  }

  return (
    <CheckoutEventView
      userName={user.full_name || 'Attendee'}
      userEmail={user.email}
      userPhone={user.phone_number}
      userInstitution={user.institution}
      userDegree={user.degree}
      userProfileImage={user.profile_image}
      unpaidIndividualEvents={finalIndividualEvents}
      unpaidTeamEvents={finalTeamEvents}
    />
  );
}

export default function CheckoutEventPage(props: CheckoutEventPageProps) {
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
          <CheckoutEventContent {...props} /> 
        </Suspense>
      </main>

      {/* 03 — Official Footer */}
      <FooterSection />
    </div>
  );
}
