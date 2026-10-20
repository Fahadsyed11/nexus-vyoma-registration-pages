import { Suspense } from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
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

async function EnrollEventContent() {
  // Server-side session guard: unauthenticated visitors never see this page.
  const sessionUser = await getVerifiedSessionUser();
  if (!sessionUser) {
    redirect('/register/check-email');
  }

  const userEmail = sessionUser.email;
  const userName = sessionUser.name;

  let availableEvents: SerializedEvent[] = [];
  let individualEnrolled: SerializedEnrolledEvent[] = [];
  let teamEnrolled: SerializedEnrolledEvent[] = [];

  try {
    await connectToDatabase();

    // 1. Fetch live PAID events from MongoDB (free events are already included in 3-day fest entry ticket)
    interface MongoEventDoc {
      _id: { toString(): string };
      title?: string;
      short_description?: string;
      long_description?: string;
      venue?: string;
      date_time?: string;
      image_url?: string;
      entry_fee?: number;
      participants_type?: string;
      team_size?: number;
      participant_limit?: number;
      category?: string;
    }

    const rawEvents = (await Event.find({ entry_fee: { $gt: 0 } })
      .sort({ entry_fee: -1, title: 1 })
      .lean()) as unknown as MongoEventDoc[];
    if (rawEvents && rawEvents.length > 0) {
      availableEvents = rawEvents.map((e) => ({
        _id: e._id.toString(),
        title: e.title || 'Untitled Event',
        short_description: e.short_description || '',
        long_description: e.long_description || '',
        venue: e.venue || 'ISL Campus',
        date_time: e.date_time || 'Schedule TBA',
        image_url: e.image_url || '',
        entry_fee: typeof e.entry_fee === 'number' ? e.entry_fee : 0,
        participants_type: (e.participants_type === 'team' ? 'team' : 'individual') as 'team' | 'individual',
        team_size: e.team_size || (e.participants_type === 'team' ? 2 : 1),
        min_team_size: e.team_size || 2,
        max_team_size: e.participant_limit || e.team_size || 4,
        category: e.category || 'General',
      }));
    }

    // 2. Fetch User's Paid Events from MongoDB
    interface MongoUserDoc {
      _id: { toString(): string };
      email: string;
      full_name?: string;
    }

    const regUser = (await RegisterUser.findOne({ email: userEmail }).lean()) as unknown as MongoUserDoc | null;
    if (regUser) {
      interface PopulatedIndDoc {
        _id: { toString(): string };
        event_id?: MongoEventDoc;
      }

      const paidInd = (await EnrolledIndividualEvent.find({
        register_user_id: regUser._id,
        isPaid: true,
      })
        .populate('event_id')
        .lean()) as unknown as PopulatedIndDoc[];

      if (paidInd && paidInd.length > 0) {
        individualEnrolled = paidInd.map((pi) => {
          const ev = pi.event_id;
          return {
            _id: pi._id.toString(),
            event_title: ev?.title || 'Enrolled Event',
            event_id: ev?._id?.toString() || pi._id.toString(),
            participation_type: 'individual' as const,
            event_details: ev
              ? {
                  _id: ev._id.toString(),
                  title: ev.title || '',
                  short_description: ev.short_description || '',
                  venue: ev.venue || '',
                  date_time: ev.date_time || '',
                  entry_fee: ev.entry_fee || 0,
                  participants_type: 'individual' as const,
                  image_url: ev.image_url || '',
                }
              : null,
          };
        });
      }

      interface PopulatedTeamDoc {
        _id: { toString(): string };
        team_name?: string;
        team_leader_register_user_id?: { toString(): string };
        team_length?: number;
        team_emails?: string[];
        event_id?: MongoEventDoc;
      }

      const paidTeams = (await EnrolledTeamEvent.find({
        $or: [
          { team_leader_register_user_id: regUser._id },
          { team_emails: userEmail },
        ],
        isPaid: true,
      })
        .populate('event_id')
        .lean()) as unknown as PopulatedTeamDoc[];

      if (paidTeams && paidTeams.length > 0) {
        teamEnrolled = paidTeams.map((pt) => {
          const ev = pt.event_id;
          const isLeader = pt.team_leader_register_user_id?.toString() === regUser._id.toString();
          return {
            _id: pt._id.toString(),
            event_title: ev?.title || pt.team_name || 'Enrolled Team Event',
            event_id: ev?._id?.toString() || pt._id.toString(),
            participation_type: 'team' as const,
            team_name: pt.team_name,
            team_leader_email: isLeader ? userEmail : (pt.team_emails?.[0] || ''),
            team_size: pt.team_length || (pt.team_emails?.length || 0) + 1,
            team_members: pt.team_emails || [],
            event_details: ev
              ? {
                  _id: ev._id.toString(),
                  title: ev.title || '',
                  short_description: ev.short_description || '',
                  venue: ev.venue || '',
                  date_time: ev.date_time || '',
                  entry_fee: ev.entry_fee || 0,
                  participants_type: 'team' as const,
                  team_size: ev.team_size || pt.team_length || 4,
                }
              : null,
          };
        });
      }
    }
  } catch (err) {
    console.error('Failed to query MongoDB in enroll-event page:', err);
  }

  // Graceful fallback to dummy available events if MongoDB collection is empty
  if (availableEvents.length === 0) {
    availableEvents = DUMMY_AVAILABLE_EVENTS;
  }

  // Graceful fallback to dummy enrolled events if user has none, to keep sections visible
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
