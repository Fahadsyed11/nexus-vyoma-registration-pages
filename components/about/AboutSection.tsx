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
  technology: {
    badge: 'ARENA I · TECH BATTLES',
    title: 'Hackathons & Robotics',
    description: 'High-stakes coding sprints, combat robotics, AI challenges, and developer arenas.',
    href: '#events',
    actionText: 'View Tech Events',
  },
  creativity: {
    badge: 'ARENA II · CREATIVE ARTS',
    title: 'Design & Visual Media',
    description: 'Automobile expo, digital design showcases, photography, and cinematography.',
    href: '#events',
    actionText: 'Explore Creative Tracks',
  },
  culture: {
    badge: 'ARENA III · STAGE & SOUND',
    title: 'Qawwali, DJ & Dance',
    description: 'Soulful sufi melodies, competitive choreography, and electrifying concert nights.',
    href: '#events',
    actionText: 'Discover Cultural Lineup',
  },
  'unforgettable experiences': {
    badge: 'PASSES NOW OPEN',
    title: 'All-Access Fest Passes',
    description: '3 days of unrestricted access to all 6 flagship arenas, concerts, and food fest.',
    href: '/register',
    actionText: 'Claim Your Pass',
  },
};

export default function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Watermark subtle parallax reveal
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
    },
    { scope: containerRef }
  );          

  const manifestoText =
    '**Nexus Vyoma** is a three day inter-college fest at ISL Engineering College, Hyderabad, celebrating **technology**, **creativity**, **culture**, and **unforgettable experiences**.';

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full min-h-[70vh] sm:min-h-[75vh] flex flex-col items-start justify-center pt-24 pb-12 sm:pt-36 sm:pb-16 px-6 sm:px-12 md:px-16 lg:px-24 xl:px-28 bg-transparent overflow-visible select-none"
    >
      {/* Section Header - Centered in the middle */}
      <div className="w-full flex flex-col items-center text-center mb-6 sm:mb-8 px-4 relative z-20">
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-white uppercase">
          ABOUT
        </h2>
      </div>

      {/* Content Container - Anchored to the left of the screen */}
      <div className="w-full max-w-5xl mr-auto flex flex-col items-start text-left relative z-10 self-stretch">
        {/* Paragraph container with subtle emblem watermark placed directly behind text */}
        <div className="relative w-full self-stretch">
          {/* Faint, Transparent Cosmic Nexus Emblem Logo Watermark (Behind Text) */}
          <div
            ref={watermarkRef}
            className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg md:max-w-xl h-auto opacity-[0.08] select-none z-0 will-change-transform flex items-center justify-center"
            aria-hidden="true"
          >
            <Image
              src="/brand/nexus-emblem-watermark.png"
              alt=""
              width={600}
              height={400}
              className="w-full max-w-[480px] h-auto object-contain"
              style={{ height: 'auto' }}
            />
          </div>

          {/* Official Approved About Paragraph with ScrollReveal & ChaiUI/shadcn Hover Cards */}
          <div className="relative z-10 w-full text-left self-stretch">
            <ScrollReveal
              enableBlur={true}
              blurStrength={5}
              baseOpacity={0.12}
              baseRotation={0}
              wordAnimationStart="top 80%"
              wordAnimationEnd="bottom 35%"
              scrub={1}
              containerClassName="my-0 w-full self-stretch"
              textClassName="font-[family-name:var(--font-inter)] text-[20px] xs:text-[24px] sm:text-[30px] md:text-[38px] lg:text-[44px] font-extralight tracking-[-0.06em] [word-spacing:-0.12em] leading-[1.14] text-[#FFFFFF] select-none text-left self-stretch not-italic"
              highlightClassName="font-light text-transparent bg-clip-text bg-gradient-to-r from-[#FFE0B2] via-[#FFD29D] to-[#FBB03B] drop-shadow-[0_0_8px_rgba(251,176,59,0.18)]"
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
    </section>
  );
}
