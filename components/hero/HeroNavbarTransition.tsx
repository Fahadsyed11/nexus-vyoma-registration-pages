'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import DriftWall from '@/components/ui/DriftWall';
import SpecularButton from '@/components/ui/SpecularButton';

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
  const backShadowRef = useRef<HTMLDivElement>(null);
  const whiteLayerRef = useRef<HTMLDivElement>(null);
  const colorMaskLayerRef = useRef<HTMLDivElement>(null);

  // Interactive Cursor-Follow Color Reveal Physics (Hero Logo)
  const coordsRef = useRef({ x: 0, y: 0, currentX: 0, currentY: 0, radius: 0, targetRadius: 0 });
  const rafRef = useRef<number | null>(null);

  const startLoop = () => {
    if (rafRef.current) return;

    const tick = () => {
      const coords = coordsRef.current;
      const k = 0.22;
      coords.currentX += (coords.x - coords.currentX) * k;
      coords.currentY += (coords.y - coords.currentY) * k;
      coords.radius += (coords.targetRadius - coords.radius) * 0.15;

      if (colorMaskLayerRef.current) {
        colorMaskLayerRef.current.style.setProperty('--cursor-x', `${coords.currentX}px`);
        colorMaskLayerRef.current.style.setProperty('--cursor-y', `${coords.currentY}px`);
        colorMaskLayerRef.current.style.setProperty('--reveal-radius', `${coords.radius}px`);
      }

      if (coords.radius > 0.5 || coords.targetRadius > 0) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!floatingLogoRef.current) return;
    const rect = floatingLogoRef.current.getBoundingClientRect();
    coordsRef.current.x = e.clientX - rect.left;
    coordsRef.current.y = e.clientY - rect.top;
    coordsRef.current.targetRadius = 240;
    startLoop();
  };

  const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!floatingLogoRef.current) return;
    const rect = floatingLogoRef.current.getBoundingClientRect();
    coordsRef.current.x = e.clientX - rect.left;
    coordsRef.current.y = e.clientY - rect.top;
    coordsRef.current.currentX = coordsRef.current.x;
    coordsRef.current.currentY = coordsRef.current.y;
    coordsRef.current.targetRadius = 240;
    startLoop();
  };

  const handlePointerLeave = () => {
    coordsRef.current.targetRadius = 0;
  };

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    let ctx: gsap.Context | null = null;

    const buildTimeline = () => {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (!floatingLogoRef.current || !navCapsuleRef.current || !heroContainerRef.current) {
          return;
        }

        // Reduced motion fallback: Keep navbar visible and interactive
        if (isReducedMotion) {
          gsap.set(navCapsuleRef.current, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' });
          return;
        }

        // Initial state of navbar capsule: hidden at top of viewport
        gsap.set(navCapsuleRef.current, {
          opacity: 0,
          y: -20,
          scale: 0.98,
          pointerEvents: 'none',
        });

        // Unified Master Hero ScrollTrigger timeline (Responsive across all screen sizes)
        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroContainerRef.current,
            start: 'top top',
            end: 'bottom 40%',
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        // Hero center logo smoothly dissolves and contracts as the hero scrolls away
        heroTl.to(
          floatingLogoRef.current,
          {
            opacity: 0,
            scale: 0.88,
            y: -30,
            ease: 'power1.out',
            duration: 0.5,
          },
          0
        );

        // Fixed mirror-glass navbar capsule glides in from the top
        heroTl.fromTo(
          navCapsuleRef.current,
          {
            opacity: 0,
            y: -20,
            scale: 0.98,
            pointerEvents: 'none',
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: 'auto',
            ease: 'power2.out',
            duration: 0.5,
          },
          0.2
        );

        // Clean footer exit transition: hide navbar when entering footer, restore when scrolling back
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
                scale: 0.98,
                pointerEvents: 'none',
                duration: 0.35,
                ease: 'power2.in',
                overwrite: 'auto',
              });
            },
            onLeaveBack: () => {
              const heroBottom = heroContainerRef.current?.getBoundingClientRect().bottom || 0;
              if (heroBottom <= window.innerHeight * 0.4) {
                gsap.to(navCapsuleRef.current, {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  pointerEvents: 'auto',
                  duration: 0.35,
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
    { label: 'Organizers', href: '/organizers' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ========================================================================= */}
      {/* 01 — Fixed iPhone Dark Mirror Glass Navbar */}
      {/* ========================================================================= */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center px-2.5 xs:px-4 pt-2.5 sm:pt-5 pointer-events-none font-sans">
        <div
          ref={navCapsuleRef}
          aria-label="Main Navigation"
          className="w-full max-w-4xl rounded-full relative flex items-center justify-between px-3 xs:px-4 sm:px-7 py-2 sm:py-2.5 md:py-3 border border-white/[0.14] overflow-hidden pointer-events-auto shadow-[0_25px_60px_-12px_rgba(0,0,0,0.95),0_10px_25px_-5px_rgba(0,0,0,0.85)] opacity-0"
          style={{
            backgroundColor: 'rgba(6, 8, 16, 0.30)',
            backdropFilter: 'blur(16px) saturate(180%)',
            WebkitBackdropFilter: 'blur(16px) saturate(180%)',
            boxShadow:
              '0 25px 60px -12px rgba(0, 0, 0, 0.95), 0 10px 25px -5px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
          }}
        >
          {/* Specular Top Reflection Highlight (iPhone Polished Mirror Glass effect) */}
          <div
            className="absolute inset-x-0 top-0 h-[40%] rounded-t-full pointer-events-none opacity-60"
            style={{
              background:
                'linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.02) 70%, transparent 100%)',
            }}
          />

          {/* LEFT: Target Slot Destination where the flying logo docks */}
          <Link
            href="/"
            aria-label="Nexus Vyoma Home"
            className="flex items-center gap-2 relative z-10 focus:outline-none group flex-shrink-0"
          >
            <div
              ref={navLogoSlotRef}
              className="flex items-center relative"
            >
              <Image
                src="/brand/nexus-wordmark-official.png"
                alt="Nexus Vyoma Logo"
                width={140}
                height={32}
                className="h-4.5 xs:h-5 sm:h-6 w-auto object-contain select-none transition-transform duration-200 group-hover:scale-105"
                priority
              />
            </div>
          </Link>

          {/* CENTER: Navigation Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 z-10">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-xs sm:text-[13px] font-display font-normal tracking-[0.08em] text-zinc-300 hover:text-white transition-colors duration-200 relative group"
              >
                <span>{link.label}</span>
                <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#FF6A00] to-[#FF207D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </Link>
            ))}
          </div>

          {/* RIGHT: SpecularButton CTA Action */}
          <div className="flex items-center gap-1.5 xs:gap-2.5 sm:gap-3 z-10 flex-shrink-0">
            <Link href="/register" className="inline-flex">
              <SpecularButton
                size="sm"
                radius={999}
                tint="#ffffff"
                tintOpacity={0.06}
                blur={10}
                textColor="#ffffff"
                lineColor="#ffffff"
                baseColor="#3a3a4c"
                intensity={1.2}
                shineSize={14}
                shineFade={40}
                thickness={1.1}
                speed={0.35}
                followMouse
                proximity={220}
                autoAnimate={false}
                className="!font-display !font-normal !text-[9px] xs:!text-[11px] sm:!text-xs !tracking-[0.14em] uppercase !py-1.5 xs:!py-2 !px-2.5 xs:!px-3.5 sm:!px-5 !rounded-full select-none cursor-pointer"
              >
                <span>CLAIM YOUR PASS</span>
                <svg
                  className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 text-white/90 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M7 17L17 7" />
                  <path d="M7 7h10v10" />
                </svg>
              </SpecularButton>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 xs:w-8 xs:h-8 rounded-full bg-white/10 border border-white/15 text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00] touch-manipulation cursor-pointer"
            >
              <span
                className={`w-3.5 h-0.5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-0.5'
                }`}
              />
              <span
                className={`w-3.5 h-0.5 bg-white transition-all duration-300 ${
                  mobileMenuOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Mirror Glass Drawer & Backdrop Overlay */}
        {mobileMenuOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm pointer-events-auto"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              className="md:hidden fixed inset-x-4 top-16 z-50 pointer-events-auto rounded-3xl p-6 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 font-sans"
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
                    className="px-4 py-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.08] text-sm font-display font-normal tracking-[0.08em] text-zinc-300 hover:text-white transition-all flex items-center justify-between"
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
          </>
        )}
      </header>

      {/* ========================================================================= */}
      {/* 02 — 3-Layer Hero Viewport (Gradient + DriftWall + Interactive Hero Logo) */}
      {/* ========================================================================= */}
      <section
        ref={heroContainerRef}
        className="relative min-h-screen min-h-[100svh] w-full flex items-center justify-center px-4 sm:px-8 bg-transparent overflow-hidden select-none"
      >
        {/* LAYER 1: Ambient Brand Mesh Gradient */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center">
          <div
            className="w-[50vw] sm:w-[28vw] max-w-[180px] sm:max-w-[320px] h-[5vh] sm:h-[10vh] max-h-[40px] sm:max-h-[90px] rounded-full opacity-15 sm:opacity-35 blur-[35px] sm:blur-[55px]"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255,106,0,0.6) 0%, rgba(255,32,125,0.3) 45%, rgba(123,44,255,0.1) 70%, transparent 100%)',
            }}
          />
        </div>

        {/* LAYER 2: React Bits DriftWall 3D Perspective Tile Wall */}
        <div className="absolute inset-0 z-10 pointer-events-none sm:pointer-events-auto">
          <DriftWall
            columns={7}
            tileWidth={180}
            tileHeight={120}
            gap={14}
            tilt={14}
            turn={-12}
            perspective={1200}
            depth={130}
            speed={36}
            direction="up"
            variance={0.45}
            parallax={0.5}
            lift={64}
            fade={0.35}
            dim={0.48}
            overlayColor="#04060e"
            grayscale={false}
          />
        </div>

        {/* LAYER 3: Hero Logo Anchor with Interactive Cursor Color Reveal Physics */}
        <div
          ref={heroLogoAnchorRef}
          className="w-[85vw] max-w-[280px] xs:max-w-[340px] sm:max-w-[480px] md:max-w-[620px] lg:max-w-[760px] aspect-[1024/341] flex items-center justify-center relative z-10 pointer-events-none"
        >
          <div
            ref={floatingLogoRef}
            onPointerMove={handlePointerMove}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            className="relative w-full h-full flex items-center justify-center pointer-events-auto select-none will-change-transform cursor-crosshair"
          >
            {/* Ambient Dark Back Shadow Elevation */}
            <div
              ref={backShadowRef}
              className="absolute inset-x-[-8%] inset-y-[-18%] rounded-full opacity-85 blur-2xl pointer-events-none -z-10"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.75) 45%, rgba(0, 0, 0, 0.35) 70%, transparent 100%)',
              }}
            />

            {/* Layer A: Solid Pure White Filled Logo with Back Shadow Elevation */}
            <div
              ref={whiteLayerRef}
              className="relative w-full h-full flex items-center justify-center pointer-events-none"
            >
              <Image
                src="/brand/nexus-wordmark-white.png"
                alt="Nexus Vyoma Logo White"
                width={1024}
                height={341}
                priority
                className="w-full h-full object-contain select-none filter drop-shadow-[0_4px_12px_rgba(0,0,0,1)] drop-shadow-[0_16px_35px_rgba(0,0,0,0.95)] drop-shadow-[0_0_2px_rgba(0,0,0,1)] drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]"
              />
            </div>

            {/* Layer B: Official Full-Color Logo Revealed by Cursor Mask */}
            <div
              ref={colorMaskLayerRef}
              className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
              style={
                {
                  '--cursor-x': '-9999px',
                  '--cursor-y': '-9999px',
                  '--reveal-radius': '0px',
                  maskImage:
                    'radial-gradient(circle var(--reveal-radius) at var(--cursor-x) var(--cursor-y), black 0%, black 40%, transparent 100%)',
                  WebkitMaskImage:
                    'radial-gradient(circle var(--reveal-radius) at var(--cursor-x) var(--cursor-y), black 0%, black 40%, transparent 100%)',
                } as React.CSSProperties
              }
            >
              <Image
                src="/brand/nexus-wordmark-official.png"
                alt="Nexus Vyoma Logo Color Reveal"
                width={1024}
                height={341}
                priority
                className="w-full h-full object-contain select-none drop-shadow-[0_0_45px_rgba(255,106,0,0.85)]"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
