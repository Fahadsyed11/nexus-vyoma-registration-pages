'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollReveal from '@/components/ui/ScrollReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // 1. Watermark subtle parallax reveal
      if (watermarkRef.current) {
        gsap.from(watermarkRef.current, {
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 0.8,
          },
          opacity: 0,
          scale: 0.9,
          y: 30,
        });
      }
    },
    { scope: containerRef }
  );

  const manifestoText =
    '**Nexus Vyoma** is a three-day inter-college fest where we bring together **technical** and **entertainment** events under one platform, with a grand **food fest** running throughout all three days. Students from colleges across Hyderabad will be attending this event, creating a vibrant and diverse atmosphere filled with **talent**, **innovation**, **culture** and **community**.';

  return (
    <section
      id="about"
      ref={containerRef}  
      className="relative w-full flex flex-col items-center justify-center pt-24 pb-10 sm:pt-32 sm:pb-14 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-transparent overflow-visible select-none scroll-mt-28"
    >
      <div className="w-full max-w-4xl mx-auto flex flex-col items-start">
        {/* 01 — Sleek Minimal Header: 2px Accent Line + ABOUT EVENT */}
        <div className="w-full flex flex-col items-start text-left mb-3 sm:mb-4 relative z-20">
          <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mb-2 shadow-[0_0_8px_rgba(255,106,0,0.4)]" />
          <h2 className="font-[family-name:var(--font-gondens)] text-2xl sm:text-3xl md:text-4xl font-black tracking-wider text-white uppercase flex items-center justify-start gap-2">
            <span>ABOUT</span>
            <span className="text-[#FF6A00] drop-shadow-[0_0_16px_rgba(255,106,0,0.25)]">
              EVENT
            </span>
          </h2>
        </div>

        {/* 02 — Editorial Manifesto Paragraph (Minimal, Left-aligned, Crisp 100% sharp text, Zero blur) */}
        <div className="w-full relative z-10 text-left">
          <div className="relative w-full">
            {/* Faint, Transparent Cosmic Nexus Emblem Logo Watermark (Behind Text) */}
            <div
              ref={watermarkRef}
              className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm md:max-w-md h-auto opacity-[0.05] select-none z-0 will-change-transform flex items-center justify-center"
              aria-hidden="true"
            >
              <Image
                src="/brand/nexus-emblem-watermark.png"
                alt=""
                width={400}
                height={280}
                className="w-full max-w-[320px] h-auto object-contain"
                style={{ height: 'auto' }}
              />
            </div>

            {/* Paragraph with ScrollReveal: sleek text size, crisp inline color, zero blur, pure opacity reveal */}
            <div className="relative z-10 w-full text-left">
              <ScrollReveal
                enableBlur={false}
                baseOpacity={0.4}
                baseRotation={0}
                wordAnimationStart="top 85%"
                wordAnimationEnd="bottom 60%"
                scrub={1}
                containerClassName="my-0 w-full text-left"
                textClassName="font-[family-name:var(--font-ibm-plex)] text-[14px] xs:text-[15px] sm:text-[17px] md:text-[18px] lg:text-[19px] font-light tracking-normal leading-[1.65] text-[#D4D4D8] select-none text-left not-italic"
                highlightClassName="font-[family-name:var(--font-helvetica)] font-medium text-[#FF6A00]"
                renderHighlight={(_term, words) => (
                  <span className="font-[family-name:var(--font-helvetica)] font-medium text-[#FF6A00]">
                    {words}
                  </span>
                )}
              >
                {manifestoText}
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* 03 — 3 Sleek Metallic Stat Cards (Exact Reference Match) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 w-full mt-6 sm:mt-7 z-20"
        >
          {/* Card 1: 5,000+ Footfall */}
          <div className="stat-card relative flex flex-col items-center justify-center py-5 px-3.5 sm:py-6 sm:px-4 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.015] border border-white/20 hover:border-white/35 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-0.5 group">
            <div className="text-white group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Center Person */}
                <circle cx="12" cy="7" r="3" />
                <path d="M6.5 21v-1.5a4.5 4.5 0 0 1 9 0V21" />
                {/* Left Person */}
                <circle cx="5" cy="10" r="2" />
                <path d="M1.5 21v-1a3.5 3.5 0 0 1 5-2.8" />
                {/* Right Person */}
                <circle cx="19" cy="10" r="2" />
                <path d="M17.5 17.2a3.5 3.5 0 0 1 5 2.8v1" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-gondens)] font-black text-3xl sm:text-4xl text-[#FF2525] tracking-tight mt-2.5">
              5,000+
            </span>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-zinc-300 uppercase text-center mt-1.5 leading-snug">
              ESTIMATED
              <br />
              FOOTFALL
            </span>
          </div>

          {/* Card 2: 3 Days */}
          <div className="stat-card relative flex flex-col items-center justify-center py-5 px-3.5 sm:py-6 sm:px-4 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.015] border border-white/20 hover:border-white/35 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-0.5 group">
            <div className="text-white group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="17" x="3" y="4" rx="2.5" />
                <path d="M8 2v4" />
                <path d="M16 2v4" />
                <path d="M3 9h18" />
                <circle cx="7.5" cy="12.5" r="0.75" fill="currentColor" />
                <circle cx="12" cy="12.5" r="0.75" fill="currentColor" />
                <circle cx="16.5" cy="12.5" r="0.75" fill="currentColor" />
                <circle cx="7.5" cy="16" r="0.75" fill="currentColor" />
                <circle cx="12" cy="16" r="0.75" fill="currentColor" />
                <circle cx="16.5" cy="16" r="0.75" fill="currentColor" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-gondens)] font-black text-3xl sm:text-4xl text-[#FF6A00] tracking-tight mt-2.5">
              3
            </span>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-zinc-300 uppercase text-center mt-1.5 leading-snug">
              DAYS OF
              <br />
              CELEBRATION
            </span>
          </div>

          {/* Card 3: Multiple Colleges */}
          <div className="stat-card relative flex flex-col items-center justify-center py-5 px-3.5 sm:py-6 sm:px-4 rounded-2xl bg-gradient-to-b from-white/[0.08] via-white/[0.03] to-white/[0.015] border border-white/20 hover:border-white/35 backdrop-blur-md shadow-[inset_0_1px_1px_rgba(255,255,255,0.25),0_8px_24px_rgba(0,0,0,0.65)] transition-all duration-300 hover:-translate-y-0.5 group">
            <div className="text-white group-hover:scale-105 transition-transform duration-200">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Center Person */}
                <circle cx="12" cy="7" r="3" />
                <path d="M6.5 21v-1.5a4.5 4.5 0 0 1 9 0V21" />
                {/* Left Person */}
                <circle cx="5" cy="10" r="2" />
                <path d="M1.5 21v-1a3.5 3.5 0 0 1 5-2.8" />
                {/* Right Person */}
                <circle cx="19" cy="10" r="2" />
                <path d="M17.5 17.2a3.5 3.5 0 0 1 5 2.8v1" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-gondens)] font-black text-2xl sm:text-3xl lg:text-4xl text-[#FFB800] tracking-tight mt-2.5">
              MULTIPLE
            </span>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] text-zinc-300 uppercase text-center mt-1.5 leading-snug">
              COLLEGES
              <br />
              ACROSS HYDERABAD
            </span>
          </div>
        </div>

        {/* 04 — EVENT HIGHLIGHTS Subheading (Sleek Minimal Line) */}
        <div className="w-full flex flex-col items-center text-center mt-6 sm:mt-8 mb-4 z-20">
          <h3 className="font-[family-name:var(--font-helvetica)] text-[11px] sm:text-xs font-bold tracking-[0.25em] uppercase text-zinc-300">
            EVENT HIGHLIGHTS
          </h3>
          <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mt-2 shadow-[0_0_8px_rgba(255,106,0,0.3)]" />
        </div>

        {/* 05 — 5 Minimalist Circular Highlight Badges */}
        <div
          ref={highlightsRef}
          className="flex flex-wrap items-start justify-center gap-3.5 sm:gap-5 md:gap-6 w-full z-20 px-2"
        >
          {/* 1. TECHNICAL EVENTS */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[85px] sm:max-w-[100px]">
            <div className="relative w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-white/12 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-zinc-300 group-hover:shadow-[0_0_16px_rgba(255,106,0,0.25)]">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:rotate-45 transition-transform duration-300 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[9px] sm:text-[10px] font-semibold tracking-wider text-zinc-400 uppercase text-center mt-2 leading-tight group-hover:text-zinc-200 transition-colors">
              TECHNICAL
              <br />
              EVENTS
            </span>
          </div>

          {/* 2. DJ NIGHT */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[85px] sm:max-w-[100px]">
            <div className="relative w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-white/12 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-zinc-300 group-hover:shadow-[0_0_16px_rgba(255,32,125,0.25)]">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform duration-200 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[9px] sm:text-[10px] font-semibold tracking-wider text-zinc-400 uppercase text-center mt-2 leading-tight group-hover:text-zinc-200 transition-colors">
              DJ NIGHT
            </span>
          </div>

          {/* 3. QAWWALI NIGHT */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[85px] sm:max-w-[100px]">
            <div className="relative w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-white/12 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-zinc-300 group-hover:shadow-[0_0_16px_rgba(255,184,0,0.25)]">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:-rotate-12 transition-transform duration-200 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[9px] sm:text-[10px] font-semibold tracking-wider text-zinc-400 uppercase text-center mt-2 leading-tight group-hover:text-zinc-200 transition-colors">
              QAWWALI
              <br />
              NIGHT
            </span>
          </div>

          {/* 4. AUTO FEST */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[85px] sm:max-w-[100px]">
            <div className="relative w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-white/12 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-zinc-300 group-hover:shadow-[0_0_16px_rgba(255,106,0,0.25)]">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:translate-x-0.5 transition-transform duration-200 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[9px] sm:text-[10px] font-semibold tracking-wider text-zinc-400 uppercase text-center mt-2 leading-tight group-hover:text-zinc-200 transition-colors">
              AUTO FEST
            </span>
          </div>

          {/* 5. FOOD FEST (ALL 3 DAYS) */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[85px] sm:max-w-[100px]">
            <div className="relative w-13 h-13 sm:w-16 sm:h-16 rounded-full border border-white/12 bg-gradient-to-b from-white/[0.06] to-transparent shadow-[0_4px_12px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:border-zinc-300 group-hover:shadow-[0_0_16px_rgba(255,184,0,0.25)]">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-105 transition-transform duration-200 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a3 3 0 0 0 0-6h-.18A4 4 0 0 0 18 10z" />
                <path d="M7 15h6" />
                <path d="M6 11h8" />
                <path d="M19 6l2-3" />
                <path d="M17 6h4v8h-4z" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[9px] sm:text-[10px] font-semibold tracking-wider text-zinc-400 uppercase text-center mt-2 leading-tight group-hover:text-zinc-200 transition-colors">
              FOOD FEST
              <br />
              <span className="text-zinc-500 text-[8px] sm:text-[9px] tracking-normal font-normal">
                (ALL 3 DAYS)
              </span>
            </span>
          </div>
        </div>

        {/* 06 — Bottom Brand Pillars: CULTURE | TECHNOLOGY | ENTERTAINMENT (Minimal & Refined) */}
        <div className="w-full flex flex-col items-center text-center mt-6 sm:mt-8 z-20">
          <p className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-[11px] font-semibold tracking-[0.22em] text-zinc-400 uppercase">
            CULTURE <span className="text-[#FF6A00] mx-2">|</span> TECHNOLOGY{' '}
            <span className="text-[#FF6A00] mx-2">|</span> ENTERTAINMENT
          </p>
          <div className="w-8 h-[2px] rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mt-2 shadow-[0_0_6px_rgba(255,106,0,0.3)]" />
        </div>
      </div>
    </section>
  );
}
