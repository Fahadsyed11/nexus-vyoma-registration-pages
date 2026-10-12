'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FluxLines from './FluxLines';
import TechText from './TechText';

export default function NotFoundView() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(false);

  useEffect(() => {
    // Check if the user navigated from another page on the same domain
    if (typeof window !== 'undefined' && window.history.length > 1) {
      setCanGoBack(true);
    }
  }, []);

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    if (canGoBack && typeof window !== 'undefined') {
      window.history.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        backgroundColor: '#080808',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* ========================================================================= */}
      {/* LAYER 1: Solid dark base background (prevents white page bleed-through)   */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#080808',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* LAYER 2: Official React Bits Flux Lines background effect                  */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'auto',
        }}
      >
        <FluxLines
          colors={["#ffffff", "#ffffff", "#ffffff"]}
          glow={2}
          rimWidth={0.2}
          lineWidth={1}
          flowDirection="down"
          mouseInteraction
          clickSwirl
          speed={0.5}
          scale={1.6}
          turbulence={1}
          fluidity={0.1}
          sharpness={2.5}
          shimmer={1.5}
          mouseStrength={1}
          mouseRadius={0.35}
          intro
          lightMode={false}
        />
      </div>

      {/* ========================================================================= */}
      {/* LAYER 3: Foreground Content (Interactive TechText, text, buttons, footer) */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          minHeight: '100svh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          pointerEvents: 'none',
        }}
        className="w-full min-h-screen select-none"
      >
        {/* Top Header / Telemetry Bar */}
        <header
          style={{ pointerEvents: 'auto' }}
          className="w-full max-w-7xl mx-auto px-5 sm:px-8 pt-6 sm:pt-8 flex items-center justify-between"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]"
            aria-label="Nexus Vyoma Home"
          >
            <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl tracking-wider text-white uppercase group-hover:text-zinc-300 transition-colors">
              NEXUS VYOMA
            </span>
          </Link>

          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-black/70 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-300">
              SIGNAL_LOST // ERR_404
            </span>
          </div>
        </header>

        {/* Center Main Stage */}
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center my-auto py-4 text-center pointer-events-none">
          {/* Main animated TechText 404 Heading */}
          <div
            style={{
              width: '100%',
              height: 'min(480px, 42vh)',
              minHeight: '220px',
              position: 'relative',
              pointerEvents: 'auto',
            }}
            className="flex items-center justify-center"
          >
            <TechText
              text="404"
              fontWeight={600}
              fontSize={150}
              reveal="letter"
              dashLength={4}
              dashGap={2}
              specks={15}
            />
          </div>

          {/* Secondary Heading */}
          <h1
            style={{ pointerEvents: 'auto' }}
            className="mt-2 sm:mt-4 font-[family-name:var(--font-display)] text-2xl xs:text-3xl sm:text-4xl md:text-5xl uppercase tracking-wider text-white"
          >
            LOST IN SPACE
          </h1>

          {/* Description */}
          <p
            style={{ pointerEvents: 'auto' }}
            className="mt-2.5 sm:mt-3 font-sans text-xs sm:text-sm md:text-base text-zinc-300 max-w-md mx-auto leading-relaxed"
          >
            The page you&apos;re looking for has drifted beyond our coordinates.
          </p>

          {/* Action Buttons */}
          <div
            style={{ pointerEvents: 'auto' }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-sm sm:max-w-md"
          >
            {/* Primary Action Button */}
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-7 py-2.5 rounded-lg border border-white/25 bg-black/60 hover:bg-white/10 hover:border-white/50 hover:shadow-[0_0_24px_rgba(255,106,0,0.3)] text-white font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]"
            >
              BACK TO HOME
            </Link>

            {/* Secondary Action Text Link */}
            <button
              type="button"
              onClick={handleReturn}
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-4 py-2 font-mono text-[11px] sm:text-xs text-zinc-400 hover:text-white tracking-widest uppercase transition-colors duration-200 outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 cursor-pointer"
            >
              RETURN TO PREVIOUS PAGE
            </button>
          </div>
        </main>

        {/* Footer Telemetry */}
        <footer
          style={{ pointerEvents: 'auto' }}
          className="w-full max-w-7xl mx-auto px-5 sm:px-8 pb-6 sm:pb-8 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-400 uppercase"
        >
          <span>NEXUS VYOMA // ISL ENGINEERING COLLEGE, HYDERABAD</span>
          <span>17.38405° N / 78.45636° E</span>
        </footer>
      </div>
    </div>
  );
}
