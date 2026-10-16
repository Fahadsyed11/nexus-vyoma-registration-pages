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
    <div className="relative w-full pt-10 pb-6 sm:pt-16 sm:pb-10">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12 px-4 relative z-20">
        <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold tracking-wider text-white uppercase mb-2 sm:mb-3">
          FLAGSHIP EVENTS
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
                tabIndex={0}
                role="region"
                aria-label={event.title}
                className="group/card relative w-full rounded-2xl sm:rounded-3xl border bg-[#060913] p-4 sm:p-8 lg:p-12 overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none focus-visible:outline-none"
                style={{
                  borderColor: `${theme.color}40`,
                  boxShadow: `0 0 22px -4px ${theme.color}28, 0 16px 44px rgba(0, 0, 0, 0.95), inset 0 0 14px -6px ${theme.color}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${theme.color}80`;
                  e.currentTarget.style.boxShadow = `0 0 32px -2px ${theme.color}50, 0 20px 52px rgba(0, 0, 0, 0.98), inset 0 0 18px -4px ${theme.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${theme.color}40`;
                  e.currentTarget.style.boxShadow = `0 0 22px -4px ${theme.color}28, 0 16px 44px rgba(0, 0, 0, 0.95), inset 0 0 14px -6px ${theme.color}20`;
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = `${theme.color}90`;
                  e.currentTarget.style.boxShadow = `0 0 36px -2px ${theme.color}60, 0 22px 56px rgba(0, 0, 0, 0.98), inset 0 0 20px -4px ${theme.color}35`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${theme.color}40`;
                  e.currentTarget.style.boxShadow = `0 0 22px -4px ${theme.color}28, 0 16px 44px rgba(0, 0, 0, 0.95), inset 0 0 14px -6px ${theme.color}20`;
                }}
              >
                {/* Top Specular Sheen Line with Theme Color Bloom */}
                <div
                  className="absolute inset-x-0 top-0 h-[1px] pointer-events-none opacity-40 transition-opacity duration-300 group-hover/card:opacity-85"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${theme.color}80 35%, rgba(255, 255, 255, 0.35) 50%, ${theme.color}80 65%, transparent 100%)`,
                  }}
                  aria-hidden="true"
                />

                {/* Corner Ambient Glow Bloom (Integrated, Soft, No Particles) */}
                <div
                  className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none opacity-15 transition-opacity duration-500 blur-3xl group-hover/card:opacity-30"
                  style={{ backgroundColor: theme.color }}
                  aria-hidden="true"
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-8 lg:gap-14 items-center w-full min-h-0 sm:min-h-[320px] lg:min-h-[360px]">
                  {/* LEFT: Visual / Image Card (Neutral subtle border, no colored border inside) */}
                  <div className="lg:col-span-5 w-full h-[120px] sm:h-[220px] lg:h-full flex flex-col items-center justify-center p-3 sm:p-6 lg:p-10 rounded-xl sm:rounded-2xl bg-[#0C101D] border border-white/[0.08] relative overflow-hidden group">
                    {/* Micro Grid Mesh */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                    {/* Vector Icon Motif */}
                    <div className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-2 sm:mb-4 transition-transform duration-300 group-hover:scale-105 flex items-center justify-center relative">
                      <EventIcon
                        id={event.categoryId}
                        size={80}
                        className="w-full h-full relative z-10"
                      />
                    </div>

                    {/* Category Label & Caption */}
                    <div className="text-center z-10 flex flex-col items-center gap-0.5 sm:gap-1">
                      <span className="px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase border border-white/15 bg-white/[0.05] text-white">
                        {categoryMeta?.title || event.category}
                      </span>
                      <span className="font-mono text-[9px] sm:text-[11px] text-zinc-400 tracking-widest uppercase">
                        {event.caption}
                      </span>
                    </div>
                  </div>

                  {/* RIGHT: Title & Description */}
                  <div className="lg:col-span-7 flex flex-col justify-center gap-2 sm:gap-4">
                    <h3 className="font-display text-xl sm:text-3xl lg:text-5xl xl:text-6xl font-extrabold tracking-wide text-white uppercase leading-[1.1]">
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
