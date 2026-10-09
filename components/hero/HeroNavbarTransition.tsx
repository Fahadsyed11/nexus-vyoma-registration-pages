'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function HeroNavbarTransition() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const heroContainerRef = useRef<HTMLElement>(null);
  const heroLogoAnchorRef = useRef<HTMLDivElement>(null);
  const navCapsuleRef = useRef<HTMLDivElement>(null);
  const navLogoSlotRef = useRef<HTMLDivElement>(null);
  const floatingLogoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const buildTimeline = () => {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (
          !heroLogoAnchorRef.current ||
          !navLogoSlotRef.current ||
          !floatingLogoRef.current ||
          !navCapsuleRef.current ||
          !heroContainerRef.current
        ) {
          return;
        }

        // Reduced motion fallback
        if (isReducedMotion) {
          gsap.set(navCapsuleRef.current, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' });
          gsap.set(floatingLogoRef.current, { opacity: 1 });
          return;
        }

        // Reset transforms temporarily to measure exact resting bounding rects
        gsap.set(navCapsuleRef.current, { clearProps: 'all' });
        gsap.set(floatingLogoRef.current, { clearProps: 'all' });

        const currentScrollY = window.scrollY || window.pageYOffset || 0;
        const currentScrollX = window.scrollX || window.pageXOffset || 0;

        const heroRect = heroLogoAnchorRef.current.getBoundingClientRect();
        const navRect = navLogoSlotRef.current.getBoundingClientRect();

        const startWidth = heroRect.width;
        const startHeight = heroRect.height;
        // True document top & left when scroll is 0
        const startLeft = heroRect.left + currentScrollX;
        const startTop = heroRect.top + currentScrollY;

        const endWidth = navRect.width;
        const endHeight = navRect.height;
        const endLeft = navRect.left;
        const endTop = navRect.top;

        const scaleRatio = endWidth / startWidth;
        const deltaX = endLeft - startLeft;
        // Align vertical centers between start position and docked navbar slot
        const startCenterY = startTop + startHeight / 2;
        const endCenterY = endTop + endHeight / 2;
        const deltaY = endCenterY - startCenterY;

        // Position floating logo over Hero anchor at scroll = 0
        gsap.set(floatingLogoRef.current, {
          position: 'fixed',
          top: startTop,
          left: startLeft,
          width: startWidth,
          height: startHeight,
          transformOrigin: 'left center',
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          visibility: 'visible',
          zIndex: 60,
        });

        // Initial state of navbar capsule: completely hidden and non-interactive
        gsap.set(navCapsuleRef.current, {
          opacity: 0,
          y: -20,
          scale: 0.96,
          pointerEvents: 'none',
        });

        // Master Hero ScrollTrigger timeline
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: 'bottom 25%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Continuous smooth trajectory for the logo
        heroTl.to(
          floatingLogoRef.current,
          {
            x: deltaX,
            y: deltaY,
            scale: scaleRatio,
            ease: 'power2.inOut',
            duration: 1,
          },
          0
        );

        // Synchronized iPhone Dark Mirror Glass Navbar materialization
        heroTl.fromTo(
          navCapsuleRef.current,
          {
            opacity: 0,
            y: -20,
            scale: 0.96,
            pointerEvents: 'none',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: 'auto',
            ease: 'power2.out',
            duration: 0.55,
          },
          0.45
        );

        // Reverse Transition: when approaching the footer, navbar glides out cleanly
        const footerEl = document.getElementById('footer');
        if (footerEl) {
          ScrollTrigger.create({
            trigger: footerEl,
            start: 'top 85%',
            end: 'bottom bottom',
            onEnter: () => {
              gsap.to(navCapsuleRef.current, {
                opacity: 0,
                y: -25,
                scale: 0.96,
                pointerEvents: 'none',
                duration: 0.4,
                ease: 'power2.in',
                overwrite: 'auto',
              });
              gsap.to(floatingLogoRef.current, {
                opacity: 0,
                y: deltaY + 40,
                duration: 0.4,
                ease: 'power2.in',
                overwrite: 'auto',
              });
            },
            onLeaveBack: () => {
              const heroBottom = heroContainerRef.current?.getBoundingClientRect().bottom || 0;
              // Re-reveal only if user has scrolled past hero
              if (heroBottom <= window.innerHeight * 0.35) {
                gsap.to(navCapsuleRef.current, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  pointerEvents: 'auto',
                  duration: 0.4,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
                gsap.to(floatingLogoRef.current, {
                  opacity: 1,
                  y: deltaY,
                  scale: scaleRatio,
                  duration: 0.4,
                  ease: 'power2.out',
                  overwrite: 'auto',
                });
              }
            },
          });
        }
      }, containerRef);
    };

    if (document.fonts) {
      document.fonts.ready.then(() => {
        buildTimeline();
      });
    }

    const initialTimer = setTimeout(() => {
      buildTimeline();
    }, 60);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        buildTimeline();
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(initialTimer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (ctx) ctx.revert();
    };
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Organizers', href: '/Organizers' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ========================================================================= */}
      {/* 01 — Fixed iPhone Dark Mirror Glass Navbar */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 sm:pt-5 pointer-events-none">
        <div
          ref={navCapsuleRef}
          aria-label="Main Navigation"
          className="w-full max-w-5xl rounded-full relative transition-all duration-300 flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 border border-white/[0.12] pointer-events-none"
          style={{
            backgroundColor: 'rgba(10, 15, 30, 0.84)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            boxShadow:
              '0 20px 40px -15px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
          }}
        > 
          {/* Specular Top Reflection Sheen */}
          <div
            className="absolute inset-x-5 top-0 h-[45%] rounded-t-full pointer-events-none opacity-75"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.02) 55%, transparent 100%)',
            }}
          />

          {/* LEFT: Target Slot Destination where the flying logo docks */}
          <Link
            href="/"
            aria-label="Nexus Vyoma Home"
            className="flex items-center relative z-10 focus:outline-none group"
          >
            <div
              ref={navLogoSlotRef}
              className="w-28 sm:w-36 md:w-40 h-6 sm:h-7 md:h-8 flex items-center relative"
            >
              {/* Target bounding box for measuring exact coordinates */}
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 z-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs lg:text-sm font-medium text-zinc-300 hover:text-white transition-colors duration-200 relative group tracking-wide font-sans"
              >
                <span>{link.label}</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-[#FF6A00] to-[#FF207D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          {/* RIGHT: Ticket Action CTA */}
          <div className="flex items-center gap-3 z-10">
            <Link
              href="/register"
              className="relative group overflow-hidden rounded-full p-[1px] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-[#FF6A00] via-[#FF382E] to-[#D8182B]" />
              <span className="relative flex items-center gap-1.5 px-4 sm:px-5 py-1.5 rounded-full bg-[#0A0F1E] hover:bg-[#0A0F1E]/80 text-white text-xs sm:text-sm font-bold tracking-wider uppercase transition-all duration-200 group-hover:shadow-[0_0_20px_rgba(255,106,0,0.6)] font-sans">
                <span>TICKET</span>
                <span className="text-[#FF6A00] transition-transform duration-200 group-hover:translate-x-0.5 font-bold">
                  →
                </span>
              </span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white focus:outline-none"
            >
              <span
                className={`w-3.5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                  }`}
              />
              <span
                className={`w-3.5 h-0.5 bg-white transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-0.5'
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Mirror Glass Drawer */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-x-4 top-16 pointer-events-auto rounded-3xl p-6 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 font-sans"
            style={{
              backgroundColor: 'rgba(10, 15, 30, 0.95)',
              backdropFilter: 'blur(24px) saturate(180%)',
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
            }}
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium text-zinc-200 hover:text-white transition-all flex items-center justify-between"
                >
                  <span>{link.label}</span>
                  <span className="text-[#FF6A00] text-xs">→</span>
                </Link>
              ))}
              <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span>ISL ENGINEERING COLLEGE</span>
                <span className="text-[#FF6A00]">HYDERABAD</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 02 — Single Continuous Transitioning Logo Actor */}
      {/* ========================================================================= */}
      <div
        ref={floatingLogoRef}
        className="fixed z-50 flex items-center justify-center pointer-events-none will-change-transform"
      >
        <Image
          src="/brand/nexus-wordmark-official.png"
          alt="Nexus Vyoma Logo"
          width={900}
          height={300}
          priority
          className="w-full h-full object-contain select-none filter drop-shadow-[0_15px_45px_rgba(0,0,0,0.85)]"
        />
      </div>

      {/* ========================================================================= */}
      {/* 03 — Ultra-Minimal Full-Screen Viewport Hero */}
      {/* ========================================================================= */}
      <section
        ref={heroContainerRef}
        className="relative min-h-screen min-h-[100svh] w-full flex items-center justify-center px-4 sm:px-8 bg-transparent overflow-hidden select-none"
      >
        {/* Center Target Anchor: ONLY the centered NEXUS VYOMA logo */}
        <div
          ref={heroLogoAnchorRef}
          className="w-full max-w-xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl h-28 sm:h-40 md:h-52 lg:h-64 flex items-center justify-center relative z-10"
        />
      </section>
    </div>
  );
}
