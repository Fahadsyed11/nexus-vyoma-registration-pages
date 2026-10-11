import React from 'react';
import Link from 'next/link';
import { CatalogEvent } from '@/lib/data/eventsCatalog';

interface EventCardProps {
  event: CatalogEvent;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block relative w-full rounded-2xl bg-[#0c0d13] border border-zinc-800/90 hover:border-zinc-700 transition-all duration-200 p-4 sm:p-5 md:p-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
        {/* Left: Image / Mock Placeholder Block */}
        <div className="w-full sm:w-44 md:w-48 h-28 sm:h-32 md:h-36 flex-shrink-0 rounded-xl bg-[#141620] border border-white/[0.06] flex items-center justify-center transition-transform duration-200 group-hover:scale-[1.02]">
          <span className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#FF6A00] tracking-wider select-none">
            {event.mockId}
          </span>
        </div>

        {/* Right: Event Information */}
        <div className="flex-1 flex flex-col justify-between py-0.5 gap-2.5">
          {/* Title & Description */}
          <div>
            <h3 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-white uppercase group-hover:text-zinc-100 transition-colors leading-tight">
              {event.title}
            </h3>
            <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1 line-clamp-2">
              {event.shortDescription}
            </p>
          </div>

          {/* Metadata: Venue, Highlighted Date, Time */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-300 font-sans">
            <span>{event.venue}</span>
            <span className="text-[#FF6A00] font-medium">{event.date}</span>
            <span className="text-zinc-400">{event.time}</span>
          </div>

          {/* Labels & Tags: Category, Participation, Flagship */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs pt-0.5">
            <span className="text-[#FF6A00] font-semibold tracking-wide">
              {event.category}
            </span>
            <span className="text-zinc-300 font-normal">
              {event.participationType}
            </span>
            {event.isFlagship && (
              <span className="text-[#FF6A00] font-semibold tracking-wider uppercase">
                FLAGSHIP / SAMPLE
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
