import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import RegistrationGridBackground from '@/components/registration/RegistrationGridBackground';
import EmailStepForm from '@/components/registration/EmailStepForm';

export const metadata: Metadata = {
  title: 'Enter Email | Nexus Vyoma 2026',
  description:
    'Enter your registered email to continue registration for Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
};

interface CheckEmailPageProps {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckEmailPage({ searchParams }: CheckEmailPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialEmail = typeof params.email === 'string' ? params.email : '';

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — Subtle Gray Grid Background ("BG - grid") */}
      <RegistrationGridBackground />

      {/* 02 — Nexus Vyoma Official Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 03 — Center Form Stage (Wireframe Screen 1) */}
      <main className="flex-1 min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-6 pt-24 sm:pt-28 pb-12 z-10">
        <EmailStepForm initialEmail={initialEmail} />
      </main>
    </div>
  );
}
