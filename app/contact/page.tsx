import type { Metadata } from 'next';
import Navbar from '@/components/navbar/Navbar';
import ContactSection from '@/components/contact/ContactSection';
import FooterSection from '@/components/footer/FooterSection';

export const metadata: Metadata = {
  title: 'Contact Us | Nexus Vyoma',
  description:
    'Get in touch with the Nexus Vyoma team at ISL Engineering College, Hyderabad. Inquire about events, passes, registrations, and partnerships.',
  openGraph: {
    title: 'Contact Us | Nexus Vyoma',
    description:
      'Official contact portal for Nexus Vyoma 2026 at ISL Engineering College, Hyderabad.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 — Shared Nexus Vyoma Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Contact Section Container */}
      <main
        suppressHydrationWarning
        className="flex-1 flex flex-col items-center justify-center w-full px-2.5 sm:px-4 md:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16 z-10"
      >
        <ContactSection />
      </main>

      {/* 03 — Shared Cinematic Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
