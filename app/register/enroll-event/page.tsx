import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
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
import enrolledEventModel from '@/database/schema/enrolled-event.schema';
import { EVENTS_CATALOG } from '@/lib/data/eventsCatalog';

export const metadata: Metadata = {
  title: 'Event Enrolment | Nexus Vyoma 2026',
  description:
    'Enroll in individual and team events, competitions, and workshops for Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
};

interface EnrollEventPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function EnrollEventContent({ searchParams }: EnrollEventPageProps) {
  const params = searchParams ? await searchParams : {};
  const queryEmail = typeof params.email === 'string' ? params.email.trim() : undefined;

  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get('nv-session')?.value || cookieStore.get('nv-session-temp')?.value;

  let userEmail: string | undefined;

  if (sessionToken) {
    const payload = verifyJWT(sessionToken) as {
      user?: { id?: string; name?: string; email?: string };
      email?: string;
    } | null;
    userEmail = payload?.user?.email || payload?.email;
  }

  // Fallback to demo attendee when no session token is present so the page is always directly accessible
  if (!userEmail) {
    userEmail = queryEmail || 'syedaliquadri100@gmail.com';
  }

  await connectToDatabase();

  // 1. Fetch user profile
  const user = await RegisterUser.findOne({ email: userEmail });
  const userName = user?.full_name || 'Attendee';

  // 2. Fetch available events from DB
  const rawDbEvents = await Event.find({}).lean();
  let availableEvents: SerializedEvent[] = rawDbEvents.map((e) => ({
    _id: String(e._id),
    title: e.title,
    short_description: e.short_description,
    long_description: e.long_description,
    venue: e.venue,
    date_time: e.date_time,
    image_url: e.image_url,
    entry_fee: Number(e.entry_fee) || 0,
    participants_type: (e.participants_type as 'individual' | 'team') || 'individual',
    team_size: Number(e.team_size) || 1,
    min_team_size: Number(e.min_team_size) || 1,
    max_team_size: Number(e.max_team_size) || 1,
    category: e.category,
  }));

  // Dummy events for complete visual presentation matching wireframe
  const DUMMY_AVAILABLE_EVENTS: SerializedEvent[] = [
    {
      _id: 'dummy-avail-ind-1',
      title: 'Fastest Finger First (Typing)',
      short_description: 'High-speed blind typing contest testing WPM speed, precision, and accuracy.',
      venue: 'Lab 02, Block B',
      date_time: '10 Nov 2026 • 01:00 PM',
      entry_fee: 50,
      participants_type: 'individual',
      category: 'Technical',
    },
    {
      _id: 'dummy-avail-ind-2',
      title: 'Auto CAD Master Challenge',
      short_description: '2D & 3D precision mechanical drafting and structural modeling showdown.',
      venue: 'CADD Center, Mech Block',
      date_time: '11 Nov 2026 • 11:00 AM',
      entry_fee: 150,
      participants_type: 'individual',
      category: 'Design',
    },
    {
      _id: 'dummy-avail-ind-3',
      title: 'Beatboxing & Solo Rap Arena',
      short_description: 'Live microphone freestyle cipher and rhythm battles.',
      venue: 'Open Stage Arena',
      date_time: '11 Nov 2026 • 05:00 PM',
      entry_fee: 0,
      participants_type: 'individual',
      category: 'Cultural',
    },
    {
      _id: 'dummy-avail-team-1',
      title: 'Robo Wars (Heavyweight)',
      short_description: 'Combat robotics battle in bulletproof enclosed steel pit arena.',
      venue: 'Central Quadrangle Arena',
      date_time: '12 Nov 2026 • 02:00 PM',
      entry_fee: 600,
      participants_type: 'team',
      team_size: 4,
      min_team_size: 2,
      max_team_size: 4,
      category: 'Robotics',
    },
    {
      _id: 'dummy-avail-team-2',
      title: 'Battle of the Bands',
      short_description: 'Live musical ensemble face-off across rock, fusion, and metal genres.',
      venue: 'Main Festival Stage',
      date_time: '12 Nov 2026 • 06:30 PM',
      entry_fee: 800,
      participants_type: 'team',
      team_size: 5,
      min_team_size: 3,
      max_team_size: 6,
      category: 'Cultural',
    },
    {
      _id: 'dummy-avail-team-3',
      title: 'Project Expo & Shark Tank',
      short_description: 'Working hardware/software startup ideas pitched to venture capitalists.',
      venue: 'Innovation Hub',
      date_time: '10 Nov 2026 • 10:00 AM',
      entry_fee: 300,
      participants_type: 'team',
      team_size: 3,
      min_team_size: 2,
      max_team_size: 4,
      category: 'Innovation',
    },
  ];

  // Merge database events with dummy catalog
  availableEvents = [...availableEvents, ...DUMMY_AVAILABLE_EVENTS];

  // 3. Fetch user's enrolled events
  const enrolledDocs = await enrolledEventModel
    .find({
      $or: [
        { user_email: userEmail },
        ...(user?._id ? [{ register_user_id: user._id }] : []),
      ],
    })
    .lean();

