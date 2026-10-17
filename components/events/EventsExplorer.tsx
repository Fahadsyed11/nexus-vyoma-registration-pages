'use client';

import React, { useState, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { CatalogEvent } from '@/lib/data/eventsCatalog';
import EventCard from './EventCard';
import EventsTitleRolling from './EventsTitleRolling';

const DATES: ('10 November' | '11 November' | '12 November')[] = [
  '10 November',
  '11 November',
  '12 November',
];

interface EventsExplorerProps {
  events: CatalogEvent[];
}

export default function EventsExplorer({ events }: EventsExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [flagshipOnly, setFlagshipOnly] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  // Category options come straight from the event documents.
  const CATEGORIES = useMemo(
    () =>
      Array.from(new Set(events.map((e) => e.category).filter(Boolean))).sort(
        (a, b) => a.localeCompare(b)
      ),
    [events]
  );

  // The URL (?category=technical&category=gaming) is the single source of truth,
  // so a copied link always reproduces the same filtered list.
  const urlCategoryKey = searchParams.getAll('category').join('\u0000');
  const selectedCategories = useMemo(() => {
    const wanted = urlCategoryKey
      .split('\u0000')
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
    return CATEGORIES.filter((cat) => {
      const c = cat.toLowerCase();
      return wanted.some((w) => c === w || c.startsWith(w));
    });
  }, [urlCategoryKey, CATEGORIES]);

  const writeCategoriesToUrl = (next: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    next.forEach((c) => params.append('category', c.toLowerCase()));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  // Toggle date selection
  const handleToggleDate = (date: string) => {
    setSelectedDates((prev) =>
      prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
    );
  };

  // Toggle category selection (updates the URL)
  const handleToggleCategory = (category: string) => {
    writeCategoriesToUrl(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category]
    );
  };

  // Reset all filters
  const handleClearFilters = () => {
    setSelectedDates([]);
    setFlagshipOnly(false);
    writeCategoriesToUrl([]);
  };

  // Filter computation
  const filteredEvents = useMemo(() => {
    return events.filter((event: CatalogEvent) => {
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
  }, [events, selectedDates, selectedCategories, flagshipOnly]);

  const hasActiveFilters =
    selectedDates.length > 0 || selectedCategories.length > 0 || flagshipOnly;

  const activeFilterCount =
    selectedDates.length + selectedCategories.length + (flagshipOnly ? 1 : 0);

  // Reusable filter controls (rendered permanently on desktop, inside collapsible drawer on mobile)
  const renderFilterControls = (isMobile = false) => (
    <>
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
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00] flex items-center justify-between min-h-[44px] cursor-pointer ${
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
                className={`w-full text-left px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00] flex items-center justify-between min-h-[44px] cursor-pointer ${
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

      {/* 4. CLEAR FILTERS BUTTON (Desktop inline) */}
      {!isMobile && (
        <div className="pt-2">
          <button
            type="button"
            onClick={handleClearFilters}
            className="border border-[#FF6A00] text-[#FF6A00] hover:bg-[#FF6A00] hover:text-black font-bold uppercase rounded-lg px-4 py-2 min-h-[44px] flex items-center justify-center text-xs tracking-wider transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] cursor-pointer"
          >
            CLEAR FILTERS
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      {/* ============================================================ */}
      {/* MOBILE-ONLY HEADER: Title & Filter Toggle Trigger Button     */}
      {/* ============================================================ */}
      <div className="lg:hidden col-span-1 w-full flex flex-col gap-4">
        <EventsTitleRolling />

        {/* Mobile Filter Action Bar */}
        <div className="w-full flex items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((prev) => !prev)}
            aria-expanded={mobileFiltersOpen}
            aria-controls="mobile-filter-drawer"
            className={`inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] cursor-pointer min-h-[44px] ${
              mobileFiltersOpen || activeFilterCount > 0
                ? 'bg-[#FF6A00]/15 border-[#FF6A00] text-white shadow-[0_0_15px_rgba(255,106,0,0.2)]'
                : 'bg-[#12141c] border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:text-white'
            }`}
          >
            <svg
              className="w-4 h-4 text-[#FF6A00]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span>{mobileFiltersOpen ? 'Hide Filters' : 'Filter Events'}</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#FF6A00] text-black text-[11px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                mobileFiltersOpen ? 'rotate-180' : ''
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-xs font-mono font-semibold uppercase text-zinc-400 hover:text-[#FF6A00] transition-colors py-2 px-3 min-h-[44px] flex items-center"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Mobile Collapsible Filter Drawer */}
        {mobileFiltersOpen && (
          <div
            id="mobile-filter-drawer"
            className="w-full p-4 sm:p-5 rounded-2xl bg-[#0c0d16] border border-zinc-800/90 shadow-2xl flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="flex items-center justify-between pb-1 border-b border-zinc-800/60">
              <p className="font-mono text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
                FILTER OPTIONS
              </p>
              <span className="text-[11px] font-mono text-zinc-500">
                {filteredEvents.length} events matching
              </span>
            </div>

            {renderFilterControls(true)}

            {/* Mobile Bottom Action Bar */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClearFilters}
                disabled={!hasActiveFilters}
                className="text-xs font-mono font-semibold uppercase text-zinc-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed py-2 px-3 min-h-[44px]"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 max-w-[200px] bg-[#FF6A00] hover:bg-[#ff7b1a] text-black font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center min-h-[44px] cursor-pointer"
              >
                {filteredEvents.length > 0
                  ? `Show ${filteredEvents.length} Events`
                  : 'Close'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* DESKTOP-ONLY COLUMN: Stationary Filter Panel (Unchanged)     */}
      {/* ============================================================ */}
      <aside className="hidden lg:flex lg:col-span-4 w-full flex-col gap-6 lg:sticky lg:top-24">
        {/* Title & Filter Subtitle */}
        <div>
          <EventsTitleRolling />
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mt-4">
            FILTER EVENTS
          </p>
        </div>

        {renderFilterControls(false)}
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
