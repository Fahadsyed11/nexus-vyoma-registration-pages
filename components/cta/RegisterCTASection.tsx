'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function RegisterCTASection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.from(cardRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          end: 'top 50%',
          scrub: 0.6,
        },
        opacity: 0,
        y: 35,
        scale: 0.98,
        ease: 'power2.out',
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative w-full py-20 sm:py-28 lg:py-36 px-4 sm:px-6 lg:px-8 bg-transparent flex items-center justify-center overflow-hidden select-none"
    >
      <div
        ref={cardRef}
        className="relative w-full max-w-6xl rounded-[24px] sm:rounded-[36px] border border-white/[0.12] bg-gradient-to-br from-[#121216]/95 via-[#0B0B0E]/95 to-[#050507]/98 backdrop-blur-2xl p-6 sm:p-14 lg:p-16 overflow-hidden shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.15)] will-change-transform font-sans"
      >
        {/* Top Specular Sheen Line */}
        <div
          className="absolute inset-x-0 top-0 h-[1px] pointer-events-none opacity-40"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.35) 30%, rgba(255, 255, 255, 0.1) 70%, transparent 100%)',
          }}
        />

        {/* RIGHT SIDE: Concentric Circles with Centered Official Nexus Emblem */}
        <div className="absolute -right-20 sm:right-6 lg:right-16 top-1/2 -translate-y-1/2 w-[260px] sm:w-[460px] lg:w-[540px] h-[260px] sm:h-[460px] lg:h-[540px] pointer-events-none flex items-center justify-center">
          {/* Subtle Ambient Glow Behind Emblem */}
          <div
            className="absolute w-52 h-52 sm:w-80 sm:h-80 rounded-full opacity-35 blur-[90px] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle, rgba(255,106,0,0.5) 0%, rgba(255,32,125,0.3) 50%, transparent 100%)',
            }}
          />

          {/* SVG Concentric Arcs */}
          <svg
            viewBox="0 0 600 600"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0 w-full h-full opacity-40"
            aria-hidden="true"
          >
            <circle cx="300" cy="300" r="110" stroke="rgba(255,255,255,0.18)" strokeWidth="1" />
            <circle cx="300" cy="300" r="170" stroke="rgba(255,255,255,0.14)" strokeWidth="1" />
            <circle cx="300" cy="300" r="230" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="3 4" />
            <circle cx="300" cy="300" r="290" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          </svg>

          {/* Centered Official Nexus Symbol / Emblem */}
          <div className="relative z-10 w-24 h-24 sm:w-36 sm:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden aspect-square flex items-center justify-center">
            <Image
              src="/brand/nexus-mark.png"
              alt="Nexus Vyoma Official Emblem"
              width={180}
              height={180}
              priority
              className="w-full h-full object-contain rounded-full mix-blend-screen drop-shadow-[0_0_35px_rgba(255,106,0,0.65)] select-none"
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 max-w-xl lg:max-w-2xl text-left flex flex-col items-start gap-4 sm:gap-7">
          {/* Contemporary Clean Heading */}
          <h2 className="font-sans text-2xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.14]">
            Ready to be part of <br className="hidden sm:inline" />
            <span className="text-white">
              Nexus Vyoma?
            </span>
          </h2>

          {/* Description */}
          <p className="font-sans text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-lg font-normal">
            Three days. One shared sky. Join us for an unforgettable convergence of technology, creativity, and culture.
          </p>

          {/* Action Buttons: Sleek Black Pills with Circular Arrow Badges */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 w-full sm:w-auto pt-2">
            {/* Primary Button: Join the Experience */}
            <Link
              href="/register"
              className="group relative overflow-hidden inline-flex items-center justify-between gap-5 pl-7 sm:pl-8 pr-2.5 py-2.5 sm:py-3 rounded-full bg-[#0A0A0C] text-white border border-white/20 hover:border-[#FF3B2E]/80 shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_40px_rgba(255,59,46,0.35)] transition-all duration-300 select-none"
            >
              {/* Radial Expanding #FF3B2E Circle Layer (Expands outward from arrow badge to cover entire pill) */}
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#FF3B2E] transition-transform duration-500 ease-out group-hover:scale-[16] pointer-events-none z-0 shadow-[0_0_18px_rgba(255,59,46,0.6)]" />

              {/* Text */}
              <span className="relative z-10 font-semibold text-sm sm:text-base tracking-wide text-white">
                Join the Experience
              </span>

              {/* Arrow Icon Positioned Over Radial Expanding Circle (Static) */}
              <span className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-white select-none">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>

            {/* Secondary Button: Explore Events */}
            <Link
              href="#events"
              className="group inline-flex items-center justify-between gap-5 pl-7 sm:pl-8 pr-2.5 py-2.5 sm:py-3 rounded-full bg-[#0A0A0C]/90 hover:bg-[#141418] text-zinc-200 hover:text-white border border-white/20 hover:border-white/35 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all duration-300 select-none"
            >
              <span className="font-semibold text-sm sm:text-base tracking-wide">
                Explore Events
              </span>
              <span className="w-10 h-10 rounded-full bg-white/10 group-hover:bg-white/15 border border-white/20 flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-105 group-hover:translate-x-0.5">
                <svg
                  className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
