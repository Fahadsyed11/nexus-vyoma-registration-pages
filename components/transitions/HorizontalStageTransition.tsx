'use client';

import React, { useRef, useEffect, createContext, useContext, useCallback } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import gsap from 'gsap';

interface TransitionContextType {
  navigateWithTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextType>({
  navigateWithTransition: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

export default function HorizontalStageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const stageRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const glowRingRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);
  const safetyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const navigateWithTransition = useCallback(
    (href: string) => {
      if (isTransitioningRef.current) return;
      if (href === pathname) return;

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        router.push(href);
        return;
      }

      if (!stageRef.current) {
        router.push(href);
        return;
      }

      isTransitioningRef.current = true;

      // Ensure stage is mounted and visible
      stageRef.current.style.visibility = 'visible';
      stageRef.current.style.pointerEvents = 'auto';

      const pageWrapper = document.getElementById('page-transition-wrapper');

      // Create coordinated Barba Leave & Hold timeline
      const tl = gsap.timeline();

      // 1. Current screen moves to the right
      if (pageWrapper) {
        tl.to(
          pageWrapper,
          {
            x: '100vw',
            opacity: 0.2,
            duration: 0.45,
            ease: 'power3.in',
          },
          0
        );
      }

      // 2. Loading screen with logo appears
      tl.fromTo(
        stageRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        },
        0.2
      );

      // Logo entrance & breathing pulse
      if (logoBoxRef.current) {
        tl.fromTo(
          logoBoxRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.3,
            ease: 'back.out(1.5)',
          },
          0.3
        );

        // Breathing pulse during hold
        tl.to(
          logoBoxRef.current,
          {
            scale: 1.08,
            duration: 0.5,
            repeat: 1,
            yoyo: true,
            ease: 'sine.inOut',
          },
          0.6
        );
      }

      if (glowRingRef.current) {
        tl.fromTo(
          glowRingRef.current,
          { scale: 0.7, opacity: 0.3 },
          {
            scale: 1.3,
            opacity: 0.8,
            duration: 0.6,
            repeat: 1,
            yoyo: true,
            ease: 'sine.inOut',
          },
          0.4
        );
      }

      // 3. Screen appears for a second (~1.0s hold), then transition redirects to the next page
      tl.call(
        () => {
          router.push(href);
        },
        undefined,
        1.15 // ~1 second appearance
      );

      // Failsafe timeout in case route resolution hangs
      if (safetyTimeoutRef.current) clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = setTimeout(() => {
        if (stageRef.current && isTransitioningRef.current) {
          gsap.to(stageRef.current, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
              if (stageRef.current) {
                stageRef.current.style.visibility = 'hidden';
                stageRef.current.style.pointerEvents = 'none';
              }
              isTransitioningRef.current = false;
            },
          });
        }
      }, 5000);
    },
    [pathname, router]
  );

  // Global click listener to intercept internal route links
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore external, hash, mailto, tel, or target="_blank" links
      if (
        href.startsWith('http') ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        anchor.getAttribute('target') === '_blank' ||
        anchor.getAttribute('rel')?.includes('external') ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      ) {
        return;
      }

      if (href.startsWith('/')) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        navigateWithTransition(href);
      }
    };

    document.addEventListener('click', handleLinkClick, { capture: true });
    return () => {
      document.removeEventListener('click', handleLinkClick, { capture: true });
    };
  }, [navigateWithTransition]);

  // When pathname changes (after route redirect completes), smoothly transition loader out
  useEffect(() => {
    if (safetyTimeoutRef.current) {
      clearTimeout(safetyTimeoutRef.current);
      safetyTimeoutRef.current = null;
    }

    if (!stageRef.current) return;

    if (isTransitioningRef.current) {
      gsap.to(stageRef.current, {
        opacity: 0,
        duration: 0.4,
        ease: 'power2.out',
        onComplete: () => {
          if (stageRef.current) {
            stageRef.current.style.visibility = 'hidden';
            stageRef.current.style.pointerEvents = 'none';
          }
          isTransitioningRef.current = false;
        },
      });
    } else {
      // Direct load initial state
      gsap.set(stageRef.current, { opacity: 0 });
      stageRef.current.style.visibility = 'hidden';
      stageRef.current.style.pointerEvents = 'none';
    }
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ navigateWithTransition }}>
      {/* Intermediate Loading Stage Overlay */}
      <div
        ref={stageRef}
        className="fixed inset-0 z-[99999] pointer-events-none select-none flex flex-col items-center justify-center opacity-0 will-change-opacity"
        style={{
          visibility: 'hidden',
          backgroundColor: '#030408',
          backgroundImage:
            'radial-gradient(circle at 50% 50%, rgba(255, 106, 0, 0.12) 0%, rgba(5, 7, 13, 0.98) 55%, #000000 100%)',
        }}
        aria-hidden="true"
      >
        {/* Ambient Pulsing Glow behind the Logo */}
        <div
          ref={glowRingRef}
          className="absolute w-60 h-60 sm:w-72 sm:h-72 rounded-full pointer-events-none blur-3xl opacity-40 will-change-transform"
          style={{
            background:
              'radial-gradient(circle, rgba(255,106,0,0.6) 0%, rgba(255,32,125,0.25) 50%, transparent 75%)',
          }}
        />

        {/* Nexus Vyoma Logo Mark with prominent styling */}
        <div
          ref={logoBoxRef}
          className="relative flex flex-col items-center justify-center gap-3.5 z-10 will-change-transform"
        >
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center drop-shadow-[0_0_35px_rgba(255,106,0,0.75)]">
            <Image
              src="/brand/nexus-mark-no-background.png"
              alt="NEXUS VYOMA Logo"
              width={96}
              height={96}
              priority
              className="w-full h-full object-contain select-none filter contrast-125 brightness-110"
            />
          </div>

          <div className="flex flex-col items-center gap-1.5 mt-1">
            <span className="font-mono text-[10px] sm:text-xs tracking-[0.35em] uppercase text-zinc-400 font-medium">
              NEXUS VYOMA
            </span>
            <div className="w-12 h-[1.5px] bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent rounded-full" />
          </div>
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
