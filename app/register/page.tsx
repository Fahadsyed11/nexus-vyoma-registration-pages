import { Suspense } from 'react';
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

interface RegisterPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function RegisterContent({ searchParams }: RegisterPageProps) {
  const params = searchParams ? await searchParams : {};
  const queryEmail = typeof params.email === 'string' ? params.email.trim() : undefined;
  const isPreview = params.preview === '1' || params.preview === 'true';

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('nv-session')?.value || cookieStore.get('nv-session-temp')?.value;

  let verifiedEmail: string | undefined;

  if (sessionToken) {
    const payload = verifyJWT(sessionToken) as JWTPayloadUser | null;
    verifiedEmail = payload?.user?.email || payload?.email;
  }

  // Development or preview fallback to allow direct form access without session
  if (!verifiedEmail && (process.env.NODE_ENV === 'development' || isPreview || queryEmail)) {
    verifiedEmail = queryEmail || 'attendee@nexusvyoma.com';
  }

  if (!verifiedEmail) {
    redirect('/register/check-email');
  }

  await connectToDatabase();
  const existingUser = await RegisterUser.findOne({ email: verifiedEmail });

  // In production, route completed registrants to ticket status.
  // In development, keep the form accessible so it can be previewed and tested repeatedly.
  const shouldEnforceRedirect = process.env.NODE_ENV === 'production' || params.enforce === '1';
  if (existingUser && existingUser.full_name && existingUser.institution && shouldEnforceRedirect && !isPreview) {
    redirect('/payment/success');
  }

  return <RegistrationFormStep verifiedEmail={verifiedEmail} />;
}

export default function RegisterPage(props: RegisterPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — ShapeGrid background */}
      <RegistrationGridBackground />

      {/* 02 — Nexus Vyoma Official Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 03 — Center Form Stage */}
      <main className="flex-1 min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-12 z-10">
        <Suspense fallback={null}>
          <RegisterContent {...props} />
        </Suspense>
      </main>
    </div>
  );
}
