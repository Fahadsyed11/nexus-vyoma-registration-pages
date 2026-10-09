'use client';

import React, { useRef } from 'react';
import FooterLogoReveal from './FooterLogoReveal';

export default function FooterSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <footer
      id="footer"
      ref={containerRef}
      className="relative w-full bg-transparent pt-16 sm:pt-24 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden z-20 select-none"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-between min-h-[55vh] gap-10 sm:gap-14">
        {/* Main Centerpiece: Monumental Outlined Logo with Magnetic Cursor Color Reveal */}
        <div id="footer-logo-anchor" className="w-full flex items-center justify-center my-auto">
          <FooterLogoReveal />
        </div>

        {/* Footer Meta & Information Bar - Clean Unboxed Horizontal Layout */}
        <div className="w-full pt-8 border-t border-white/[0.08] flex flex-row items-center justify-between gap-2 sm:gap-4 md:gap-8 text-left text-[11px] xs:text-xs sm:text-sm">
          {/* Left: Instagram Handle */}
          <div className="flex md:w-1/3 items-center justify-start">
            <a
              href="https://www.instagram.com/nexusvyoma?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 sm:gap-2 text-zinc-400 hover:text-white transition-colors duration-200 font-mono tracking-wide"
              aria-label="Nexus Vyoma Instagram Profile"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6A00] group-hover:text-[#FF207D] transition-colors duration-200 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
              </svg>
              <span className="truncate">@nexusvyoma</span>
            </a>
          </div>

          {/* Center: Venue Name */}
          <div className="flex md:w-1/3 items-center justify-center text-center">
            <div className="flex items-center justify-center gap-1 font-sans">
              <span className="hidden sm:inline text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-zinc-500">
                Venue:
              </span>
              <span className="font-semibold text-zinc-200 tracking-tight whitespace-nowrap">
                ISL Engineering College
              </span>
            </div>
          </div>

          {/* Right: Event Dates */}
          <div className="flex md:w-1/3 items-center justify-end text-right">
            <div className="flex items-center justify-end gap-1 font-mono text-zinc-300">
              <span className="hidden sm:inline text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500">
                Dates:
              </span>
              <span className="font-semibold text-zinc-200 tracking-wider whitespace-nowrap">
                <span className="sm:hidden">10, 11, 12 Nov</span>
                <span className="hidden sm:inline">10, 11, 12 November</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
