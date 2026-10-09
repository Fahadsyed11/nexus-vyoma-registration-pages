'use client';

import React from 'react';
import { OFFICIAL_FLAGSHIP_EVENTS } from '@/lib/data/events';
import EventIcon, { EVENT_DETAILS } from '@/components/brand/EventIcons';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';

const CATEGORY_THEMES: Record<
  string,
  { glow: string; border: string; accent: string; gradient: string }
> = {
  cosplay: {
    glow: 'rgba(255, 32, 125, 0.35)',
    border: 'rgba(255, 32, 125, 0.45)',
    accent: '#FF207D',
    gradient: 'from-[#FF207D]/25 via-white/[0.04] to-black/80',
  },
  dj: {
    glow: 'rgba(255, 106, 0, 0.35)',
    border: 'rgba(255, 106, 0, 0.45)',
    accent: '#FF6A00',
    gradient: 'from-[#FF6A00]/25 via-white/[0.04] to-black/80',
  },
  'auto-expo': {
    glow: 'rgba(255, 56, 46, 0.35)',
    border: 'rgba(255, 56, 46, 0.45)',
    accent: '#FF382E',
    gradient: 'from-[#FF382E]/25 via-white/[0.04] to-black/80',
  },
  qawwali: {
    glow: 'rgba(251, 176, 59, 0.35)',
    border: 'rgba(251, 176, 59, 0.45)',
    accent: '#FBB03B',
    gradient: 'from-[#FBB03B]/25 via-white/[0.04] to-black/80',
  },
  'tech-battles': {
    glow: 'rgba(0, 102, 255, 0.35)',
    border: 'rgba(0, 102, 255, 0.45)',
    accent: '#0066FF',
    gradient: 'from-[#0066FF]/25 via-white/[0.04] to-black/80',
  },
  'food-fest': {
    glow: 'rgba(123, 44, 255, 0.35)',
    border: 'rgba(123, 44, 255, 0.45)',
    accent: '#7B2CFF',
    gradient: 'from-[#7B2CFF]/25 via-white/[0.04] to-black/80',
  },
};

export default function FlagshipScrollDeck() {
  return (
    <div className="relative w-full py-16 sm:py-24">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-12 sm:mb-16 px-4 relative z-20">
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-white uppercase mb-3">
          FLAGSHIP ARENAS
        </h2>
        <p className="font-sans text-xs sm:text-sm md:text-base text-zinc-400 max-w-xl">
          Six monumental arenas revealing sequentially on scroll.
        </p>
      </div>

      {/* React Bits ScrollStack Integration */}
      <ScrollStack
        useWindowScroll={true}
        itemDistance={80}
        itemStackDistance={25}
        stackPosition="15%"
        scaleEndPosition="8%"
        baseScale={0.88}
        itemScale={0.025}
        rotationAmount={0}
        blurAmount={2}
        className="w-full"
      >
        {OFFICIAL_FLAGSHIP_EVENTS.map((event) => {
          const theme = CATEGORY_THEMES[event.categoryId] || {
            glow: 'rgba(255, 106, 0, 0.35)',
            border: 'rgba(255, 106, 0, 0.45)',
            accent: '#FF6A00',
            gradient: 'from-[#FF6A00]/25 via-white/[0.04] to-black/80',
          };
          const categoryMeta = EVENT_DETAILS[event.categoryId];

          return (
            <ScrollStackItem
              key={event.id}
              itemClassName="w-full max-w-6xl mx-auto"
            >
              <div className="relative w-full rounded-3xl border border-white/15 bg-[#060913]/95 backdrop-blur-2xl p-6 sm:p-10 lg:p-12 shadow-[0_30px_90px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.18)] overflow-hidden">
                {/* Ambient Category Flares */}
                <div
                  className="absolute -top-28 -right-28 w-96 h-96 rounded-full opacity-25 blur-[120px] pointer-events-none"
                  style={{ backgroundColor: theme.accent }}
                />
                <div
                  className="absolute -bottom-28 -left-28 w-96 h-96 rounded-full opacity-15 blur-[120px] pointer-events-none"
                  style={{ backgroundColor: theme.accent }}
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center w-full min-h-[300px] sm:min-h-[340px] lg:min-h-[360px]">
                  {/* LEFT: Visual / Image Card */}
                  <div
                    className={`lg:col-span-5 w-full h-[180px] sm:h-[240px] lg:h-full flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 rounded-2xl bg-gradient-to-br ${theme.gradient} border border-white/15 relative overflow-hidden shadow-2xl group`}
                    style={{
                      boxShadow: `0 20px 50px rgba(0,0,0,0.7), inset 0 0 45px ${theme.glow}`,
                    }}
                  >
                    {/* Micro Grid Mesh */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.14)_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />

                    {/* Glowing Vector Icon Motif */}
                    <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-3 sm:mb-5 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center relative">
                      <div
                        className="absolute inset-0 rounded-full blur-2xl opacity-45"
                        style={{ backgroundColor: theme.accent }}
                      />
                      <EventIcon
                        id={event.categoryId}
                        size={90}
                        className="w-full h-full relative z-10 drop-shadow-[0_0_35px_rgba(255,255,255,0.4)]"
                      />
                    </div>

                    {/* Category Label & Caption */}
                    <div className="text-center z-10 flex flex-col items-center gap-1">
                      <span
                        className="px-3.5 py-1 rounded-full font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase border"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.08)',
                          borderColor: theme.border,
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

                  {/* RIGHT: Title & Description */}
                  <div className="lg:col-span-7 flex flex-col justify-center gap-3 sm:gap-4">
                    <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-wide text-white uppercase leading-[1.1] drop-shadow-md">
                      {event.title}
                    </h3>

                    <p className="font-sans text-xs sm:text-sm lg:text-base xl:text-lg text-zinc-300 leading-relaxed font-normal">
                      {event.description}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollStackItem>
          );
        })}
      </ScrollStack>
    </div>
  );
}
