'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReduced) return;

    let ctx: gsap.Context | null = null;
    const rafId = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        // Synchronized horizontal stage arrival for dynamic page content (targets main so fixed viewport navbar stays rock-solid)
        const target = containerRef.current?.querySelector('main') || containerRef.current;
        if (!target) return;

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
    });

    return () => {
      cancelAnimationFrame(rafId);
      ctx?.revert();
    };
  }, []);

  return (
    <div
      id="page-transition-wrapper"
      ref={containerRef}
      className="w-full min-h-full flex-1 flex flex-col"
    >
      {children}
    </div>
  );
}
