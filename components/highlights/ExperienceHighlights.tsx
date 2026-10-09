'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import EventIcon from '@/components/brand/EventIcons';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function ExperienceHighlights() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
      }

      gsap.from(gridRef.current?.children || [], {
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
          end: 'top 45%',
          scrub: 0.5,
        },
        opacity: 0,
        y: 40,
        stagger: 0.08,
      });
    },
    { scope: containerRef }
  );

  const highlights = [
    {
      categoryId: 'tech-battles' as const,
      tag: 'TECH × CODE',
      title: 'HACKATHONS & AI DUELS',
      desc: '24-hour sprint challenges, autonomous robotics arenas, and algorithmic combat testing nation-wide engineering intellect.',
      color: '#0066FF',
    },
    {
      categoryId: 'dj' as const,
      tag: 'GAMING × SOUND',
      title: 'MEGA DJ & SONIC DOME',
      desc: 'Laser-synchronized concert arena with custom acoustic rigs delivering high-octane electronic drops and bass energy.',
      color: '#FF6A00',
    },
    {
      categoryId: 'auto-expo' as const,
      tag: 'POWER × MOTION',
      title: 'AUTOMOTIVE CONCOURSE',
      desc: 'Exotic supercars, custom tuning builds, and electric formula prototypes exhibited in open-air paddock galleries.',
      color: '#FF382E',
    },
    {
      categoryId: 'cosplay' as const,
      tag: 'FANTASY × ART',
      title: 'COSPLAY CHAMPIONSHIPS',
      desc: 'Anime, gaming, and cinematic characters brought to life on stage with national cosplay craftsmanship judges.',
      color: '#FF207D',
    },
    {
      categoryId: 'qawwali' as const,
      tag: 'SOUL × TRADITION',
      title: 'SUFI & QAWWALI NIGHT',
      desc: 'Transcendent acoustic melodies and legendary vocal harmonies echoing under the open midnight sky.',
      color: '#FBB03B',
    },
    {
      categoryId: 'food-fest' as const,
      tag: 'COMMUNITY × TASTE',
      title: 'CULINARY CARNIVAL',
      desc: 'Hyderabadi artisanal street flavours, gourmet fusion trucks, and culinary celebration pavilions.',
      color: '#7B2CFF',
    },
  ];

  return (
    <section
      id="highlights"
      ref={containerRef}
      className="relative w-full py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-transparent flex flex-col items-center justify-center overflow-hidden select-none"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10">
        {/* 6 Grid Highlight Pillars */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full"
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              className="p-7 rounded-2xl bg-[#0A0F1E]/80 border border-white/10 hover:border-white/25 backdrop-blur-xl transition-all duration-300 group hover:-translate-y-1.5 hover:shadow-[0_15px_40px_rgba(0,0,0,0.7)] flex flex-col justify-between relative overflow-hidden"
            >
              {/* Corner Glow Accent */}
              <div
                className="absolute -top-16 -right-16 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl pointer-events-none"
                style={{ backgroundColor: item.color }}
              />

              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/10 group-hover:border-white/20 transition-colors">
                    <EventIcon id={item.categoryId} size={28} color={item.color} />
                  </div>
                  <span
                    className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border border-white/10 bg-black/40"
                    style={{ color: item.color }}
                  >
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-display text-2xl font-bold tracking-wider text-white mb-2 group-hover:text-[#FF6A00] transition-colors">
                  {item.title}
                </h3>
                <p className="font-sans text-xs text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>NEXUS VYOMA</span>
                <span className="text-zinc-300 group-hover:text-white transition-colors">ARENA →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
