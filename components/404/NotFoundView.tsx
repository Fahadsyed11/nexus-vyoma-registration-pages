'use client';

import React from 'react';
import Link from 'next/link';
import FluxLines from './FluxLines';
import TechText from './TechText';

export default function NotFoundView() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        backgroundColor: '#000000',
        color: '#ffffff',
        overflow: 'hidden',
      }}
    >
      {/* ========================================================================= */}
      {/* LAYER 1: Solid base background                                            */}
      {/* ========================================================================= */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#000000',
          zIndex: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      {/* ========================================================================= */}
      {/* LAYER 2: Official React Bits Flux Lines background effect (White Lines)    */}
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
          </Link>
        </header>

        {/* Center Main Stage */}
        <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center my-auto py-4 text-center pointer-events-none">
          {/* Main animated TechText 404 Heading */}
          <div
            style={{
              width: '100%',
              height: 'min(480px, 45vh)',
              minHeight: '240px',
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
              fontFamily=""
              color="#ffffff"
              accentColor="#ffffff"
              letterSpacing={-0.05}
              reach={200}
              softness={0.7}
              strokeWidth={1.5}
              speed={1}
              lineStyle="dashed"
              selection
              labels
              draggable
              sweep
            />
          </div>

          {/* Action Buttons */}
          <div
            style={{ pointerEvents: 'auto' }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-sm sm:max-w-md"
          >
            {/* Primary Action Button */}
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-7 py-2.5 rounded-lg border border-white/20 bg-white hover:bg-zinc-200 text-black font-sans font-semibold text-xs sm:text-sm tracking-wider uppercase backdrop-blur-md transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]"
            >
              BACK TO HOME
            </Link>

            {/* Explore Events Link */}
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-lg border border-white/20 hover:border-white/40 font-sans font-medium text-xs sm:text-sm text-white hover:bg-white/10 tracking-wider uppercase transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]"
            >
              EXPLORE EVENTS
            </Link>
          </div>
        </main>

        {/* Footer Telemetry */}
        <footer
          style={{ pointerEvents: 'auto' }}
          className="w-full max-w-7xl mx-auto px-5 sm:px-8 pb-6 sm:pb-8 flex flex-wrap items-center justify-between gap-3 text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-500 uppercase"
        >
          <span>NEXUS VYOMA // ISL ENGINEERING COLLEGE, HYDERABAD</span>
          <span>17.38405° N / 78.45636° E</span>
        </footer>
      </div>
    </div>
  );
}
