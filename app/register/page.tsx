import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import RegistrationGridBackground from '@/components/registration/RegistrationGridBackground';
import RegistrationFormStep from '@/components/registration/RegistrationFormStep';
import { verifyJWT } from '@/utilities/jwt';
import { connectToDatabase } from '@/database/db';
import RegisterUser from '@/database/schema/register-user.schema';

export const metadata: Metadata = {
  title: 'Complete Registration | Nexus Vyoma 2026',
  description:
    'Complete your registration details for Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
};

interface JWTPayloadUser {
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
  email?: string;
}

export default async function RegisterPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('nv-session')?.value || cookieStore.get('nv-session-temp')?.value;

  if (!sessionToken) {
    redirect('/register/check-email');
  }

  const payload = verifyJWT(sessionToken) as JWTPayloadUser | null;
  const verifiedEmail = payload?.user?.email || payload?.email;

  if (!verifiedEmail) {
    redirect('/register/check-email');
  }

  await connectToDatabase();
  const existingUser = await RegisterUser.findOne({ email: verifiedEmail });

  // If user has already completed registration, route to confirmed ticket status
  if (existingUser && existingUser.full_name && existingUser.institution) {
    redirect('/payment/success');
  }

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — ShapeGrid background */}
      <RegistrationGridBackground />

      {/* 02 — Nexus Vyoma Official Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 03 — Center Form Stage */}
      <main className="flex-1 min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-12 z-10">
        <RegistrationFormStep verifiedEmail={verifiedEmail} />
      </main>
    </div>
  );
}
