'use client';

import React from 'react';

interface GradientWaveMeshProps {
  className?: string;
}

/**
 * Volumetric Gradient Waves & Light Glows inspired directly by the Nexus Vyoma Poster.
 * Chromatic flow: Fiery Orange (#FF6A00) -> Crimson Red (#D8182B) -> Hot Magenta (#FF207D) -> Electric Blue (#0066FF).
 */
export default function GradientWaveMesh({ className = '' }: GradientWaveMeshProps) {
  return (
    <div
      className={`pointer-events-none fixed inset-0 w-full h-full overflow-hidden select-none -z-10 ${className}`}
      aria-hidden="true"
    >
      {/* 01 — Primary Flowing Gradient Wave Ribbon (SVG Curved Path with multi-stop chromatic fills) */}
      <svg
        className="absolute inset-0 w-full h-full preserve-3d"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ mixBlendMode: 'screen', opacity: 0.85 }}
      >
        <defs>
          {/* Main Chromatic Wave Gradient */}
          <linearGradient id="posterWaveGrad" x1="1200" y1="50" x2="200" y2="850" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.9" />
            <stop offset="28%" stopColor="#FF382E" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#D8182B" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#FF207D" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0066FF" stopOpacity="0.85" />
          </linearGradient>

          {/* Secondary Counter-Flow Gradient */}
          <linearGradient id="posterCounterWave" x1="100" y1="200" x2="1300" y2="750" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="0.7" />
            <stop offset="35%" stopColor="#7B2CFF" stopOpacity="0.6" />
            <stop offset="65%" stopColor="#FF207D" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#FF6A00" stopOpacity="0.8" />
          </linearGradient>

          {/* Deep Core Light Bloom Radial */}
          <radialGradient id="centerLightBloom" cx="50%" cy="45%" r="45%">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.28" />
            <stop offset="40%" stopColor="#D8182B" stopOpacity="0.16" />
            <stop offset="70%" stopColor="#0066FF" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#06080F" stopOpacity="0" />
          </radialGradient>

          {/* Upper Right Fiery Solar Core */}
          <radialGradient id="upperRightBloom" cx="82%" cy="18%" r="35%">
            <stop offset="0%" stopColor="#FF6A00" stopOpacity="0.32" />
            <stop offset="50%" stopColor="#FF207D" stopOpacity="0.14" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>

          {/* Lower Left Cyan-Blue Deep Core */}
          <radialGradient id="lowerLeftBloom" cx="15%" cy="82%" r="40%">
            <stop offset="0%" stopColor="#0066FF" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#7B2CFF" stopOpacity="0.15" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ambient Radial Bloom Orbs for Optical Depth */}
        <rect width="100%" height="100%" fill="url(#centerLightBloom)" />
        <rect width="100%" height="100%" fill="url(#upperRightBloom)" />
        <rect width="100%" height="100%" fill="url(#lowerLeftBloom)" />

        {/* Dynamic S-Curve Chromatic Fluid Wave 1 (Poster Dominant Sweep) */}
        <path
          d="M1350 -50 C1200 180 1050 320 820 380 C580 440 320 480 260 620 C200 760 380 880 750 920 C1080 955 1300 840 1480 780"
          stroke="url(#posterWaveGrad)"
          strokeWidth="110"
          strokeLinecap="round"
          filter="blur(55px)"
          opacity="0.8"
        />

        {/* Dynamic S-Curve Chromatic Fluid Wave 2 (Focal High-Intensity Core Ribbon) */}
        <path
          d="M1320 -20 C1180 200 1020 330 800 390 C560 450 340 500 290 640 C240 760 400 860 760 900"
          stroke="url(#posterWaveGrad)"
          strokeWidth="50"
          strokeLinecap="round"
          filter="blur(26px)"
          opacity="0.9"
        />

        {/* Secondary Cross Wave Sweep (Blue & Magenta Undercurrent) */}
        <path
          d="M-50 250 C220 280 460 380 680 520 C920 680 1150 720 1450 680"
          stroke="url(#posterCounterWave)"
          strokeWidth="70"
          strokeLinecap="round"
          filter="blur(48px)"
          opacity="0.65"
        />
      </svg>

      {/* 02 — Atmospheric Radial Glows positioned behind sections */}
      <div
        className="absolute top-[8%] right-[5%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 106, 0, 0.22) 0%, rgba(216, 24, 43, 0.08) 45%, transparent 70%)',
          filter: 'blur(70px)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="absolute top-[45%] left-[-5%] w-[520px] h-[520px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0, 102, 255, 0.24) 0%, rgba(255, 32, 125, 0.1) 50%, transparent 70%)',
          filter: 'blur(80px)',
          mixBlendMode: 'screen',
        }}
      />
      <div
        className="absolute bottom-[5%] right-[10%] w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255, 32, 125, 0.2) 0%, rgba(255, 106, 0, 0.12) 45%, transparent 70%)',
          filter: 'blur(85px)',
          mixBlendMode: 'screen',
        }}
      />

      {/* 03 — Subtle Diagonal Ambient Streaks */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.4) 0px, rgba(255, 255, 255, 0.4) 1px, transparent 1px, transparent 120px)',
        }}
      />
    </div>
  );
}