  const eventMap = new Map(availableEvents.map((ev) => [ev._id, ev]));

  const allEnrolled: SerializedEnrolledEvent[] = enrolledDocs.map((doc) => {
    const matchedEvent = eventMap.get(String(doc.event_id)) || null;
    return {
      _id: String(doc._id),
      event_title: doc.event_title,
      event_id: String(doc.event_id),
      participation_type: (doc.participation_type as 'individual' | 'team') || 'individual',
      team_name: doc.team_name ?? null,
      team_leader_email: doc.team_leader_email ?? null,
      team_size: doc.team_size ?? null,
      team_members: doc.team_members || [],
      event_details: matchedEvent,
    };
  });

  let individualEnrolled = allEnrolled.filter(
    (e) => e.participation_type === 'individual'
  );
  let teamEnrolled = allEnrolled.filter((e) => e.participation_type === 'team');

  // Place dummy enrolled events if user has none, to match wireframe presentation
  if (individualEnrolled.length === 0) {
    individualEnrolled = [
      {
        _id: 'dummy-ind-1',
        event_title: 'Robo Race GP',
        event_id: 'dummy-ind-1',
        participation_type: 'individual',
        event_details: {
          _id: 'dummy-ind-1',
          title: 'Robo Race GP',
          short_description: 'High-speed autonomous and RC robot circuit race on asphalt track.',
          venue: 'Mech Quadrangle Track',
          date_time: '10 Nov 2026 • 11:30 AM',
          entry_fee: 150,
          participants_type: 'individual',
        },
      },
      {
        _id: 'dummy-ind-2',
        event_title: 'Code Sprint Battle',
        event_id: 'dummy-ind-2',
        participation_type: 'individual',
        event_details: {
          _id: 'dummy-ind-2',
          title: 'Code Sprint Battle',
          short_description: 'Fast-paced algorithmic programming challenges with live leaderboard.',
          venue: 'Computer Center Lab 3',
          date_time: '11 Nov 2026 • 02:00 PM',
          entry_fee: 100,
          participants_type: 'individual',
        },
      },
      {
        _id: 'dummy-ind-3',
        event_title: 'Anime Cosplay Showcase',
        event_id: 'dummy-ind-3',
        participation_type: 'individual',
        event_details: {
          _id: 'dummy-ind-3',
          title: 'Anime Cosplay Showcase',
          short_description: 'Costume craftsmanship, character stage walk, and performance showcase.',
          venue: 'Main Open Auditorium',
          date_time: '12 Nov 2026 • 04:30 PM',
          entry_fee: 0,
          participants_type: 'individual',
        },
      },
    ];
  }

  if (teamEnrolled.length === 0) {
    teamEnrolled = [
      {
        _id: 'dummy-team-1',
        event_title: 'Nexus Web3 Hackathon',
        event_id: 'dummy-team-1',
        participation_type: 'team',
        team_name: 'CyberDragons',
        team_leader_email: userEmail,
        team_size: 4,
        team_members: ['sarah.k@islec.edu.in', 'rohit.m@islec.edu.in', 'zayd.a@islec.edu.in'],
        event_details: {
          _id: 'dummy-team-1',
          title: 'Nexus Web3 Hackathon',
          short_description: '36-hour sprint building decentralized applications, smart contracts, and AI agents.',
          venue: 'Seminar Hall A',
          date_time: '10 Nov 2026 • 09:30 AM',
          entry_fee: 500,
          participants_type: 'team',
          team_size: 4,
        },
      },
      {
        _id: 'dummy-team-2',
        event_title: 'Valorant Championship',
        event_id: 'dummy-team-2',
        participation_type: 'team',
        team_name: 'Shadow Protocol',
        team_leader_email: userEmail,
        team_size: 5,
        team_members: ['clutch.god@islec.edu.in', 'sage.rev@islec.edu.in', 'omen.tp@islec.edu.in', 'jett.dash@islec.edu.in'],
        event_details: {
          _id: 'dummy-team-2',
          title: 'Valorant Championship',
          short_description: '5v5 tactical shooter knockout tournament with high-refresh arena setup.',
          venue: 'E-Sports Arena (Auditorium)',
          date_time: '11 Nov 2026 • 03:00 PM',
          entry_fee: 400,
          participants_type: 'team',
          team_size: 5,
        },
      },
    ];
  }

  return (
    <EventEnrollmentView
      userName={userName}
      userEmail={userEmail}
      availableEvents={availableEvents}
      initialIndividualEnrolled={individualEnrolled}
      initialTeamEnrolled={teamEnrolled}
    />
  );
}

export default function EnrollEventPage(props: EnrollEventPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Enrolment Stage */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 bg-[#000000]">
        <Suspense
          fallback={
            <div className="w-full max-w-7xl mx-auto py-20 flex items-center justify-center font-mono text-zinc-500 text-sm">
              Loading Enrolment Portal...
            </div>
          }
        >
          <EnrollEventContent {...props} />
        </Suspense>
      </main>

      {/* 03 — Footer */}
      <FooterSection />
    </div>
  );
}
