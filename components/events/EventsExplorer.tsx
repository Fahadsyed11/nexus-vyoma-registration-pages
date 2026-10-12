'use client';

import React, { useState, useMemo } from 'react';
import { EVENTS_CATALOG, CatalogEvent } from '@/lib/data/eventsCatalog';
import EventCard from './EventCard';
import EventsTitleRolling from './EventsTitleRolling';

const DATES: ('10 November' | '11 November' | '12 November')[] = [
  '10 November',
  '11 November',
  '12 November',
];

const CATEGORIES: ('Competition' | 'Hackathon' | 'Talk' | 'Entertainment' | 'Workshop')[] = [
  'Competition',
  'Hackathon',
  'Talk',
  'Entertainment',
  'Workshop',
];

export default function EventsExplorer() {
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [flagshipOnly, setFlagshipOnly] = useState<boolean>(false);

  // Toggle date selection
  const handleToggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  // Toggle category selection
  const handleToggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSelectedDates([]);
    setSelectedCategories([]);
    setFlagshipOnly(false);
  };

  // Filter computation
  const filteredEvents = useMemo(() => {
    return EVENTS_CATALOG.filter((event: CatalogEvent) => {
      // Date filter
      if (selectedDates.length > 0 && !selectedDates.includes(event.date)) {
        return false;
      }

      // Category filter
      if (
        selectedCategories.length > 0 &&
        !selectedCategories.includes(event.category)
      ) {
        return false;
      }

      // Flagship filter
      if (flagshipOnly && !event.isFlagship) {
        return false;
      }

      return true;
    });
  }, [selectedDates, selectedCategories, flagshipOnly]);

  const hasActiveFilters =
    selectedDates.length > 0 || selectedCategories.length > 0 || flagshipOnly;

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
      {/* ============================================================ */}
      {/* LEFT COLUMN: Stationary Filter Panel                        */}
      {/* ============================================================ */}
      <aside className="lg:col-span-4 w-full flex flex-col gap-6 lg:sticky lg:top-24">
        {/* Title & Filter Subtitle */}
        <div>
          <EventsTitleRolling />
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mt-4">
            FILTER EVENTS
          </p>
        </div>

        {/* 1. DATE SECTION */}
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] font-bold tracking-wider text-zinc-300 uppercase">
            DATE
          </span>
          <div className="flex flex-col gap-2">
            {DATES.map((date) => {
              const isSelected = selectedDates.includes(date);
              return (
                <button
                  key={date}
                  type="button"
                  onClick={() => handleToggleDate(date)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00] flex items-center justify-between min-h-[44px] ${
                    isSelected
                      ? 'bg-[#FF6A00]/15 border border-[#FF6A00] text-white shadow-[0_0_15px_rgba(255,106,0,0.18)]'
                      : 'bg-[#12141c] border border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:text-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{date}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. CATEGORY SECTION */}
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] font-bold tracking-wider text-zinc-300 uppercase">
            CATEGORY
          </span>
          <div className="flex flex-col gap-2">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategories.includes(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleToggleCategory(category)}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00] flex items-center justify-between min-h-[44px] ${
                    isSelected
                      ? 'bg-[#FF6A00]/15 border border-[#FF6A00] text-white shadow-[0_0_15px_rgba(255,106,0,0.18)]'
                      : 'bg-[#12141c] border border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:text-white'
                  }`}
                  aria-pressed={isSelected}
                >
                  <span>{category}</span>
                  {isSelected && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. FLAGSHIP ONLY CHECKBOX */}
        <div className="pt-1">
          <label className="inline-flex items-center gap-3 cursor-pointer select-none group min-h-[44px]">
            <input
              type="checkbox"
              checked={flagshipOnly}
              onChange={(e) => setFlagshipOnly(e.target.checked)}
              className="sr-only"
            />
            <div
              className={`w-4 h-4 rounded flex items-center justify-center border transition-all duration-200 ${
                flagshipOnly
                  ? 'bg-[#FF6A00] border-[#FF6A00] text-black'
                  : 'bg-[#12141c] border-zinc-700 group-hover:border-zinc-500'
              }`}
            >
              {flagshipOnly && (
                <svg
                  className="w-3 h-3 text-black stroke-[3]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <span className="text-xs sm:text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
              Flagship only
            </span>
          </label>
        </div>

        {/* 4. CLEAR FILTERS BUTTON */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleClearFilters}
            className="border border-[#FF6A00] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-black font-bold uppercase rounded-lg px-4 py-2 min-h-[44px] flex items-center justify-center text-xs tracking-wider transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] cursor-pointer"
          >
            CLEAR FILTERS
          </button>
        </div>
      </aside>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: Independently Scrollable Event Listing          */}
      {/* ============================================================ */}
      <section
        aria-label="Events List"
        className="lg:col-span-8 w-full flex flex-col"
      >
        <div
          className="w-full flex flex-col gap-4 sm:gap-5 lg:overflow-y-auto lg:max-h-[620px] lg:pr-3 [scrollbar-width:thin] [scrollbar-color:#2a2d3d_transparent] focus:outline-none"
          tabIndex={0}
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="w-full min-h-[320px] rounded-2xl bg-[#0c0d13] border border-zinc-800 flex flex-col items-center justify-center p-8 text-center gap-4">
              <span className="font-display text-2xl text-zinc-400 uppercase tracking-wide">
                No Events Found
              </span>
              <p className="text-zinc-500 text-xs sm:text-sm max-w-sm">
                No events match the selected criteria. Try adjusting your date or category filters.
              </p>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="mt-2 border border-[#FF6A00] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-black font-semibold text-xs uppercase px-4 py-2 rounded-lg transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
