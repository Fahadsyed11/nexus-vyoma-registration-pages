'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  'mehfil-e-hunar': { color: '#FFB800' },
  fandomania: { color: '#E020FF' },
  riwayat: { color: '#D97706' },
  charcha: { color: '#F59E0B' },
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
          Seven monumental arenas revealing sequentially on scroll.
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
          const categoryMeta = EVENT_DETAILS[event.categoryId];
          const themeColor = event.accentColor || CATEGORY_THEMES[event.categoryId]?.color || '#FF6A00';

          return (
            <ScrollStackItem
              key={event.id}
              itemClassName="w-full max-w-6xl mx-auto"
            >
              <div
                tabIndex={0}
                role="region"
                aria-label={event.title}
                className="group/card relative w-full rounded-2xl sm:rounded-3xl border bg-[#060913] p-4 sm:p-7 lg:p-9 overflow-hidden transition-all duration-300 ease-out motion-reduce:transition-none focus-visible:outline-none"
                style={{
                  borderColor: `${themeColor}45`,
                  boxShadow: `0 0 32px -4px ${themeColor}30, 0 16px 44px rgba(0, 0, 0, 0.95), inset 0 0 16px -6px ${themeColor}20`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${themeColor}85`;
                  e.currentTarget.style.boxShadow = `0 0 44px -2px ${themeColor}55, 0 20px 52px rgba(0, 0, 0, 0.98), inset 0 0 20px -4px ${themeColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${themeColor}45`;
                  e.currentTarget.style.boxShadow = `0 0 32px -4px ${themeColor}30, 0 16px 44px rgba(0, 0, 0, 0.95), inset 0 0 16px -6px ${themeColor}20`;
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = `${themeColor}90`;
                  e.currentTarget.style.boxShadow = `0 0 46px -2px ${themeColor}65, 0 22px 56px rgba(0, 0, 0, 0.98), inset 0 0 22px -4px ${themeColor}35`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = `${themeColor}45`;
                  e.currentTarget.style.boxShadow = `0 0 32px -4px ${themeColor}30, 0 16px 44px rgba(0, 0, 0, 0.95), inset 0 0 16px -6px ${themeColor}20`;
                }}
              >
                {/* Top Specular Sheen Line with Theme Accent Glow */}
                <div
                  className="absolute inset-x-0 top-0 h-[1px] pointer-events-none opacity-50 transition-opacity duration-300 group-hover/card:opacity-95"
                  style={{
                    background: `linear-gradient(90deg, transparent 0%, ${themeColor}90 35%, rgba(255, 255, 255, 0.5) 50%, ${themeColor}90 65%, transparent 100%)`,
                  }}
                  aria-hidden="true"
                />

                {/* Corner Ambient Glow Bloom (Tuned directly to poster accent color) */}
                <div
                  className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none opacity-20 transition-opacity duration-500 blur-3xl group-hover/card:opacity-35"
                  style={{ backgroundColor: themeColor }}
                  aria-hidden="true"
                />

                <div className="relative z-10 flex flex-col lg:flex-row items-center gap-6 sm:gap-8 lg:gap-10 w-full min-h-0">
                  {/* LEFT: Visual / Image Card - snug fixed frame strictly as per poster size with NO side gaps */}
                  <Link
                    href={`/events/${event._id || event.slug}`}
                    className="relative flex-shrink-0 rounded-xl sm:rounded-2xl overflow-hidden group/visual border transition-all duration-300 shadow-2xl flex items-center justify-center bg-[#07090F] block cursor-pointer"
                    style={{
                      aspectRatio: event.aspectRatio || '1/1',
                      height: 'clamp(280px, 42vw, 420px)',
                      maxWidth: '100%',
                      borderColor: `${themeColor}55`,
                      boxShadow: `0 0 32px -6px ${themeColor}40, 0 16px 36px rgba(0, 0, 0, 0.9)`,
                    }}
                  >
                    {event.image ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 420px"
                          className="object-contain transition-transform duration-500 ease-out group-hover/visual:scale-105"
                          priority={event.id === 'fandomania'}
                        />

                        {/* Crisp 1px specular inner ring */}
                        <div className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none ring-1 ring-inset ring-white/15" />

                        {/* Floating Category Pill */}
                        <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 z-10">
                          <span
                            className="px-2.5 py-1 rounded-full font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase border backdrop-blur-md shadow-lg"
                            style={{
                              borderColor: `${themeColor}80`,
                              boxShadow: `0 0 12px -2px ${themeColor}40`,
                              backgroundColor: 'rgba(6, 9, 19, 0.88)',
                              color: '#FFFFFF',
                            }}
                          >
                            {event.category || categoryMeta?.title}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full p-6 flex flex-col items-center justify-center">
                        {/* Micro Grid Mesh Fallback */}
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                        {/* Vector Icon Motif */}
                        <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mb-2 sm:mb-4 transition-transform duration-300 group-hover/visual:scale-105 flex items-center justify-center relative">
                          <EventIcon
                            id={event.categoryId}
                            size={80}
                            className="w-full h-full relative z-10"
                          />
                        </div>

                        {/* Category Label & Caption */}
                        <div className="text-center z-10 flex flex-col items-center gap-0.5 sm:gap-1">
                          <span className="px-2.5 py-0.5 sm:px-3.5 sm:py-1 rounded-full font-mono text-[10px] sm:text-xs font-semibold tracking-wider uppercase border border-white/15 bg-white/[0.05] text-white">
                            {event.category || categoryMeta?.title}
                          </span>
                          <span className="font-mono text-[9px] sm:text-[11px] text-zinc-400 tracking-widest uppercase">
                            {event.caption}
                          </span>
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* RIGHT: Title & Description & Metadata */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-2.5 sm:gap-4 w-full">
                    {/* Eyebrow Tagline */}
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: themeColor }}
                      />
                      <span className="font-mono text-[10px] sm:text-xs tracking-widest uppercase text-zinc-400 font-semibold line-clamp-1">
                        {event.tagline || event.caption}
                      </span>
                    </div>

                    {/* Flagship Title */}
                    <h3 className="font-display text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-wide text-white uppercase leading-[1.1]">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className="font-sans text-xs sm:text-sm lg:text-base text-zinc-300 leading-relaxed font-normal line-clamp-3 sm:line-clamp-none">
                      {event.shortDescription || event.description}
                    </p>

                    {/* Compact Metadata Chips: Date & Venue only */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-1">
                      {event.date && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-[10px] sm:text-xs text-zinc-300">
                          <span style={{ color: themeColor }}>🗓️</span> {event.day ? `${event.day} • ` : ''}{event.date}{event.time ? ` • ${event.time}` : ''}
                        </div>
                      )}
                      {event.venue && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 font-mono text-[10px] sm:text-xs text-zinc-300">
                          <span style={{ color: themeColor }}>📍</span> {event.venue}
                        </div>
                      )}
                    </div>

                    {/* Action Link: Explore Arena */}
                    <div className="pt-1.5 sm:pt-2">
                      <Link
                        href={`/events/${event._id || event.slug}`}
                        className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-mono text-xs sm:text-sm font-semibold tracking-wider uppercase text-white bg-white/[0.06] hover:bg-white/[0.12] border border-white/20 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                        style={{
                          boxShadow: `0 0 16px -4px ${themeColor}35`,
                          borderColor: `${themeColor}40`,
                        }}
                      >
                        <span>Explore Arena</span>
                        <span className="text-zinc-400 group-hover/card:translate-x-1 transition-transform">→</span>
                      </Link>
                    </div>
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
