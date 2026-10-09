'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { EventItem } from '@/lib/data/events';
import EventIcon, { EVENT_DETAILS } from '@/components/brand/EventIcons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface FlagshipCardItemProps {
  event: EventItem;
  index: number;
}

const CATEGORY_COLORS: Record<string, { glow: string; border: string; accent: string }> = {
  cosplay: {
    glow: 'rgba(255, 32, 125, 0.35)',
    border: 'rgba(255, 32, 125, 0.4)',
    accent: '#FF207D',
  },
  dj: {
    glow: 'rgba(255, 106, 0, 0.35)',
    border: 'rgba(255, 106, 0, 0.4)',
    accent: '#FF6A00',
  },
  'auto-expo': {
    glow: 'rgba(255, 56, 46, 0.35)',
    border: 'rgba(255, 56, 46, 0.4)',
    accent: '#FF382E',
  },
  qawwali: {
    glow: 'rgba(251, 176, 59, 0.35)',
    border: 'rgba(251, 176, 59, 0.4)',
    accent: '#FBB03B',
  },
  'tech-battles': {
    glow: 'rgba(0, 102, 255, 0.35)',
    border: 'rgba(0, 102, 255, 0.4)',
    accent: '#0066FF',
  },
  culinary: {
    glow: 'rgba(123, 44, 255, 0.35)',
    border: 'rgba(123, 44, 255, 0.4)',
    accent: '#7B2CFF',
  },
};

export default function FlagshipCardItem({ event, index }: FlagshipCardItemProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardShellRef = useRef<HTMLDivElement>(null);
  const visualCardRef = useRef<HTMLDivElement>(null);
  const textContentRef = useRef<HTMLDivElement>(null);

  const colors = CATEGORY_COLORS[event.categoryId] || {
    glow: 'rgba(255, 106, 0, 0.35)',
    border: 'rgba(255, 106, 0, 0.4)',
    accent: '#FF6A00',
  };

  const categoryMeta = EVENT_DETAILS[event.categoryId];

  useGSAP(
    () => {
      const track = trackRef.current;
      const visualCard = visualCardRef.current;
      const textContent = textContentRef.current;

      if (!track || !visualCard || !textContent) return;

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        gsap.set([visualCard, textContent], { opacity: 1, x: 0, y: 0, filter: 'none' });
        return;
      }

      const mm = gsap.matchMedia();

      // Desktop & Large Screens (lg: >= 1024px)
      mm.add('(min-width: 1024px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: 'top 65%',
            end: 'bottom 85%',
            scrub: 0.75,
          },
        });

        // 1. Initial State: Visual card starts shifted toward the center of the viewport
        gsap.set(visualCard, {
          xPercent: 70,
          scale: 0.96,
          opacity: 0.85,
        });

        // 2. Initial State: Text content is completely hidden on the right
        gsap.set(textContent, {
          opacity: 0,
          x: 40,
          filter: 'blur(10px)',
        });

        // Phase 1: Card shifts from center to the left side
        tl.to(
          visualCard,
          {
            xPercent: 0,
            scale: 1,
            opacity: 1,
            ease: 'power2.out',
            duration: 0.55,
          },
          0
        );

        // Phase 2: Title and Description reveal smoothly on the right
        tl.to(
          textContent,
          {
            opacity: 1,
            x: 0,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: 0.45,
          },
          0.35
        );

        // Hold full visibility through the end of the scroll track
        tl.to({}, { duration: 0.2 });
      });

      // Mobile & Tablet (< 1024px)
      mm.add('(max-width: 1023px)', () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: track,
            start: 'top 80%',
            end: 'bottom 90%',
            scrub: 0.6,
          },
        });

        gsap.set(visualCard, {
          scale: 0.92,
          opacity: 0.4,
          y: 30,
        });

        gsap.set(textContent, {
          opacity: 0,
          y: 25,
          filter: 'blur(6px)',
        });

        tl.to(
          visualCard,
          {
            scale: 1,
            opacity: 1,
            y: 0,
            ease: 'power2.out',
            duration: 0.5,
          },
          0
        );

        tl.to(
          textContent,
          {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            ease: 'power2.out',
            duration: 0.5,
          },
          0.3
        );
      });
    },
    { scope: trackRef }
  );

  return (
    <div
      ref={trackRef}
      className="w-full relative min-h-[110vh] sm:min-h-[125vh] flex flex-col justify-start"
    >
      {/* Pinned Sticky Card Shell */}
      <div
        ref={cardShellRef}
        className="sticky top-20 sm:top-28 w-full rounded-2xl sm:rounded-3xl border border-white/15 bg-[#070B16]/85 backdrop-blur-2xl p-5 sm:p-10 lg:p-14 shadow-[0_25px_80px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden will-change-transform"
        style={{
          zIndex: index + 1,
        }}
      >
        {/* Ambient Category Glow Behind the Card */}
        <div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-[110px] pointer-events-none"
          style={{ backgroundColor: colors.accent }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full opacity-15 blur-[110px] pointer-events-none"
          style={{ backgroundColor: colors.accent }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-14 items-center w-full min-h-[340px] sm:min-h-[420px]">
          {/* LEFT: Visual / Image Card */}
          <div
            ref={visualCardRef}
            className="lg:col-span-5 w-full flex flex-col items-center justify-center p-6 sm:p-10 lg:p-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-black/70 border border-white/15 relative overflow-hidden shadow-2xl group will-change-transform"
            style={{
              boxShadow: `0 20px 50px rgba(0,0,0,0.6), inset 0 0 40px ${colors.glow}`,
            }}
          >
            {/* Fine Grid Mesh Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

            {/* Glowing Category Vector Icon */}
            <div className="w-20 h-20 sm:w-36 sm:h-36 mb-4 sm:mb-6 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center relative">
              <div
                className="absolute inset-0 rounded-full blur-2xl opacity-40"
                style={{ backgroundColor: colors.accent }}
              />
              <EventIcon
                id={event.categoryId}
                size={100}
                className="w-full h-full relative z-10 drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]"
              />
            </div>

            {/* Category Badge & Headline Caption */}
            <div className="text-center z-10 flex flex-col items-center gap-1.5 sm:gap-2">
              <span
                className="px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase border"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderColor: colors.border,
                  color: '#FFFFFF',
                }}
              >
                {categoryMeta?.title || event.category}
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400 tracking-widest uppercase">
                {event.caption}
              </span>
            </div>
          </div>

          {/* RIGHT: Title & Description ONLY */}
          <div
            ref={textContentRef}
            className="lg:col-span-7 flex flex-col justify-center gap-3.5 sm:gap-5 will-change-transform"
          >
            {/* Flagship Event Title */}
            <h3 className="font-display text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-wide text-white uppercase leading-[1.1] drop-shadow-lg">
              {event.title}
            </h3>

            {/* Flagship Event Description */}
            <p className="font-sans text-sm sm:text-base lg:text-lg text-zinc-300 leading-relaxed max-w-2xl font-normal">
              {event.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
