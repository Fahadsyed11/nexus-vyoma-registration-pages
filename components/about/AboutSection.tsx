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
          scale: 0.88,
          y: 40,
        });
      }

      // 2. Stat cards subtle staggered reveal
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll('.stat-card');
        gsap.from(cards, {
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 24,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        });
      }

      // 3. Circular highlight badges staggered entrance
      if (highlightsRef.current) {
        const badges = highlightsRef.current.querySelectorAll('.highlight-badge');
        gsap.from(badges, {
          scrollTrigger: {
            trigger: highlightsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          scale: 0.9,
          y: 20,
          opacity: 0,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
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
      className="relative w-full flex flex-col items-center justify-center pt-12 pb-10 sm:pt-16 sm:pb-12 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-transparent overflow-visible select-none"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col items-start">
        {/* 01 — Section Header: Gradient Accent Pill + ABOUT EVENT Title (Left Aligned) */}
        <div className="w-full flex flex-col items-start text-left mb-4 sm:mb-6 relative z-20">
          <div className="w-12 sm:w-14 h-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mb-3 shadow-[0_0_12px_rgba(255,106,0,0.5)]" />
          <h2 className="font-[family-name:var(--font-gondens)] text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider text-white uppercase flex items-center justify-start gap-2.5 sm:gap-3.5">
            <span>ABOUT</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FF6A00] to-[#FF207D] drop-shadow-[0_0_24px_rgba(255,106,0,0.3)]">
              EVENT
            </span>
          </h2>
        </div>

        {/* 02 — Editorial Manifesto Paragraph (Left Aligned, Clean Colored Highlights, No Popups) */}
        <div className="w-full relative z-10 text-left">
          <div className="relative w-full">
            {/* Faint, Transparent Cosmic Nexus Emblem Logo Watermark (Behind Text) */}
            <div
              ref={watermarkRef}
              className="pointer-events-none absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-full max-w-md md:max-w-lg h-auto opacity-[0.06] select-none z-0 will-change-transform flex items-center justify-center"
              aria-hidden="true"
            >
              <Image
                src="/brand/nexus-emblem-watermark.png"
                alt=""
                width={500}
                height={350}
                className="w-full max-w-[400px] h-auto object-contain"
                style={{ height: 'auto' }}
              />
            </div>

            {/* Paragraph with ScrollReveal: purely colored inline text, zero popovers or underlines */}
            <div className="relative z-10 w-full text-left">
              <ScrollReveal
                enableBlur={true}
                blurStrength={4}
                baseOpacity={0.16}
                baseRotation={0}
                wordAnimationStart="top 84%"
                wordAnimationEnd="bottom 50%"
                scrub={1}
                containerClassName="my-0 w-full text-left"
                textClassName="font-[family-name:var(--font-ibm-plex)] text-[16px] xs:text-[18px] sm:text-[21px] md:text-[24px] lg:text-[26px] font-normal tracking-[-0.01em] [word-spacing:0.02em] leading-[1.6] text-[#E4E4E7] select-none text-left not-italic"
                highlightClassName="font-[family-name:var(--font-helvetica)] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FF6A00] to-[#FF207D]"
                renderHighlight={(_term, words) => (
                  <span className="font-[family-name:var(--font-helvetica)] font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FF6A00] to-[#FF207D]">
                    {words}
                  </span>
                )}
              >
                {manifestoText}
              </ScrollReveal>
            </div>
          </div>
        </div>

        {/* 03 — 3 Stat / Metric Cards (Compact Gaps) */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 w-full mt-7 sm:mt-9 z-20"
        >
          {/* Card 1: 5,000+ Footfall */}
          <div className="stat-card relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.015] border border-white/[0.12] hover:border-white/30 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,59,48,0.15)] group">
            <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-gondens)] font-black text-3xl sm:text-4xl text-[#FF3B30] tracking-tight mt-2.5">
              5,000+
            </span>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-zinc-300 uppercase mt-1">
              ESTIMATED FOOTFALL
            </span>
          </div>

          {/* Card 2: 3 Days */}
          <div className="stat-card relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.015] border border-white/[0.12] hover:border-white/30 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,106,0,0.18)] group">
            <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-gondens)] font-black text-3xl sm:text-4xl text-[#FF6A00] tracking-tight mt-2.5">
              3
            </span>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-[11px] font-bold tracking-[0.18em] text-zinc-300 uppercase mt-1">
              DAYS OF CELEBRATION
            </span>
          </div>

          {/* Card 3: Multiple Colleges */}
          <div className="stat-card relative flex flex-col items-center justify-center p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.015] border border-white/[0.12] hover:border-white/30 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(255,184,0,0.18)] group">
            <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
              <svg
                className="w-8 h-8 sm:w-9 sm:h-9 text-white stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-gondens)] font-black text-2xl sm:text-3xl lg:text-4xl text-[#FFB800] tracking-tight mt-2.5">
              MULTIPLE
            </span>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-[11px] font-bold tracking-[0.14em] text-zinc-300 uppercase mt-1 text-center leading-tight">
              COLLEGES ACROSS HYDERABAD
            </span>
          </div>
        </div>

        {/* 04 — EVENT HIGHLIGHTS Subheading + Divider (Compact Gap) */}
        <div className="w-full flex flex-col items-center text-center mt-9 sm:mt-11 mb-5 sm:mb-6 z-20">
          <h3 className="font-[family-name:var(--font-helvetica)] text-xs sm:text-sm font-bold tracking-[0.28em] uppercase text-zinc-200">
            EVENT HIGHLIGHTS
          </h3>
          <div className="w-10 sm:w-12 h-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mt-2.5 shadow-[0_0_10px_rgba(255,106,0,0.5)]" />
        </div>

        {/* 05 — 5 Circular Highlight Badges (Compact Gaps) */}
        <div
          ref={highlightsRef}
          className="flex flex-wrap items-start justify-center gap-4 sm:gap-6 md:gap-8 w-full z-20 px-2"
        >
          {/* 1. TECHNICAL EVENTS */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[100px] sm:max-w-[115px]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_20px_rgba(255,106,0,0.35)]">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:rotate-45 transition-transform duration-500 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1 2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-xs font-bold tracking-wider text-zinc-300 uppercase text-center mt-2.5 leading-tight group-hover:text-white transition-colors">
              TECHNICAL
              <br />
              EVENTS
            </span>
          </div>

          {/* 2. DJ NIGHT */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[100px] sm:max-w-[115px]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_20px_rgba(255,32,125,0.35)]">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-xs font-bold tracking-wider text-zinc-300 uppercase text-center mt-2.5 leading-tight group-hover:text-white transition-colors">
              DJ NIGHT
            </span>
          </div>

          {/* 3. QAWWALI NIGHT */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[100px] sm:max-w-[115px]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_20px_rgba(255,184,0,0.35)]">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:-rotate-12 transition-transform duration-300 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" x2="12" y1="19" y2="22" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-xs font-bold tracking-wider text-zinc-300 uppercase text-center mt-2.5 leading-tight group-hover:text-white transition-colors">
              QAWWALI
              <br />
              NIGHT
            </span>
          </div>

          {/* 4. AUTO FEST */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[100px] sm:max-w-[115px]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_20px_rgba(255,106,0,0.35)]">
              <svg
                className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:translate-x-0.5 transition-transform duration-300 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                <circle cx="7" cy="17" r="2" />
                <path d="M9 17h6" />
                <circle cx="17" cy="17" r="2" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-xs font-bold tracking-wider text-zinc-300 uppercase text-center mt-2.5 leading-tight group-hover:text-white transition-colors">
              AUTO FEST
            </span>
          </div>

          {/* 5. FOOD FEST (ALL 3 DAYS) */}
          <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[100px] sm:max-w-[115px]">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_6px_20px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_20px_rgba(255,184,0,0.35)]">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white group-hover:scale-110 transition-transform duration-300 stroke-current fill-none"
                viewBox="0 0 24 24"
                strokeWidth="1.6"
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
            <span className="font-[family-name:var(--font-helvetica)] text-[10px] sm:text-xs font-bold tracking-wider text-zinc-300 uppercase text-center mt-2.5 leading-tight group-hover:text-white transition-colors">
              FOOD FEST
              <br />
              <span className="text-zinc-400 text-[9px] sm:text-[10px] tracking-normal font-normal">
                (ALL 3 DAYS)
              </span>
            </span>
          </div>
        </div>

        {/* 06 — Bottom Brand Pillars: CULTURE | TECHNOLOGY | ENTERTAINMENT (Compact Gap) */}
        <div className="w-full flex flex-col items-center text-center mt-9 sm:mt-11 z-20">
          <p className="font-[family-name:var(--font-helvetica)] text-xs sm:text-sm font-bold tracking-[0.26em] text-zinc-300 uppercase">
            CULTURE <span className="text-[#FF6A00] mx-2 sm:mx-3">|</span> TECHNOLOGY{' '}
            <span className="text-[#FF6A00] mx-2 sm:mx-3">|</span> ENTERTAINMENT
          </p>
          <div className="w-10 sm:w-12 h-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mt-2.5 shadow-[0_0_10px_rgba(255,106,0,0.5)]" />
        </div>
      </div>
    </section>
  );
}
