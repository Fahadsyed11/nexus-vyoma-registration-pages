'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) return;

      // Synchronized horizontal stage arrival for dynamic page content
      gsap.fromTo(
        containerRef.current,
        { x: 30, opacity: 0.92 },
        {
          x: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="w-full min-h-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
