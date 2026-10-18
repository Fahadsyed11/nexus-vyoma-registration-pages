'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';

/**
 * HomeInitialLoader
 * Initial full-screen loading presentation for the Home page:
 * 1. Deep black screen with hero section logo outline as the placeholder.
 * 2. True liquid water-wavy animation filling the official full-color logo matching the Hero section.
 * 3. Dynamic undulating sinusoidal waves via SVG clipPath with zero artificial stroke lines.
 * 4. Fading effect transition into the resting Hero section logo.
 * 5. Unmounts cleanly (display: null) and restores page scrollbar.
 */
export default function HomeInitialLoader() {
  const [isMounted, setIsMounted] = useState(true);
  const overlayRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const wavePathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable scrollbar while the initial loading screen is active
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Track water fill level: 0 (empty) to 1 (fully filled)
    const fillState = { progress: 0 };
    let phase = 0;
    let rafId: number | null = null;
    let isComplete = false;

    // Fluid wave generator function in objectBoundingBox coordinates (0..1)
    const updateWavePath = () => {
      if (!wavePathRef.current) return;

      if (isComplete) {
        // Fully filled: clean rectangular clip showing 100% of the logo
        wavePathRef.current.setAttribute('d', 'M 0 0 L 1 0 L 1 1.2 L 0 1.2 Z');
        return;
      }

      phase += 0.055;
      const progress = fillState.progress;
      // waterLevel moves from 1.06 (empty) down to -0.06 (fully filled)
      const waterLevel = 1.06 - progress * 1.12;

      // Dampen wave amplitude as water approaches the top to settle smoothly
      const amp1 = Math.max(0.005, 0.024 * (1 - progress * 0.45));
      const amp2 = Math.max(0.003, 0.012 * (1 - progress * 0.45));
      const freq1 = 2.4;
      const freq2 = 4.8;

      const segments = 24;
      let pathD = '';

      for (let i = 0; i <= segments; i++) {
        const x = i / segments;
        const wave =
          amp1 * Math.sin(2 * Math.PI * freq1 * x + phase) +
          amp2 * Math.cos(2 * Math.PI * freq2 * x - phase * 1.3);
        const y = Math.max(-0.02, Math.min(1.2, waterLevel + wave));

        if (i === 0) {
          pathD += `M 0 ${y.toFixed(4)}`;
        } else {
          pathD += ` L ${x.toFixed(4)} ${y.toFixed(4)}`;
        }
      }

      pathD += ' L 1 1.2 L 0 1.2 Z';
      wavePathRef.current.setAttribute('d', pathD);

      rafId = requestAnimationFrame(updateWavePath);
    };

    const ctx = gsap.context(() => {
      if (isReduced) {
        // Reduced motion: simple linear fade and exit
        const reducedTl = gsap.timeline({
          onComplete: () => {
            document.body.style.overflow = originalBodyOverflow;
            document.documentElement.style.overflow = originalHtmlOverflow;
            setIsMounted(false);
          },
        });

        reducedTl
          .to(fillState, {
            progress: 1,
            duration: 1.2,
            ease: 'power2.inOut',
            onUpdate: () => {
              if (wavePathRef.current) {
                const y = (1 - fillState.progress).toFixed(4);
                wavePathRef.current.setAttribute('d', `M 0 ${y} L 1 ${y} L 1 1.2 L 0 1.2 Z`);
              }
            },
          })
          .to(
            overlayRef.current,
            {
              opacity: 0,
              duration: 0.6,
              ease: 'power2.out',
            },
            '+=0.2'
          );

        return;
      }

      // Start continuous fluid wave physics loop
      rafId = requestAnimationFrame(updateWavePath);

      // Master Timeline: rising liquid wave level -> completion aura -> smooth fade-out
      const masterTl = gsap.timeline({
        onComplete: () => {
          if (rafId) cancelAnimationFrame(rafId);
          document.body.style.overflow = originalBodyOverflow;
          document.documentElement.style.overflow = originalHtmlOverflow;
          setIsMounted(false);
        },
      });

      // 1. Water filling animation (rises over 2.4s with smooth power2 easing)
      masterTl.to(fillState, {
        progress: 1,
        duration: 2.4,
        ease: 'power2.inOut',
        onComplete: () => {
          isComplete = true;
          if (wavePathRef.current) {
            wavePathRef.current.setAttribute('d', 'M 0 0 L 1 0 L 1 1.2 L 0 1.2 Z');
          }
        },
      });

      // 2. Subtle ambient flame glow aura upon 100% full water fill
      if (glowRef.current) {
        masterTl.fromTo(
          glowRef.current,
          { opacity: 0, scale: 0.96 },
          {
            opacity: 0.35,
            scale: 1.02,
            duration: 0.35,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1,
          },
          '-=0.15'
        );
      }

      // 3. Smooth fading effect transition into the resting hero page
      masterTl.to(
        overlayRef.current,
        {
          opacity: 0,
          duration: 0.75,
          ease: 'power2.inOut',
        },
        '+=0.1'
      );
    }, overlayRef);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      ctx.revert();
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-8 bg-black pointer-events-auto select-none overflow-hidden will-change-opacity"
      aria-label="Loading Nexus Vyoma"
      role="status"
    >
      {/* SVG ClipPath Definition with objectBoundingBox for True Liquid Wavy Masking */}
      <svg className="absolute w-0 h-0 overflow-hidden" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="hero-water-wave-clip" clipPathUnits="objectBoundingBox">
            <path
              ref={wavePathRef}
              d="M 0 1.1 L 1 1.1 L 1 1.2 L 0 1.2 Z"
            />
          </clipPath>
        </defs>
      </svg>

      {/* Exact Logo Container matching Hero section anchor position & dimensions */}
      <div
        ref={logoBoxRef}
        className="w-[85vw] max-w-[280px] xs:max-w-[340px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[760px] aspect-[1024/341] relative flex items-center justify-center overflow-visible"
      >
        {/* Layer 1: Outlined Logo Placeholder (Subtle silhouette before & during fill) */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
          <Image
            src="/brand/nexus-wordmark-outline.png"
            alt="Nexus Vyoma Logo Outline"
            width={1024}
            height={341}
            priority
            className="w-full h-full object-contain select-none opacity-40"
          />
        </div>

        {/* Layer 2: Pure White Logo (Liquid Wavy Water Fill) */}
        <div
          className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
          style={{
            clipPath: 'url(#hero-water-wave-clip)',
            WebkitClipPath: 'url(#hero-water-wave-clip)',
          }}
        >
          <Image
            src="/brand/nexus-wordmark-white.png"
            alt="Nexus Vyoma Logo White Fill"
            width={1024}
            height={341}
            priority
            className="w-full h-full object-contain select-none drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          />
        </div>

        {/* Subtle Ambient Completion White Aura */}
        <div
          ref={glowRef}
          className="absolute inset-[-15%] rounded-full opacity-0 pointer-events-none -z-10 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.05) 45%, transparent 70%)',
          }}
        />
      </div>

      {/* Screen Reader Progress Announcement */}
      <span className="sr-only">Loading Nexus Vyoma...</span>
    </div>
  );
}
