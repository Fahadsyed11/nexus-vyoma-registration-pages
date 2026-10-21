'use client';

import React, { useState } from 'react';
import Image from 'next/image';

export interface OrganizerProfileProps {
  name: string;
  role?: string;
  title?: string;
  imageUrl?: string;
  size?: 'lg' | 'md' | 'sm';
  description?: string;
  socials?: {
    instagram?: string;
    linkedin?: string;
  };
  priority?: boolean;
  className?: string;
}

/** Check whether a social link is an actual URL and not "N / A" */
function isRealLink(url?: string): boolean {
  if (!url) return false;
  const s = url.trim();
  if (
    !s ||
    /^n\s*\/\s*a$/i.test(s) ||
    /^na$/i.test(s) ||
    /^none$/i.test(s) ||
    /^null$/i.test(s) ||
    /^undefined$/i.test(s)
  ) {
    return false;
  }
  return true;
}

export default function OrganizerProfile({
  name,
  role,
  title,
  imageUrl,
  size = 'md',
  description,
  socials,
  priority = false,
  className = '',
}: OrganizerProfileProps) {
  const [imgError, setImgError] = useState(false);

  // Subtitle prioritizes member title (e.g., "Chairman", "Dean Student Welfare"), falling back to role
  const subtitle = title || role;

  const hasInstagram = isRealLink(socials?.instagram);
  const hasLinkedin = isRealLink(socials?.linkedin);

  // Responsive sizing configurations
  const sizeConfig = {
    lg: {
      circle: 'w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36',
      container: 'w-36 sm:w-44 md:w-48',
      nameText: 'text-sm sm:text-base md:text-lg font-semibold',
      roleText: 'text-xs sm:text-sm text-zinc-400',
    },
    md: {
      circle: 'w-22 h-22 sm:w-26 sm:h-26 md:w-28 md:h-28',
      container: 'w-32 sm:w-36 md:w-40',
      nameText: 'text-xs sm:text-sm font-medium',
      roleText: 'text-[11px] sm:text-xs text-zinc-400',
    },
    sm: {
      circle: 'w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24',
      container: 'w-26 sm:w-28 md:w-32',
      nameText: 'text-[11px] sm:text-xs font-medium',
      roleText: 'text-[10px] sm:text-[11px] text-zinc-400',
    },
  }[size];

  const showImage = Boolean(imageUrl && !imgError);

  return (
    <div
      className={`group flex flex-col items-center text-center select-none ${sizeConfig.container} ${className}`}
      aria-label={description || `${name}${subtitle ? `, ${subtitle}` : ''}`}
    >
      {/* Perfectly circular portrait mask with slow, buttery smooth hover transition */}
      <div
        className={`relative ${sizeConfig.circle} rounded-full overflow-hidden border border-zinc-800 bg-[#0c0e14] transition-all duration-700 ease-out group-hover:border-zinc-300 group-hover:scale-[1.03] group-hover:shadow-[0_0_24px_rgba(255,106,0,0.22)] shadow-[0_4px_16px_rgba(0,0,0,0.6)] flex items-center justify-center`}
      >
        {showImage ? (
          <Image
            src={imageUrl!}
            alt={name}
            fill
            unoptimized
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setImgError(true)}
            sizes="(max-width: 768px) 140px, 180px"
            className="object-cover transition-all duration-700 ease-out group-hover:scale-105 [filter:grayscale(100%)_contrast(1.05)_brightness(0.95)] group-hover:[filter:grayscale(0%)_contrast(1)_brightness(1)]"
          />
        ) : (
          /* High-fidelity monochrome editorial portrait placeholder */
          <div
            className="w-full h-full flex flex-col items-center justify-end relative overflow-hidden"
            style={{
              background:
                'radial-gradient(circle at 50% 36%, #282c37 0%, #171a22 55%, #0b0c10 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/60 pointer-events-none" />
            <svg
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[82%] h-[82%] text-zinc-400/80 translate-y-1 transition-opacity duration-700 group-hover:text-zinc-300"
              aria-hidden="true"
            >
              <circle cx="50" cy="38" r="18" fill="currentColor" fillOpacity="0.45" />
              <circle cx="50" cy="38" r="18" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              <path d="M18 92 C18 68, 32 60, 50 60 C68 60, 82 68, 82 92 Z" fill="currentColor" fillOpacity="0.35" />
              <path d="M18 92 C18 68, 32 60, 50 60 C68 60, 82 68, 82 92" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* Profile Details: Name and below it, Title */}
      <div className="mt-3 flex flex-col items-center w-full px-1">
        <span
          className={`font-sans text-zinc-100 tracking-tight transition-colors duration-300 group-hover:text-white line-clamp-2 max-w-full ${sizeConfig.nameText}`}
        >
          {name}
        </span>
        {subtitle && (
          <span
            className={`font-sans tracking-normal mt-0.5 line-clamp-2 max-w-full ${sizeConfig.roleText}`}
          >
            {subtitle}
          </span>
        )}

        {/* Minimalist Social Links: Instagram & LinkedIn (only if real valid link, not "N / A") */}
        {(hasInstagram || hasLinkedin) && (
          <div className="mt-2 flex items-center justify-center gap-1.5 text-zinc-400">
            {hasInstagram && (
              <a
                href={socials!.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name}'s Instagram profile`}
                className="p-1.5 rounded-md text-zinc-400 hover:text-[#FF6A00] hover:bg-white/[0.06] transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00]"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
            )}
            {hasLinkedin && (
              <a
                href={socials!.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${name}'s LinkedIn profile`}
                className="p-1.5 rounded-md text-zinc-400 hover:text-[#0088FF] hover:bg-white/[0.06] transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#0088FF]"
              >
                <svg
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
