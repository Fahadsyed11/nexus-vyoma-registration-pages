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

async function CheckoutEventContent() {
  const cookieStore = await cookies();
  const sessionToken =
    cookieStore.get('nv-session')?.value || cookieStore.get('nv-session-temp')?.value;

  if (!sessionToken) {
    redirect('/register/check-email');
  }

  const payload = verifyJWT(sessionToken) as TokenPayload | null;
  const userEmail = payload?.user?.email || payload?.email;
  const userId = payload?.user?.id;

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
      participation_type: 'team',
      team_name: doc.team_name,
      team_leader_email: user.email,
      team_size: doc.team_length || (doc.team_emails ? doc.team_emails.length + 1 : 1),
      team_members: doc.team_emails || [],
    };
  });

  return (
    <CheckoutEventView
      userName={user.full_name || 'Attendee'}
      userEmail={user.email}
      userPhone={user.phone_number}
      userInstitution={user.institution}
      userDegree={user.degree}
      userProfileImage={user.profile_image}
      unpaidIndividualEvents={unpaidIndividualEvents}
      unpaidTeamEvents={unpaidTeamEvents}
    />
  );
}

export default function CheckoutEventPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — Official Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Stage */}
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 bg-[#000000]">
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
