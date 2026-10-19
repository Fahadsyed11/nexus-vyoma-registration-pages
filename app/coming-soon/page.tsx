import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import StatusBackground from '@/components/payment/StatusBackground';

export const metadata: Metadata = {
  title: 'Registrations Opening Soon | Nexus Vyoma 2026',
  description:
    'Portal registrations for Nexus Vyoma 2026 at ISL Engineering College, Hyderabad will be opening shortly. Stay tuned.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ComingSoonPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — Shared PatternWaves Silk Background (Canvas layer z-0) */}
      <StatusBackground />

      {/* 02 — Nexus Vyoma Mirror-Glass Navbar (z-50) */}
      <Navbar alwaysVisible />

      {/* 03 — Unboxed Centered Content Section */}
      <main
        suppressHydrationWarning
        className="flex-1 min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-6 z-10 text-center select-none pt-24 sm:pt-28 pb-16"
      >
        <div className="flex flex-col items-center justify-center w-full max-w-[560px] mx-auto my-auto space-y-6">
          {/* Subtle Orange Pulsing Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#FF6A00]/30 bg-[#FF6A00]/10 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#FF6A00] font-medium">
              Registration Portal
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase">
              Coming <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FFA040]">Soon</span>
            </h1>
            <p className="font-sans text-sm sm:text-base text-zinc-400 max-w-md mx-auto leading-relaxed">
              Online registrations and event enrolments for Nexus Vyoma 2026 will go live shortly. Get your teams ready for Hyderabad’s flagship inter-college techfest.
            </p>
          </div>

          {/* Meta Info Pill */}
          <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm w-full max-w-sm flex items-center justify-around font-mono text-xs text-zinc-400">
            <div>
              <span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Dates</span>
              <span className="text-zinc-200 font-medium">10–12 Nov 2026</span>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <span className="block text-zinc-600 text-[10px] uppercase tracking-wider">Venue</span>
              <span className="text-zinc-200 font-medium">ISL Campus, Hyd</span>
            </div>
          </div>

          {/* Actions & Contact Whitelisting */}
          <div className="pt-2 flex flex-col items-center gap-4 w-full">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 hover:border-[#FF6A00]/50 text-xs font-mono tracking-widest text-zinc-300 hover:text-white transition-all uppercase outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]"
              >
                <span>&larr;</span> Back to Home
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#FF6A00]/40 bg-[#FF6A00]/10 hover:bg-[#FF6A00]/20 hover:border-[#FF6A00] text-xs font-mono tracking-widest text-[#FF8533] hover:text-white transition-all uppercase outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]"
              >
                Contact Us <span>&rarr;</span>
              </Link>
            </div>

            <p className="font-mono text-[11px] text-zinc-500 leading-normal max-w-sm">
              Need early registration access? Email on our{' '}
              <Link
                href="/contact"
                className="text-zinc-300 underline underline-offset-4 decoration-[#FF6A00]/60 hover:text-[#FF6A00] transition-colors"
              >
                Contact Us page
              </Link>{' '}
              for whitelisting.
            </p>
          </div>
        </div>
      </main>

      {/* 04 — Nexus Vyoma Cinematic Text-Stroke Footer (z-20) */}
      <FooterSection />
    </div>
  );
}
