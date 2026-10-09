'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import ISLLogo from '@/components/brand/ISLLogo';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Check prefers-reduced-motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      // Initial subtle entrance
      gsap.from(contentRef.current, {
        opacity: 0,
        y: 20,
        duration: 1.0,
        ease: 'power3.out',
      });

      // Scroll recession transformation
      gsap.to(frameRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
        },
        scale: 0.86,
        borderRadius: '32px',
        opacity: 0.88,
        ease: 'power1.inOut',
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full flex items-center justify-center pt-12 sm:pt-16 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Physical Receding Frame Wrapper */}
      <div
        ref={frameRef}
        className="relative w-full max-w-7xl min-h-[85vh] rounded-3xl border border-white/10 bg-[#0A0F1E]/40 backdrop-blur-md p-6 sm:p-10 lg:p-14 flex flex-col justify-between items-center shadow-[0_20px_80px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,255,255,0.12)] will-change-transform overflow-hidden"
      >
        {/* Top Header Identity: College Banner */}
        <div className="w-full flex items-center justify-between border-b border-white/10 pb-4 sm:pb-5 z-10">
          <div className="flex items-center gap-3">
            <ISLLogo className="h-8 sm:h-10 w-auto" />
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-zinc-400 uppercase tracking-widest">
            <span className="hidden sm:inline">ISL ENGINEERING COLLEGE • HYDERABAD</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
            <span className="text-[#FF6A00] font-semibold">10·11·12 NOV 2026</span>
          </div>
        </div>

        {/* Hero Center Body: Official Transparent Logo Asset Only */}
        <div
          ref={contentRef}
          className="my-auto py-8 flex flex-col items-center text-center z-10 w-full max-w-4xl"
        >
          {/* Main Pure Nexus Vyoma Artwork */}
          <div className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl flex items-center justify-center mb-8">
            <Image
              src="/brand/nexus-wordmark-official.png"
              alt="Nexus Vyoma - A Three-Day Inter-College Fest"
              width={680}
              height={220}
              priority
              className="w-full h-auto object-contain select-none filter drop-shadow-[0_10px_35px_rgba(0,0,0,0.7)]"
            />
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gradient-to-r from-[#FF6A00] via-[#FF382E] to-[#D8182B] text-white font-bold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(255,106,0,0.5)] hover:shadow-[0_0_40px_rgba(255,106,0,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <span>REGISTER NOW</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>

            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white font-semibold text-sm tracking-wider uppercase backdrop-blur-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>EXPLORE EVENTS</span>
            </Link>
          </div>
        </div>

        {/* Bottom Hero Stats / Pillars */}
        <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 border-t border-white/10 z-10 text-center">
          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl text-white font-bold">3 DAYS</span>
            <span className="text-[10px] sm:text-xs font-mono tracking-wider text-zinc-400 uppercase">
              10–12 NOV 2026
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl text-[#FF6A00] font-bold">
              6+ FLAGSHIP
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-wider text-zinc-400 uppercase">
              MEGA ARENAS
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl text-[#0066FF] font-bold">
              ₹1,00,000+
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-wider text-zinc-400 uppercase">
              PRIZE POOL
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl sm:text-3xl text-[#FF207D] font-bold">
              50+ COLLEGES
            </span>
            <span className="text-[10px] sm:text-xs font-mono tracking-wider text-zinc-400 uppercase">
              ACROSS INDIA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
