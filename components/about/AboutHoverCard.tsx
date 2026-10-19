'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export interface HoverCardData {
  badge: string;
  title: string;
  description: string;
  href: string;
  actionText: string;
}

interface AboutHoverCardProps {
  children: React.ReactNode;
  data: HoverCardData;
  highlightClassName?: string;
}

export default function AboutHoverCard({
  children,
  data,
  highlightClassName = '',
}: AboutHoverCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  // Close card when clicking outside on mobile/touch screens
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <span
      ref={containerRef}
      className="relative inline-block group/card cursor-pointer border-b border-[#FBB03B]/30 hover:border-[#FBB03B]/80 transition-colors"
      onClick={() => setIsOpen((prev) => !prev)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        } else if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
    >
      {/* Wrapped Words (Rendered with GSAP .word class from parent) */}
      <span className={highlightClassName}>{children}</span>

      {/* Floating Hover Card (ChaiUI + shadcn Warm Dark Styling) */}
      <span
        className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-[250px] sm:w-[280px] p-4 rounded-xl bg-[#0B0D17]/95 border border-white/10 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.85)] transition-all duration-200 ease-out z-50 text-left select-text ${
          isOpen
            ? 'opacity-100 pointer-events-auto translate-y-0 scale-100'
            : 'opacity-0 pointer-events-none translate-y-2 scale-95'
        }`}
        role="dialog"
        aria-label={data.title}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Top 1px Accent Hairline Glint */}
        <span
          className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#FBB03B]/40 to-transparent pointer-events-none rounded-t-xl"
          aria-hidden="true"
        />

        {/* Micro-Badge / Category Identifier */}
        <span className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-[family-name:var(--font-helvetica)] font-semibold tracking-wider uppercase text-[#FBB03B] bg-[#FBB03B]/10 border border-[#FBB03B]/20">
            {data.badge}
          </span>
        </span>

        {/* Card Title (02 Subheading Font: Helvetica) */}
        <span className="block font-[family-name:var(--font-helvetica)] text-sm font-bold text-white tracking-normal mb-1">
          {data.title}
        </span>

        {/* Description (03 UI Text Font: IBM Plex Sans) */}
        <span className="block font-[family-name:var(--font-ibm-plex)] text-xs text-zinc-300 font-normal leading-relaxed mb-3">
          {data.description}
        </span>

        {/* Action Link (03 UI Text Font: IBM Plex Sans) */}
        <Link
          href={data.href}
          className="inline-flex items-center gap-1.5 text-xs font-[family-name:var(--font-ibm-plex)] font-semibold text-orange-200 hover:text-white transition-colors group/link"
          onClick={() => setIsOpen(false)}
        >
          <span>{data.actionText}</span>
          <svg
            className="w-3.5 h-3.5 transition-transform duration-200 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 17L17 7M17 7H9M17 7V15"
            />
          </svg>
        </Link>

        {/* Little Pointer Arrow pointing to the highlighted word */}
        <span
          className="absolute left-1/2 -translate-x-1/2 top-full -mt-[1px] w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-[#0B0D17]/95"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
