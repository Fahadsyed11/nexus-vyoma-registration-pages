'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Spark from '@/components/brand/Spark';
import ScrollReveal from '@/components/ui/ScrollReveal';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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
    'Three days. One shared sky. Nexus Vyoma brings culture and technology together at ISL Engineering College, Hyderabad.';

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full min-h-[75vh] sm:min-h-[80vh] flex flex-col items-center justify-center pt-24 pb-20 sm:pt-36 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden select-none"
    >
      {/* Content Container - Left Aligned */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-start text-left relative z-10 self-stretch">
        {/* Title: Bold Condensed Display (Anton), uppercase, tracking, warm gold/orange accent */}
        <div className="flex items-center gap-2.5 mb-8 sm:mb-10">
          <Spark size={14} color="#FF6A00" glow={true} />
          <span className="font-[family-name:var(--font-display)] font-bold text-sm sm:text-base tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#FF6A00] to-[#FBB03B]">
            ABOUT NEXUS VYOMA
          </span>
        </div>

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
            />
          </div>

          {/* Official Approved About Paragraph with ScrollReveal (Balanced pacing across scroll) */}
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
              textClassName="font-[family-name:var(--font-barlow-condensed)] text-[24px] xs:text-[28px] sm:text-[36px] md:text-[44px] font-medium leading-[1.16] text-[#FFFFFF] select-none text-left self-stretch not-italic"
            >
              {manifestoText}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
