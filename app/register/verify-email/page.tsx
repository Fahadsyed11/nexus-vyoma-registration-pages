import { Suspense } from 'react';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import RegistrationGridBackground from '@/components/registration/RegistrationGridBackground';
import OtpStepForm from '@/components/registration/OtpStepForm';

export const metadata: Metadata = {
  title: 'Verify OTP | Nexus Vyoma 2026',
  description:
    'Verify your 6-digit OTP code to complete registration for Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
};

interface VerifyEmailPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function VerifyEmailContent({ searchParams }: VerifyEmailPageProps) {
  const params = searchParams ? await searchParams : {};
  const email = typeof params.email === 'string' ? params.email : '';
  const sent = typeof params.sent === 'string' ? params.sent : '';
  return <OtpStepForm key={`${email}-${sent}`} email={email} />;
}

export default function VerifyEmailPage(props: VerifyEmailPageProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — ShapeGrid background */}
      <RegistrationGridBackground />

      {/* 02 — Nexus Vyoma Official Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 03 — Center Form Stage (Wireframe Screen 2) */}
      <main className="flex-1 min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-12 z-10">
        <Suspense fallback={null}>
          <VerifyEmailContent {...props} />
        </Suspense>
      </main>
    </div>
  );
}
