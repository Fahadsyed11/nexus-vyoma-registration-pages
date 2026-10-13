import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import StatusBackground from '@/components/payment/StatusBackground';
import GrayscaleCraneAnimation from '@/components/construction/GrayscaleCraneAnimation';

export const metadata: Metadata = {
  title: 'Under Construction | Nexus Vyoma',
  description:
    'Under construction at Nexus Vyoma 2026, ISL Engineering College, Hyderabad.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function UnderConstructionPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — Shared PatternWaves Silk Background (Canvas layer z-0) */}
      <StatusBackground />

      {/* 02 — Nexus Vyoma Mirror-Glass Navbar (z-50) */}
      <Navbar alwaysVisible />

      {/* 03 — Unboxed Centered Content Section (Directly on PatternWaves canvas) */}
      <main className="flex-1 min-h-screen flex flex-col items-center justify-center w-full px-4 z-10 text-center select-none">
        <div className="flex flex-col items-center justify-center w-full max-w-[480px] sm:max-w-[560px] mx-auto my-auto">
          {/* Compact, minimal white-outline crane construction animation */}
          <GrayscaleCraneAnimation />

          {/* Small, subtle, uppercase label beneath the illustration */}
          <h1 className="font-mono text-[10px] sm:text-xs tracking-[0.3em] uppercase text-zinc-400 mt-4 sm:mt-5">
            UNDER CONSTRUCTION
          </h1>

          {/* Subtle, unobtrusive Back to Home text link */}
          <Link
            href="/"
            className="font-mono text-[10px] tracking-widest text-zinc-600 hover:text-zinc-300 transition-colors uppercase mt-2 outline-none focus-visible:ring-1 focus-visible:ring-zinc-400"
          >
            BACK TO HOME &rarr;
          </Link>
        </div>
      </main>

      {/* 04 — Nexus Vyoma Cinematic Text-Stroke Footer (z-20) */}
      <FooterSection />
    </div>
  );
}
