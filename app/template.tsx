'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    const ctx = gsap.context(() => {
      // Synchronized horizontal stage arrival for dynamic page content (targets main so fixed navbar stays rock-solid)
      const target = containerRef.current?.querySelector('main') || containerRef.current;

      gsap.fromTo(
        target,
        { x: 30, opacity: 0.92 },
        {
          x: 0,
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full min-h-full flex-1 flex flex-col">
      {children}
    </div>
  );
}
