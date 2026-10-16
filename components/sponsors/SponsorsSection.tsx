'use client';

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import CircularCarousel, { CircularCarouselHandle, CircularCarouselItem } from '@/components/ui/CircularCarousel';
import ISLLogo from '@/components/brand/ISLLogo';
import NexusMark from '@/components/brand/NexusMark';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function SponsorsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const carouselWrapperRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<CircularCarouselHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      const mm = gsap.matchMedia();

      // DESKTOP: Smooth entrance animation + ambient drift
      mm.add('(min-width: 768px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 1,
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
      });

      // MOBILE: Pinned page-scroll rotation (advance 1 card per scroll gesture with snap)
      mm.add('(max-width: 767px)', () => {
        const count = 6;
        const step = 360 / count; // 60 degrees
        const totalRotation = (count - 1) * step; // 300 degrees

        const st = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top+=60',
          end: '+=1400',
          pin: true,
          scrub: 0.35,
          snap: {
            snapTo: 1 / (count - 1),
            duration: { min: 0.2, max: 0.4 },
            ease: 'power1.inOut',
          },
          onUpdate: (self) => {
            const currentAngle = -self.progress * totalRotation;
            carouselRef.current?.setAngle(currentAngle);
            const index = Math.min(count - 1, Math.round(self.progress * (count - 1)));
            setActiveIndex(index);
          },
        });

        return () => {
          st.kill();
        };
      });

      return () => mm.revert();
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
      className="relative w-full py-8 sm:py-12 lg:py-14 px-4 sm:px-6 lg:px-8 bg-transparent flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10">
        {/* Section Heading & Editorial Hierarchy */}
        <div ref={textRef} className="flex flex-col items-center text-center mb-2 sm:mb-3 lg:mb-4 will-change-transform">
          <span className="font-sans font-medium text-[10px] sm:text-xs tracking-[0.25em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FBB03B] mb-1 sm:mb-1.5">
            POWERED BY
          </span>

          <h2 className="font-display text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-bold tracking-wider text-white uppercase leading-tight mb-1.5 sm:mb-2">
            OUR SPONSORS
          </h2>

          <p className="font-sans text-xs sm:text-sm text-zinc-400 max-w-xs sm:max-w-md tracking-wide px-2 leading-relaxed">
            Visionary institutions, tech innovators, and cultural patrons empowering Nexus Vyoma 2026.
          </p>
        </div>

        {/* 3D Cylindrical Circular Carousel */}
        <div
          ref={carouselWrapperRef}
          className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] flex items-center justify-center will-change-transform"
        >
          <CircularCarousel
            ref={carouselRef}
            items={sponsorItems}
            preset="cylinder"
            intro="rise"
            cardWidth={isMobile ? 260 : 310}
            aspectRatio={1}
            spread={isMobile ? 1.15 : 1.35}
            speed={isMobile ? 0 : 14}
            captions={false}
            gap={14}
            tilt={-5}
            curve={1}
            perspective={2500}
            autoplay={isMobile ? 'off' : 'drift'}
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
            depthFade={isMobile ? 0.75 : 0.2}
            innerShade={0.55}
            cornerRadius={14}
            onChange={(idx) => setActiveIndex(idx)}
          />
        </div>

        {/* Active Sponsor Indicator on Mobile */}
        <div className="flex md:hidden items-center justify-center gap-2 mt-2 mb-0.5">
          {sponsorItems.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => carouselRef.current?.focusIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === i ? 'w-6 bg-[#FF6A00]' : 'w-1.5 bg-white/25'
              }`}
              aria-label={`Go to sponsor ${i + 1}`}
            />
          ))}
        </div>

        {/* Supporting Sponsor CTA - Fluid Wrap on Mobile */}
        <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center text-[11px] xs:text-xs font-mono text-zinc-400 px-4">
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
