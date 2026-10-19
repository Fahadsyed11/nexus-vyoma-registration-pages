import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import RegistrationGridBackground from '@/components/registration/RegistrationGridBackground';
import RegistrationFormStep from '@/components/registration/RegistrationFormStep';

export const metadata: Metadata = {
  title: 'Complete Registration | Nexus Vyoma 2026',
  description:
    'Complete your registration details for Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
};

interface RegisterPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function RegisterContent({ searchParams }: RegisterPageProps) {
  const params = searchParams ? await searchParams : {};
  const queryEmail = typeof params.email === 'string' ? params.email.trim() : '';

  return <RegistrationFormStep key={queryEmail} verifiedEmail={queryEmail} />;
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
