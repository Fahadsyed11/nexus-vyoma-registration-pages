'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CircularCarousel, { CircularCarouselItem } from '@/components/ui/CircularCarousel';
import ISLLogo from '@/components/brand/ISLLogo';
import NexusMark from '@/components/brand/NexusMark';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SponsorsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Elegant Entrance: Text header then 3D Carousel
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 0.6,
        },
      });

      tl.from(textRef.current, {
        opacity: 0,
        y: 35,
        duration: 0.6,
        ease: 'power2.out',
      }).from(
        carouselWrapperRef.current,
        {
          opacity: 0,
          scale: 0.92,
          duration: 0.8,
          ease: 'power2.out',
        },
        '-=0.2'
      );
    },
    { scope: containerRef }
  );

  const sponsorItems: CircularCarouselItem[] = [
    {
      title: 'ISL Engineering College',
      subtitle: 'Host & Organizing Institution',
      logoComponent: (
        <div className="flex flex-col items-center justify-center p-2">
          <ISLLogo className="h-12 sm:h-16 w-auto" />
        </div>
      ),
    },
    {
      title: 'Nexus Innovation Labs',
      subtitle: 'Title Technology Partner',
      logoComponent: (
        <div className="flex flex-col items-center justify-center gap-2">
          <NexusMark className="w-14 h-14 sm:w-16 sm:h-16 drop-shadow-[0_0_20px_rgba(255,106,0,0.6)]" />
          <span className="font-display text-xs tracking-widest text-white uppercase">NEXUS LABS</span>
        </div>
      ),
    },
    {
      title: 'Sub-Bass Acoustics',
      subtitle: 'Concert Audio Partner',
      logoComponent: (
        <div className="flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="w-12 h-12 rounded-full border border-[#FF6A00]/40 flex items-center justify-center bg-[#FF6A00]/10 shadow-[0_0_20px_rgba(255,106,0,0.3)]">
            <span className="font-display text-base font-bold text-[#FF6A00]">SUB</span>
          </div>
          <span className="font-sans text-xs font-semibold text-white tracking-wider uppercase">SUB-BASS AUDIO</span>
        </div>
      ),
    },
    {
      title: 'Apex Performance Motors',
      subtitle: 'Automobile Concourse Partner',
      logoComponent: (
        <div className="flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="w-12 h-12 rounded-xl border border-[#FF382E]/40 flex items-center justify-center bg-[#FF382E]/10 shadow-[0_0_20px_rgba(255,56,46,0.3)]">
            <span className="font-display text-base font-bold text-[#FF382E]">APEX</span>
          </div>
          <span className="font-sans text-xs font-semibold text-white tracking-wider uppercase">APEX MOTORS</span>
        </div>
      ),
    },
    {
      title: 'Hyderabad Tech Guild',
      subtitle: 'Technical Innovation Associate',
      logoComponent: (
        <div className="flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="w-12 h-12 rounded-xl border border-[#0066FF]/40 flex items-center justify-center bg-[#0066FF]/10 shadow-[0_0_20px_rgba(0,102,255,0.3)]">
            <span className="font-display text-base font-bold text-[#0066FF]">HTG</span>
          </div>
          <span className="font-sans text-xs font-semibold text-white tracking-wider uppercase">TECH GUILD</span>
        </div>
      ),
    },
    {
      title: 'Telangana Cultural Forum',
      subtitle: 'Arts & Heritage Patron',
      logoComponent: (
        <div className="flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="w-12 h-12 rounded-full border border-[#FBB03B]/40 flex items-center justify-center bg-[#FBB03B]/10 shadow-[0_0_20px_rgba(251,176,59,0.3)]">
            <span className="font-display text-base font-bold text-[#FBB03B]">TCF</span>
          </div>
          <span className="font-sans text-xs font-semibold text-white tracking-wider uppercase">CULTURAL FORUM</span>
        </div>
      ),
    },
    {
      title: 'Hyperion Esports Arena',
      subtitle: 'Gaming & Pop Culture Partner',
      logoComponent: (
        <div className="flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="w-12 h-12 rounded-xl border border-[#FF207D]/40 flex items-center justify-center bg-[#FF207D]/10 shadow-[0_0_20px_rgba(255,32,125,0.3)]">
            <span className="font-display text-base font-bold text-[#FF207D]">HYP</span>
          </div>
          <span className="font-sans text-xs font-semibold text-white tracking-wider uppercase">HYPERION</span>
        </div>
      ),
    },
    {
      title: 'Deccan Culinary Guild',
      subtitle: 'Food Fest & Hospitality Sponsor',
      logoComponent: (
        <div className="flex flex-col items-center justify-center gap-1.5 text-center">
          <div className="w-12 h-12 rounded-xl border border-[#7B2CFF]/40 flex items-center justify-center bg-[#7B2CFF]/10 shadow-[0_0_20px_rgba(123,44,255,0.3)]">
            <span className="font-display text-base font-bold text-[#7B2CFF]">DCG</span>
          </div>
          <span className="font-sans text-xs font-semibold text-white tracking-wider uppercase">DECCAN GUILD</span>
        </div>
      ),
    },
  ];

  return (
    <section
      id="sponsors"
      ref={containerRef}
      className="relative w-full min-h-screen py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-transparent flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10">
        {/* Section Heading & Editorial Hierarchy */}
        <div ref={textRef} className="flex flex-col items-center text-center mb-10 sm:mb-16 will-change-transform">
          <span className="font-sans font-medium text-xs sm:text-sm tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FBB03B] mb-2 sm:mb-3">
            POWERED BY
          </span>

          <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-wider text-white uppercase leading-none mb-3">
            OUR SPONSORS
          </h2>

          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-md tracking-wide">
            Visionary institutions, tech innovators, and cultural patrons empowering Nexus Vyoma 2026.
          </p>
        </div>

        {/* 3D Cylindrical Circular Carousel */}
        <div
          ref={carouselWrapperRef}
          className="relative w-full h-[460px] sm:h-[540px] lg:h-[580px] flex items-center justify-center will-change-transform"
        >
          <CircularCarousel
            items={sponsorItems}
            preset="cylinder"
            intro="rise"
            cardWidth={260}
            aspectRatio={1}
            speed={14}
            captions={false}
            gap={28}
            tilt={-5}
            curve={1}
            perspective={2500}
            autoplay="drift"
            interval={3}
            direction="left"
            momentum={0.6}
            snap={false}
            pauseOnHover={false}
            focusOnClick
            draggable
            parallax={0.3}
            stretch={0.5}
            fadeColor="#000000"
            depthFade={0.42}
            innerShade={0.55}
            cornerRadius={14}
          />
        </div>

        {/* Supporting Sponsor CTA - Fluid Wrap on Mobile */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center text-xs font-mono text-zinc-400 px-4">
          <span>WANT TO BECOME A SPONSOR FOR NEXUS VYOMA?</span>
          <a
            href="mailto:sponsorships@nexusvyoma.com"
            className="text-[#FF6A00] underline underline-offset-4 hover:text-white transition-colors flex items-center gap-1"
          >
            <span>CONTACT US</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
