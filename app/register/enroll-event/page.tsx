import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import EventEnrollmentView, {
  SerializedEvent,
  SerializedEnrolledEvent,
} from '@/components/registration/EventEnrollmentView';

export const metadata: Metadata = {
  title: 'Event Enrolment | Nexus Vyoma 2026',
  description:
    'Enroll in individual and team events, competitions, and workshops for Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
};

interface EnrollEventPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

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

async function EnrollEventContent({ searchParams }: EnrollEventPageProps) {
  const params = searchParams ? await searchParams : {};
  const queryEmail = typeof params.email === 'string' ? params.email.trim() : undefined;
  const userEmail = queryEmail || 'attendee@nexusvyoma.com';
  const userName = 'Attendee';

  const availableEvents = DUMMY_AVAILABLE_EVENTS;
  let individualEnrolled: SerializedEnrolledEvent[] = [];
  let teamEnrolled: SerializedEnrolledEvent[] = [];

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
          <EnrollEventContent {...props} />
        </Suspense>
      </main>

      {/* 03 — Footer */}
      <FooterSection />
    </div>
  );
}
