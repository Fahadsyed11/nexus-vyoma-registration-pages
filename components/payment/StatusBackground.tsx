'use client';

import React from 'react';
import PatternWaves from '@/components/ui/PatternWaves';

interface StatusBackgroundProps {
  className?: string;
}

/**
 * Shared full-screen PatternWaves silk background for all transaction status pages.
 * Features pure black background, low-contrast restrained white silk waves,
 * edge fading, and interactive cursor ripples.
 */
export default function StatusBackground({ className = '' }: StatusBackgroundProps) {
  return (
    <div
      className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      <PatternWaves
        preset="silk"
        color="#FFFFFF"
        backgroundColor="#000000"
        fade="edges"
        interactive
        cursorSize={50}
        cursorStrength={0.6}
        opacity={0.38}
        contrast={0.85}
        speed={0.25}
        className="w-full h-full"
      />
      {/* Restrained dark backdrop gradient for maximum status card readability without killing wave texture */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(0,0,0,0.35)_0%,rgba(0,0,0,0.85)_100%)] pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
