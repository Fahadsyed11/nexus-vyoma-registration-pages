'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

interface FooterLogoRevealProps {
  className?: string;
}

export default function FooterLogoReveal({ className = '' }: FooterLogoRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const coordsRef = useRef({ x: 0, y: 0, currentX: 0, currentY: 0, radius: 0, targetRadius: 0 });
  const rafRef = useRef<number | null>(null);

  const startLoop = useCallback(() => {
    if (rafRef.current) return;

    const tick = () => {
      const coords = coordsRef.current;
      const k = 0.2;
      coords.currentX += (coords.x - coords.currentX) * k;
      coords.currentY += (coords.y - coords.currentY) * k;
      coords.radius += (coords.targetRadius - coords.radius) * 0.14;

      if (containerRef.current) {
        containerRef.current.style.setProperty('--cursor-x', `${coords.currentX}px`);
        containerRef.current.style.setProperty('--cursor-y', `${coords.currentY}px`);
        containerRef.current.style.setProperty('--reveal-radius', `${coords.radius}px`);
      }

      if (coords.radius > 0.5 || coords.targetRadius > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    coordsRef.current.x = e.clientX - rect.left;
    coordsRef.current.y = e.clientY - rect.top;
    coordsRef.current.targetRadius = 240;
    startLoop();
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    coordsRef.current.x = e.clientX - rect.left;
    coordsRef.current.y = e.clientY - rect.top;
    coordsRef.current.currentX = coordsRef.current.x;
    coordsRef.current.currentY = coordsRef.current.y;
    coordsRef.current.targetRadius = 240;
    setIsHovered(true);
    startLoop();
  };

  const handlePointerLeave = () => {
    coordsRef.current.targetRadius = 0;
    setIsHovered(false);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full max-w-5xl mx-auto flex items-center justify-center select-none cursor-crosshair group py-10 sm:py-16 ${className}`}
      style={
        {
          '--cursor-x': '-9999px',
          '--cursor-y': '-9999px',
          '--reveal-radius': '0px',
        } as React.CSSProperties
      }
    >
      {/* Dynamic Cursor Spotlight Flare (Follows pointer) */}
      <div
        className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl opacity-35 transition-opacity duration-300"
        style={{
          left: 'var(--cursor-x)',
          top: 'var(--cursor-y)',
          background: 'radial-gradient(circle, rgba(255,106,0,0.6) 0%, rgba(255,32,125,0.3) 50%, transparent 80%)',
          opacity: isHovered ? 0.35 : 0,
        }}
      />

      {/* LAYER 1: EXACT HERO LOGO ASSET — CLEAN OUTLINE ONLY (Interior completely transparent) */}
      <div className="relative w-full flex items-center justify-center">
        <Image
          src="/brand/nexus-wordmark-outline.png"
          alt="Nexus Vyoma Logo Outline"
          width={1024}
          height={341}
          priority
          className="w-full h-auto max-w-4xl lg:max-w-5xl object-contain select-none pointer-events-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        />
      </div>

      {/* LAYER 2: EXACT HERO LOGO ASSET — VIBRANT ORIGINAL COLORS (Revealed strictly under cursor via radial mask) */}
      <div
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
        style={{
          maskImage:
            'radial-gradient(circle var(--reveal-radius) at var(--cursor-x) var(--cursor-y), black 0%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(circle var(--reveal-radius) at var(--cursor-x) var(--cursor-y), black 0%, black 40%, transparent 100%)',
        }}
      >
        <Image
          src="/brand/nexus-wordmark-official.png"
          alt="Nexus Vyoma Original Logo"
          width={1024}
          height={341}
          priority
          className="w-full h-auto max-w-4xl lg:max-w-5xl object-contain select-none drop-shadow-[0_0_40px_rgba(255,106,0,0.85)]"
        />
      </div>
    </div>
  );
}
