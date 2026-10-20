import type { Metadata } from 'next';
import Script from 'next/script';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import CheckoutEventView from '@/components/registration/CheckoutEventView';

export const metadata: Metadata = {
  title: 'Checkout Event | Nexus Vyoma 2026',
  description:
    'Confirm your event enrollments and complete checkout for Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
};

export default function CheckoutEventPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* Cashfree v3 SDK */}
      <Script src="https://sdk.cashfree.com/js/v3/cashfree.js" strategy="afterInteractive" />

      {/* 01 — Official Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Stage */}
      <main
        suppressHydrationWarning
        className="flex-1 w-full px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-16 z-10 bg-[#000000]"
      >
        <CheckoutEventView />
      </main>

      {/* 03 — Official Footer */}
      <FooterSection />
    </div>
  );
}
