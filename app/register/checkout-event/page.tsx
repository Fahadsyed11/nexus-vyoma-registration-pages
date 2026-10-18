import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import CheckoutEventView, {
  UnpaidIndividualEvent,
  UnpaidTeamEvent,
} from '@/components/registration/CheckoutEventView';

export const metadata: Metadata = {
  title: 'Checkout Event | Nexus Vyoma 2026',
  description:
    'Confirm your event enrollments and complete checkout for Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
};

interface CheckoutEventPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

const DUMMY_UNPAID_INDIVIDUAL_EVENTS: UnpaidIndividualEvent[] = [
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

const DUMMY_UNPAID_TEAM_EVENTS: UnpaidTeamEvent[] = [
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
    team_leader_email: 'attendee@nexusvyoma.com',
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
    team_leader_email: 'attendee@nexusvyoma.com',
    team_size: 2,
    team_members: ['zoya.khan@gmail.com'],
  },
];

async function CheckoutEventContent({ searchParams }: CheckoutEventPageProps) {
  const params = searchParams ? await searchParams : {};
  const queryEmail = typeof params.email === 'string' ? params.email.trim() : undefined;
  const userEmail = queryEmail || 'attendee@nexusvyoma.com';

  const user = {
    full_name: 'Attendee',
    email: userEmail,
    phone_number: '+91 98765 43210',
    institution: 'ISL Engineering College',
    degree: 'B.E. Computer Science',
    profile_image: undefined,
  };

  const finalIndividualEvents = DUMMY_UNPAID_INDIVIDUAL_EVENTS;
  const finalTeamEvents = DUMMY_UNPAID_TEAM_EVENTS;

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
