'use client';

import React from 'react';
import { OFFICIAL_FLAGSHIP_EVENTS } from '@/lib/data/events';
import EventIcon, { EVENT_DETAILS } from '@/components/brand/EventIcons';
import ScrollStack, { ScrollStackItem } from '@/components/ui/ScrollStack';

const CATEGORY_THEMES: Record<string, { color: string }> = {
  cosplay: { color: '#FF207D' },
  dj: { color: '#FF6A00' },
  'auto-expo': { color: '#FF382E' },
  qawwali: { color: '#FBB03B' },
  'tech-battles': { color: '#0066FF' },
  'food-fest': { color: '#7B2CFF' },
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
          const theme = CATEGORY_THEMES[event.categoryId] || { color: '#FF6A00' };
          const categoryMeta = EVENT_DETAILS[event.categoryId];

          return (
            <ScrollStackItem
              key={event.id}
              itemClassName="w-full max-w-6xl mx-auto"
            >
              <div
                className="relative w-full rounded-2xl sm:rounded-3xl border bg-[#060913] p-6 sm:p-10 lg:p-12 shadow-[0_24px_60px_rgba(0,0,0,0.9)] overflow-hidden"
                style={{ borderColor: theme.color }}
              >
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-14 items-center w-full min-h-[300px] sm:min-h-[340px] lg:min-h-[360px]">
                  {/* LEFT: Visual / Image Card (Neutral subtle border, no colored border inside) */}
                  <div className="lg:col-span-5 w-full h-[180px] sm:h-[240px] lg:h-full flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 rounded-xl sm:rounded-2xl bg-[#0C101D] border border-white/[0.08] relative overflow-hidden group">
                    {/* Micro Grid Mesh */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                    {/* Vector Icon Motif */}
                    <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-3 sm:mb-5 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center relative">
                      <EventIcon
                        id={event.categoryId}
                        size={90}
                        className="w-full h-full relative z-10"
                      />
                    </div>

                    {/* Category Label & Caption */}
                    <div className="text-center z-10 flex flex-col items-center gap-1">
                      <span className="px-3.5 py-1 rounded-full font-mono text-[11px] sm:text-xs font-semibold tracking-wider uppercase border border-white/15 bg-white/[0.05] text-white">
                        {categoryMeta?.title || event.category}
                      </span>
                      <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400 tracking-widest uppercase">
                        {event.caption}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT: Title & Description */}
                  <div className="lg:col-span-7 flex flex-col justify-center gap-3 sm:gap-4">
                    <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-wide text-white uppercase leading-[1.1]">
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
