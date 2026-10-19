'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import AboutHoverCard, { HoverCardData } from './AboutHoverCard';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const ABOUT_HOVER_CARDS: Record<string, HoverCardData> = {
  'Nexus Vyoma': {
    badge: '10–12 NOV 2026',
    title: 'ISL Engineering College',
    description: 'The premier 3-day inter-college festival uniting tech, culture, and creative minds.',
    href: '#about',
    actionText: 'Explore Fest Details',
  },
  technical: {
    badge: 'ARENA I · TECH BATTLES',
    title: 'Hackathons & Robotics',
    description: 'High-stakes coding sprints, combat robotics, AI challenges, and developer arenas.',
    href: '/events',
    actionText: 'View Tech Events',
  },
  entertainment: {
    badge: 'ARENA II · LIVE SHOWS',
    title: 'DJ Nights & Auto Fest',
    description: 'High-octane sound stages, celebrity DJ concerts, and supercar/superbike exhibitions.',
    href: '/events',
    actionText: 'Explore Entertainment',
  },
  'food fest': {
    badge: 'ALL 3 DAYS',
    title: 'Grand Food Pavilion',
    description: 'Over 40+ curated culinary stalls, street foods, desserts, and artisan beverages.',
    href: '/events',
    actionText: 'Discover Food Arena',
  },
  talent: {
    badge: 'COMPETITIONS',
    title: 'Statewide Showcases',
    description: 'Compete with the sharpest students across Hyderabad in arts, stage, and tech arenas.',
    href: '/events',
    actionText: 'View Competitions',
  },
  innovation: {
    badge: 'CREATIVE LABS',
    title: 'Project Expos & Demos',
    description: 'Future-ready tech prototypes, startup pitches, and hands-on maker spaces.',
    href: '/events',
    actionText: 'See Innovations',
  },
  culture: {
    badge: 'ARENA III · SUFI & SOUL',
    title: 'Qawwali & Folk Rhythms',
    description: 'Soulful evening concerts celebrating heritage, poetry, music, and performance.',
    href: '/events',
    actionText: 'Cultural Lineup',
  },
  community: {
    badge: '5,000+ ATTENDEES',
    title: 'Inter-College Unity',
    description: 'Connecting students and creators across colleges in Hyderabad under one sky.',
    href: '/events',
    actionText: 'Join the Community',
  },
};

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
          y: 50,
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
          y: 28,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
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
          scale: 0.85,
          y: 24,
          opacity: 0,
          duration: 0.55,
          stagger: 0.08,
          ease: 'back.out(1.4)',
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
      className="relative w-full min-h-[70vh] sm:min-h-[75vh] flex flex-col items-center justify-center pt-24 pb-16 sm:pt-32 sm:pb-24 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 bg-transparent overflow-visible select-none"
    >
      {/* 01 — Section Header: Gradient Accent Pill + ABOUT EVENT Title */}
      <div className="w-full flex flex-col items-center text-center mb-8 sm:mb-10 px-4 relative z-20">
        <div className="w-14 sm:w-16 h-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mb-4 sm:mb-5 shadow-[0_0_12px_rgba(255,106,0,0.5)]" />
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black tracking-wider text-white uppercase flex items-center justify-center gap-2.5 sm:gap-3.5">
          <span>ABOUT</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFB800] via-[#FF6A00] to-[#FF207D] drop-shadow-[0_0_24px_rgba(255,106,0,0.3)]">
            EVENT
          </span>
        </h2>
      </div>

      {/* 02 — Editorial Manifesto Paragraph with ScrollReveal & Watermark */}
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center relative z-10">
        <div className="relative w-full">
          {/* Faint, Transparent Cosmic Nexus Emblem Logo Watermark (Behind Text) */}
          <div
            ref={watermarkRef}
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg md:max-w-xl h-auto opacity-[0.07] select-none z-0 will-change-transform flex items-center justify-center"
            aria-hidden="true"
          >
            <Image
              src="/brand/nexus-emblem-watermark.png"
              alt=""
              width={600}
              height={400}
              className="w-full max-w-[440px] h-auto object-contain"
              style={{ height: 'auto' }}
            />
          </div>

          {/* Official Approved About Paragraph with ScrollReveal & Hover Cards */}
          <div className="relative z-10 w-full text-center">
            <ScrollReveal
              enableBlur={true}
              blurStrength={5}
              baseOpacity={0.14}
              baseRotation={0}
              wordAnimationStart="top 82%"
              wordAnimationEnd="bottom 45%"
              scrub={1}
              containerClassName="my-0 w-full"
              textClassName="font-[family-name:var(--font-inter)] text-[16px] xs:text-[18px] sm:text-[22px] md:text-[26px] lg:text-[28px] font-light tracking-[-0.03em] [word-spacing:-0.05em] leading-[1.4] text-[#E4E4E7] select-none text-center not-italic"
              highlightClassName="font-medium text-transparent bg-clip-text bg-gradient-to-r from-[#FFE0B2] via-[#FFD29D] to-[#FBB03B] drop-shadow-[0_0_8px_rgba(251,176,59,0.22)]"
              renderHighlight={(term, words) => {
                const cardData = ABOUT_HOVER_CARDS[term];
                if (!cardData) return words;
                return <AboutHoverCard data={cardData}>{words}</AboutHoverCard>;
              }}
            >
              {manifestoText}
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* 03 — 3 Stat / Metric Cards */}
      <div
        ref={cardsRef}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full max-w-4xl mx-auto mt-12 sm:mt-16 z-20"
      >
        {/* Card 1: 5,000+ Footfall */}
        <div className="stat-card relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.015] border border-white/[0.12] hover:border-white/30 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(255,59,48,0.15)] group">
          <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
            <svg
              className="w-9 h-9 sm:w-10 sm:h-10 text-white stroke-current fill-none"
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
          <span className="font-display font-black text-3xl sm:text-4xl text-[#FF3B30] tracking-tight mt-3">
            5,000+
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-zinc-300 uppercase mt-1.5">
            ESTIMATED FOOTFALL
          </span>
        </div>

        {/* Card 2: 3 Days */}
        <div className="stat-card relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.015] border border-white/[0.12] hover:border-white/30 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(255,106,0,0.18)] group">
          <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
            <svg
              className="w-9 h-9 sm:w-10 sm:h-10 text-white stroke-current fill-none"
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
          <span className="font-display font-black text-3xl sm:text-4xl text-[#FF6A00] tracking-tight mt-3">
            3
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.22em] text-zinc-300 uppercase mt-1.5">
            DAYS OF CELEBRATION
          </span>
        </div>

        {/* Card 3: Multiple Colleges */}
        <div className="stat-card relative flex flex-col items-center justify-center p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.015] border border-white/[0.12] hover:border-white/30 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(255,184,0,0.18)] group">
          <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
            <svg
              className="w-9 h-9 sm:w-10 sm:h-10 text-white stroke-current fill-none"
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
          <span className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-[#FFB800] tracking-tight mt-3">
            MULTIPLE
          </span>
          <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-[0.16em] text-zinc-300 uppercase mt-1.5 text-center leading-tight">
            COLLEGES ACROSS HYDERABAD
          </span>
        </div>
      </div>

      {/* 04 — EVENT HIGHLIGHTS Subheading + Divider */}
      <div className="w-full flex flex-col items-center text-center mt-14 sm:mt-20 mb-8 sm:mb-10 z-20">
        <h3 className="font-mono text-xs sm:text-sm font-bold tracking-[0.32em] uppercase text-zinc-200">
          EVENT HIGHLIGHTS
        </h3>
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mt-3 shadow-[0_0_10px_rgba(255,106,0,0.5)]" />
      </div>

      {/* 05 — 5 Circular Highlight Badges */}
      <div
        ref={highlightsRef}
        className="flex flex-wrap items-start justify-center gap-6 sm:gap-8 md:gap-10 lg:gap-12 w-full max-w-5xl mx-auto z-20 px-2"
      >
        {/* 1. TECHNICAL EVENTS */}
        <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[110px] sm:max-w-[120px]">
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_24px_rgba(255,106,0,0.35)]">
            <svg
              className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:rotate-45 transition-transform duration-500 stroke-current fill-none"
              viewBox="0 0 24 24"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </div>
          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-300 uppercase text-center mt-3 leading-tight group-hover:text-white transition-colors">
            TECHNICAL
            <br />
            EVENTS
          </span>
        </div>

        {/* 2. DJ NIGHT */}
        <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[110px] sm:max-w-[120px]">
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_24px_rgba(255,32,125,0.35)]">
            <svg
              className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:scale-110 transition-transform duration-300 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-300 uppercase text-center mt-3 leading-tight group-hover:text-white transition-colors">
            DJ NIGHT
          </span>
        </div>

        {/* 3. QAWWALI NIGHT */}
        <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[110px] sm:max-w-[120px]">
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_24px_rgba(255,184,0,0.35)]">
            <svg
              className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:-rotate-12 transition-transform duration-300 stroke-current fill-none"
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
          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-300 uppercase text-center mt-3 leading-tight group-hover:text-white transition-colors">
            QAWWALI
            <br />
            NIGHT
          </span>
        </div>

        {/* 4. AUTO FEST */}
        <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[110px] sm:max-w-[120px]">
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_24px_rgba(255,106,0,0.35)]">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-white group-hover:translate-x-0.5 transition-transform duration-300 stroke-current fill-none"
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
          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-300 uppercase text-center mt-3 leading-tight group-hover:text-white transition-colors">
            AUTO FEST
          </span>
        </div>

        {/* 5. FOOD FEST (ALL 3 DAYS) */}
        <div className="highlight-badge flex flex-col items-center group cursor-pointer max-w-[110px] sm:max-w-[120px]">
          <div className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full border border-white/20 bg-gradient-to-b from-white/[0.08] to-white/[0.015] shadow-[0_8px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.25)] flex items-center justify-center transition-all duration-300 group-hover:scale-108 group-hover:border-zinc-200 group-hover:shadow-[0_0_24px_rgba(255,184,0,0.35)]">
            <svg
              className="w-7 h-7 sm:w-9 sm:h-9 text-white group-hover:scale-110 transition-transform duration-300 stroke-current fill-none"
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
          <span className="font-mono text-[10px] sm:text-xs font-semibold tracking-wider text-zinc-300 uppercase text-center mt-3 leading-tight group-hover:text-white transition-colors">
            FOOD FEST
            <br />
            <span className="text-zinc-400 text-[9px] sm:text-[10px] tracking-normal font-normal">
              (ALL 3 DAYS)
            </span>
          </span>
        </div>
      </div>

      {/* 06 — Bottom Brand Pillars: CULTURE | TECHNOLOGY | ENTERTAINMENT */}
      <div className="w-full flex flex-col items-center text-center mt-14 sm:mt-20 z-20">
        <p className="font-mono text-xs sm:text-sm font-semibold tracking-[0.26em] text-zinc-300 uppercase">
          CULTURE <span className="text-[#FF6A00] mx-2 sm:mx-3">|</span> TECHNOLOGY{' '}
          <span className="text-[#FF6A00] mx-2 sm:mx-3">|</span> ENTERTAINMENT
        </p>
        <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[#FF6A00] to-[#FF207D] mt-3.5 shadow-[0_0_10px_rgba(255,106,0,0.5)]" />
      </div>
    </section>
  );
}
