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
    'Nexus VYOMA is a three-day inter-college fest of ISL Engineering College, Hyderabad, bringing together a vibrant audience, creators, innovators and communities from across colleges for an unforgettable celebration of technology, creativity, entertainment, culture and collaboration. From high-energy performances and thrilling exhibitions to technical competitions, food experiences and lifestyle events, Nexus VYOMA offers a dynamic platform for talent, ideas and meaningful interactions - creating an unmatched college festival experience in the city.';

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative w-full min-h-[75vh] sm:min-h-[80vh] flex flex-col items-center justify-center pt-24 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-transparent overflow-hidden select-none"
    >
      {/* Section Header - Centered like FLAGSHIP ARENAS */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-8 px-4 relative z-20">
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-white uppercase">
          ABOUT
        </h2>
      </div>

      {/* Content Container */}
      <div className="w-full max-w-5xl mx-auto flex flex-col items-start text-left relative z-10 self-stretch">
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

          {/* Official Approved About Paragraph with ScrollReveal (Inter weight 200, justified alignment) */}
          <div className="relative z-10 w-full text-justify self-stretch">
            <ScrollReveal
              enableBlur={true}
              blurStrength={5}
              baseOpacity={0.12}
              baseRotation={0}
              wordAnimationStart="top 80%"
              wordAnimationEnd="bottom 40%"
              scrub={1}
              containerClassName="my-0 w-full self-stretch"
              textClassName="font-[family-name:var(--font-inter)] text-[16px] xs:text-[19px] sm:text-[23px] md:text-[28px] lg:text-[32px] font-extralight leading-[1.38] text-[#FFFFFF] select-none text-justify self-stretch not-italic"
            >
              {manifestoText}
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
