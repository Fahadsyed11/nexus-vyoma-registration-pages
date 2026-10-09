'use client';

import React, { useRef } from 'react';
import Image from 'next/image';
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

        {/* Footer Meta & Information Bar */}
        <div className="w-full pt-8 border-t border-white/[0.08] flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8 text-center lg:text-left">
          {/* Venue & College Host */}
          <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            <div className="relative w-11 h-11 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src="/brand/isl-college-logo.png"
                alt="ISL Engineering College Logo"
                width={64}
                height={64}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-semibold">
                Venue
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                ISL Engineering College
              </span>
              <span className="text-[11px] text-zinc-400 font-normal">
                Hyderabad, Telangana
              </span>
            </div>
          </div>
      
          {/* Social Media Handle: Instagram */}
          <div className="flex items-center justify-center">
            <a
              href="https://www.instagram.com/nexusvyoma?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white transition-all duration-300 text-xs sm:text-sm font-mono tracking-wide shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
              aria-label="Nexus Vyoma Instagram Profile"
            >
              <svg
                className="w-4 h-4 text-[#FF6A00] group-hover:text-[#FF207D] transition-colors duration-200 flex-shrink-0"
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
              <span>@nexusvyoma</span>
            </a>
          </div>

          {/* Festival Dates */}
          <div className="flex items-center gap-3.5 px-4 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
            <div className="w-11 h-11 rounded-xl bg-black/60 border border-white/10 flex items-center justify-center flex-shrink-0 text-[#FF6A00]">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.75"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-mono tracking-widest text-zinc-500 font-semibold">
                Dates
              </span>
              <span className="text-xs sm:text-sm font-semibold text-white tracking-tight">
                <span className="hidden sm:inline">10, </span>11 <span className="hidden sm:inline">,</span> 12 <br /> November
              </span>

            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
