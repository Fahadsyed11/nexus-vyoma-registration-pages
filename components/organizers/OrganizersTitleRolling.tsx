'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

interface OrganizersTitleRollingProps {
  className?: string;
}

export default function OrganizersTitleRolling({
  className = '',
}: OrganizersTitleRollingProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const words = ['THE', 'ORGANIZERS'];

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const letters = containerRef.current.querySelectorAll('.rolling-letter');
      if (!letters.length) return;

      const isReducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (isReducedMotion) {
        gsap.set(letters, {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
        });
        return;
      }

      // Initial state: hidden below the baseline with a slight 3D rotation
      gsap.set(letters, {
        yPercent: 115,
        rotateX: -45,
        opacity: 0,
        transformOrigin: '50% 100%',
      });

      // 2-Cycle opening vertical rolling text reveal matching other pages
      const tl = gsap.timeline();

      // Cycle 1: Roll in from below
      tl.to(letters, {
        yPercent: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power2.out',
      })
        // Roll out upwards
        .to(
          letters,
          {
            yPercent: -115,
            rotateX: 45,
            opacity: 0,
            transformOrigin: '50% 0%',
            duration: 0.45,
            stagger: 0.02,
            ease: 'power2.in',
          },
          '+=0.1'
        )
        // Reset to bottom baseline instantly
        .set(letters, {
          yPercent: 115,
          rotateX: -45,
          opacity: 0,
          transformOrigin: '50% 100%',
        })
        // Cycle 2: Roll in from below at the exact same speed and lock in permanently
        .to(letters, {
          yPercent: 0,
          rotateX: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.03,
          ease: 'power2.out',
        });
    },
    { scope: containerRef }
  );

  return (
    <h1
      ref={containerRef}
      className={`font-[family-name:var(--font-display)] text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight sm:tracking-normal text-white uppercase select-none leading-none flex flex-wrap items-baseline gap-x-3 sm:gap-x-4 ${className}`}
      style={{ perspective: '800px' }}
      aria-label="THE ORGANIZERS"
    >
      {words.map((word, wordIdx) => (
        <span key={wordIdx} className="inline-flex items-baseline overflow-visible">
          {word.split('').map((char, charIdx) => (
            <span
              key={charIdx}
              className="inline-block overflow-hidden py-1"
              aria-hidden="true"
            >
              <span className="rolling-letter inline-block will-change-transform">
                {char}
              </span>
            </span>
          ))}
        </span>
      ))}
    </h1>
  );
}
