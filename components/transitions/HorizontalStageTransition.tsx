'use client';

import React, { useRef, useEffect, createContext, useContext, useCallback } from 'react';
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
  const isTransitioningRef = useRef(false);

  const navigateWithTransition = useCallback(
    (href: string) => {
      if (isTransitioningRef.current) return;
      if (href === pathname || !stageRef.current) {
        router.push(href);
        return;
      }

      const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (isReduced) {
        router.push(href);
        return;
      }

      isTransitioningRef.current = true;

      // Enable pointer events during transition to prevent rapid clicking
      stageRef.current.style.pointerEvents = 'auto';

      // Barba Horizontal Slide — Leave phase: slide stage panel in from right to center FIRST
      gsap.fromTo(
        stageRef.current,
        { xPercent: 100 },
        {
          xPercent: 0,
          duration: 0.45,
          ease: 'power3.inOut',
          onComplete: () => {
            // ONLY navigate AFTER stage has fully covered the viewport
            router.push(href);
          },
        }
      );
    },
    [pathname, router]
  );

  // Global click listener to intercept internal route links
  useEffect(() => {
    const handleLinkClick = (e: MouseEvent) => {
      // Find nearest anchor tag
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
        // Stop Next.js synthetic router from executing prematurely
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

  // When pathname changes (after route push), play Barba Enter phase in parallel with new page
  useEffect(() => {
    if (!stageRef.current) return;

    if (isTransitioningRef.current) {
      gsap.to(stageRef.current, {
        xPercent: -100,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          if (stageRef.current) {
            gsap.set(stageRef.current, { xPercent: 100 });
            stageRef.current.style.pointerEvents = 'none';
          }
          isTransitioningRef.current = false;
        },
      });
    } else {
      // Direct initial load / once hook: ensure stage is parked off-screen right
      gsap.set(stageRef.current, { xPercent: 100 });
      stageRef.current.style.pointerEvents = 'none';
    }
  }, [pathname]);

  return (
    <div
      ref={stageRef}
      className="fixed inset-0 z-[9999] pointer-events-none select-none flex items-center justify-center will-change-transform shadow-[0_0_80px_rgba(255,106,0,0.3)]"
      style={{
        transform: 'translate3d(100%, 0, 0)',
        backgroundColor: '#05070d',
        backgroundImage:
          'radial-gradient(ellipse at 50% 50%, rgba(255, 106, 0, 0.12) 0%, rgba(10, 15, 30, 0.95) 70%, #030408 100%)',
        borderLeft: '2px solid rgba(255, 106, 0, 0.7)',
        borderRight: '2px solid rgba(255, 32, 125, 0.7)',
      }}
      aria-hidden="true"
    >
      {/* Dynamic leading edge glow streaks */}
      <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#FF6A00]/25 to-transparent pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#FF207D]/25 to-transparent pointer-events-none" />

      {/* Center ambient branding insignia */}
      <div className="flex flex-col items-center gap-3 opacity-90 scale-90 sm:scale-100">
        <span className="font-mono text-[11px] sm:text-xs tracking-[0.4em] uppercase text-zinc-400">
          NEXUS VYOMA
        </span>
        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#FF6A00] to-transparent" />
      </div>
    </div>
  );
}
