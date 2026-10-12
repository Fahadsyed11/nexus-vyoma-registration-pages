import Link from 'next/link';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';

export default function EventNotFound() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-[#FF6A00] selection:text-white">
      {/* 01 — Shared Nexus Vyoma Mirror-Glass Navbar */}
      <Navbar alwaysVisible />

      {/* 02 — Main Framed Container */}
      <main className="flex-1 flex flex-col items-center justify-center w-full px-3 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-10 sm:pb-14 z-10">
        <div className="w-full max-w-7xl mx-auto rounded-2xl sm:rounded-3xl border border-zinc-800/90 bg-black/70 p-8 sm:p-14 text-center shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col items-center justify-center min-h-[420px]">
          <span className="font-mono text-xs uppercase tracking-widest text-[#FF6A00] font-bold px-3 py-1 rounded-md bg-black/60 border border-[#FF6A00]/30 mb-4 select-none">
            404 / NOT FOUND
          </span>
          <h1 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-black uppercase text-white tracking-wide mb-4">
            EVENT NOT FOUND
          </h1>
          <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto leading-relaxed mb-8">
            The event you are looking for does not exist in the official schedule or may have been updated.
          </p>
          <Link
            href="/events"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-lg border border-[#FF6A00] bg-transparent text-[#FF6A00] hover:bg-[#FF6A00]/10 hover:shadow-[0_0_24px_rgba(255,106,0,0.3)] transition-all duration-200 font-sans font-bold text-xs sm:text-sm tracking-wider uppercase select-none outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
          >
            ← BACK TO EVENTS
          </Link>
        </div>
      </main>

      {/* 03 — Shared Cinematic Text-Stroke Footer */}
      <FooterSection />
    </div>
  );
}
