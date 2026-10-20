'use client';

import React from 'react';

interface TicketStubCardProps {
  price?: number;
  isPurchased?: boolean;
  attendeeName?: string;
  attendeeEmail?: string;
}

export default function TicketStubCard({
  price = 299,
  isPurchased = false,
  attendeeName,
  attendeeEmail,
}: TicketStubCardProps) {
  return (
    <div className="relative isolate w-full rounded-2xl bg-[#0c0d13] border border-zinc-800/90 hover:border-zinc-700 transition-all duration-300 overflow-hidden shadow-2xl">
      {/* Top Holographic Flame Accent Strip */}
      <div className="w-full h-1.5 bg-gradient-to-r from-[#D8182B] via-[#FF6A00] to-[#FBB03B]" />

      {/* Upper Stub: Fest Info & Pricing */}
      <div className="p-5 sm:p-6 flex flex-col gap-4 relative z-10">
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono tracking-widest uppercase bg-[#FF6A00]/15 text-[#FF8833] border border-[#FF6A00]/30 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00] animate-pulse" />
            {isPurchased ? 'CONFIRMED PASS' : '3-DAY FEST PASS'}
          </span>
          <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
            10 · 11 · 12 NOV 2026
          </span>
        </div>

        <div className="flex flex-col gap-0.5">
          <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-white tracking-wide uppercase leading-tight">
            NEXUS VYOMA 2026
          </h2>
          <p className="text-[11px] font-mono text-zinc-400 tracking-wider uppercase">
            ISL ENGINEERING COLLEGE • HYDERABAD
          </p>
        </div>

        {/* Pricing Highlight */}
        <div className="flex items-baseline justify-between pt-3 border-t border-zinc-800/80">
          <div className="flex flex-col">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
              ALL-ACCESS PASS
            </span>
            <span className="text-xs font-mono text-emerald-400">
              Single Ticket • All 3 Days Included
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-mono text-[#FF8833]">₹</span>
            <span className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl text-white tracking-tight">
              {price}
            </span>
          </div>
        </div>

        {attendeeName && (
          <div className="p-2.5 rounded-xl bg-black/40 border border-zinc-800 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500 uppercase text-[11px]">Passholder</span>
            <span className="text-zinc-200 font-medium truncate max-w-[180px]">
              {attendeeName}
            </span>
          </div>
        )}
      </div>

      {/* Perforation Divider Line with Notches */}
      <div className="relative w-full my-1 flex items-center select-none">
        {/* Left Notch */}
        <div
          aria-hidden="true"
          className="absolute -left-3.5 w-7 h-7 rounded-full bg-black border border-zinc-800 shadow-inner"
        />
        {/* Dashed Line */}
        <div className="w-full border-t-2 border-dashed border-zinc-800 mx-5" />
        {/* Right Notch */}
        <div
          aria-hidden="true"
          className="absolute -right-3.5 w-7 h-7 rounded-full bg-black border border-zinc-800 shadow-inner"
        />
      </div>

      {/* Lower Stub: Pass Inclusions & Barcode */}
      <div className="p-5 sm:p-6 pt-3 flex flex-col gap-4 relative z-10 bg-[#090a0f]/60">
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest font-semibold">
            Pass Benefits:
          </span>
          <ul className="flex flex-col gap-1.5 text-xs font-mono text-zinc-300">
            <li className="flex items-start gap-2">
              <span className="text-[#FF6A00] mt-0.5">✦</span>
              <span>Complete 3-Day Campus Access (10–12 Nov)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF6A00] mt-0.5">✦</span>
              <span>Cultural Evenings, Celebrity Concerts & DJ Night</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF6A00] mt-0.5">✦</span>
              <span>Technical Arenas, Hackathons & Project Expos</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF6A00] mt-0.5">✦</span>
              <span>Gaming Arenas, E-Sports Pit & Food Streets</span>
            </li>
          </ul>
        </div>

        {/* Barcode & Pass Serial */}
        <div className="flex flex-col items-center gap-1.5 pt-3 border-t border-zinc-800/80">
          {/* SVG Barcode */}
          <div className="w-full h-8 flex items-center justify-between opacity-80 px-1 select-none">
            {[
              3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 2, 4,
              1, 3, 1, 2, 4, 2, 1, 3,
            ].map((w, idx) => (
              <span
                key={idx}
                className="h-full bg-zinc-400 inline-block"
                style={{ width: `${w * 1.5}px` }}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono tracking-[0.25em] text-zinc-500 uppercase">
            {attendeeEmail
              ? `NV26-PASS-${attendeeEmail.slice(0, 4).toUpperCase()}-${price}`
              : `NV26-ALLACCESS-3DAY-${price}`}
          </span>
        </div>
      </div>
    </div>
  );
}
