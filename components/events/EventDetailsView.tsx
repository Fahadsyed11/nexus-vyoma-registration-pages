'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CatalogEvent } from '@/lib/data/eventsCatalog';
import EventDetailTitleRolling from './EventDetailTitleRolling';

interface EventDetailsViewProps {
  event: CatalogEvent;
}

export default function EventDetailsView({ event }: EventDetailsViewProps) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGrabSeatClick = (e: React.MouseEvent) => {
    if (!event.registrationUrl) {
      e.preventDefault();
      setStatusMessage('Registration is not active for this event yet.');
      // Auto-hide message after 4 seconds
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const renderGrabSeatButton = (extraClassName = '') => {
    if (event.registrationUrl) {
      return (
        <Link
          href={event.registrationUrl}
          className={`inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-lg border border-[#FF6A00] bg-transparent text-[#FF6A00] hover:bg-[#FF6A00]/10 hover:shadow-[0_0_24px_rgba(255,106,0,0.3)] active:scale-[0.98] transition-all duration-200 font-sans font-bold text-xs sm:text-sm tracking-wider uppercase select-none outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] ${extraClassName}`}
        >
          <span>GRAB YOUR SEAT</span>
        </Link>
      );
    }

    return (
      <div className={`flex flex-col items-start ${extraClassName}`}>
        <button
          type="button"
          onClick={handleGrabSeatClick}
          aria-label="Grab your seat — Registration is not active"
          className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-lg border border-[#FF6A00] bg-transparent text-[#FF6A00] hover:bg-[#FF6A00]/10 hover:shadow-[0_0_24px_rgba(255,106,0,0.3)] active:scale-[0.98] transition-all duration-200 font-sans font-bold text-xs sm:text-sm tracking-wider uppercase cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
        >
          <span>GRAB YOUR SEAT</span>
        </button>

        {statusMessage && (
          <div
            role="status"
            className="mt-2 text-xs font-mono text-[#FF6A00] bg-[#FF6A00]/10 border border-[#FF6A00]/30 rounded-md px-3 py-1.5 animate-in fade-in duration-200"
          >
            {statusMessage}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* ============================================================ */}
      {/* 1. EVENT HEADING                                             */}
      {/* ============================================================ */}
      <div className="w-full mb-6 sm:mb-8 text-left">
        <EventDetailTitleRolling title={event.title} />
      </div>

      {/* ============================================================ */}
      {/* 2. MAIN CONTENT AREA: TWO-COLUMN (DESKTOP) / STACKED (MOBILE)*/}
      {/* ============================================================ */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
        {/* ---------------------------------------------------------- */}
        {/* LEFT COLUMN: Event Image, Entry Fee, Grab Seat (Desktop)   */}
        {/* ---------------------------------------------------------- */}
        <div className="w-full lg:col-span-5 flex flex-col">
          {/* Event Image Box */}
          <div className="relative w-full aspect-[16/10] rounded-xl sm:rounded-2xl overflow-hidden bg-[#10121b] border border-white/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.65)] flex items-center justify-center">
            {event.imageUrl ? (
              <Image
                src={event.imageUrl}
                alt={event.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 550px"
              />
            ) : (
              <div className="relative w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#161824] via-[#0d0e15] to-[#06070b] p-6 text-center select-none overflow-hidden">
                {/* Ambient glow background */}
                <div
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle at 50% 50%, rgba(255, 106, 0, 0.35) 0%, transparent 70%)',
                  }}
                />
                <Image
                  src="/brand/nexus-emblem-watermark.png"
                  alt="Nexus Vyoma Official Emblem"
                  width={140}
                  height={140}
                  className="opacity-25 object-contain select-none pointer-events-none"
                  style={{ width: 'auto', height: 'auto' }}
                  priority
                />
                <span className="mt-3 font-mono text-[11px] font-bold uppercase tracking-widest text-[#FF6A00] bg-black/60 border border-[#FF6A00]/30 px-3 py-1 rounded-md backdrop-blur-sm">
                  {event.mockId || 'OFFICIAL EVENT'}
                </span>
              </div>
            )}
          </div>

          {/* Highlighted Event Fee & Prize Money */}
          <div className="mt-4 sm:mt-5 grid grid-cols-2 gap-3 text-left">
            {/* 1. Highlighted Event Fee */}
            <div className="rounded-xl border border-[#FF6A00]/40 bg-gradient-to-br from-[#FF6A00]/15 via-[#FF3B2E]/10 to-transparent p-3 sm:p-3.5 shadow-[0_0_20px_rgba(255,106,0,0.15)] flex flex-col justify-center">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] select-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
                EVENT FEE
              </span>
              <span className="font-sans text-sm sm:text-base font-extrabold text-white tracking-tight mt-0.5">
                {event.feeText || '₹200'}
              </span>
            </div>

            {/* 2. Prize Money Display */}
            <div className="rounded-xl border border-[#FBB03B]/40 bg-gradient-to-br from-[#FBB03B]/15 via-[#FF6A00]/10 to-transparent p-3 sm:p-3.5 shadow-[0_0_20px_rgba(251,176,59,0.12)] flex flex-col justify-center">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FBB03B] select-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBB03B]" />
                PRIZE POOL
              </span>
              <span className="font-sans text-xs sm:text-sm md:text-base font-extrabold text-white tracking-tight mt-0.5">
                {event.prizePool && event.prizePool !== 'N/A'
                  ? 'Exciting prizes'
                  : 'N/A'}
              </span>
            </div>
          </div>

          {/* Desktop Grab Seat Action */}
          <div className="hidden lg:block mt-6">
            {renderGrabSeatButton()}
          </div>
        </div>

        {/* ---------------------------------------------------------- */}
        {/* RIGHT COLUMN: About This Event & Requirements Cards        */}
        {/* ---------------------------------------------------------- */}
        <div className="w-full lg:col-span-7 flex flex-col gap-5 sm:gap-6">
          {/* Card 1: ABOUT THIS EVENT */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0c0d13]/90 backdrop-blur-md p-5 sm:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-left">
            <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold tracking-wider text-white uppercase mb-3 sm:mb-4 select-none">
              ABOUT THIS EVENT
            </h2>

            <div className="text-zinc-300 text-xs sm:text-sm leading-relaxed space-y-3 sm:space-y-4 font-sans">
              {event.description && event.description.length > 0 ? (
                event.description.map((para, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {para}
                  </p>
                ))
              ) : (
                <p className="leading-relaxed">{event.shortDescription}</p>
              )}
            </div>
          </div>

          {/* Card 2: REQUIREMENTS */}
          <div className="rounded-2xl border border-zinc-800/90 bg-[#0c0d13]/90 backdrop-blur-md p-5 sm:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-left">
            <h2 className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold tracking-wider text-[#FF6A00] uppercase mb-3 sm:mb-4 select-none">
              REQUIREMENTS
            </h2>

            <ul className="space-y-2 text-zinc-300 text-xs sm:text-sm font-sans list-none">
              {event.requirements && event.requirements.length > 0 ? (
                event.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-zinc-400 select-none">•</span>
                    <span>{req}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-2 leading-relaxed">
                  <span className="text-zinc-400 select-none">•</span>
                  <span>General event participation guidelines apply.</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. METADATA ROW                                              */}
      {/* ============================================================ */}
      <div className="w-full pt-6 sm:pt-8 mt-8 sm:mt-10 border-t border-zinc-800/90">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 text-left">
          {/* PARTICIPATION */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] select-none">
              PARTICIPATION
            </span>
            <span className="text-xs sm:text-sm text-zinc-200 font-sans mt-1">
              {event.participationType}
            </span>
          </div>

          {/* VENUE */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] select-none">
              VENUE
            </span>
            <span className="text-xs sm:text-sm text-zinc-200 font-sans mt-1">
              {event.venue}
            </span>
          </div>

          {/* DATE */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] select-none">
              DATE
            </span>
            <span className="text-xs sm:text-sm text-zinc-200 font-sans mt-1">
              {event.date}
            </span>
          </div>

          {/* TIME */}
          <div className="flex flex-col">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] select-none">
              TIME
            </span>
            <span className="text-xs sm:text-sm text-zinc-200 font-sans mt-1">
              {event.time}
            </span>
          </div>

          {/* CATEGORY */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF6A00] select-none">
              CATEGORY
            </span>
            <span className="text-xs sm:text-sm text-zinc-200 font-sans mt-1">
              {event.category}
            </span>
          </div>
        </div>

        {/* Mobile Grab Seat Action (in logical stack flow below metadata) */}
        <div className="block lg:hidden mt-6 w-full">
          {renderGrabSeatButton('w-full')}
        </div>

        {/* Status Note / Disclaimer */}
        <div className="w-full mt-4 sm:mt-6 text-center sm:text-right">
          <p className="font-sans text-[11px] text-zinc-500 tracking-wide select-none">
            {event.statusNote || 'Sample event only. Registration is not active.'}
          </p>
        </div>
      </div>
    </div>
  );
}
