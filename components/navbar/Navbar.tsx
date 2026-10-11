'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SpecularButton from '@/components/ui/SpecularButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

interface NavbarProps {
  alwaysVisible?: boolean;
}

export default function Navbar({ alwaysVisible = false }: NavbarProps = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navCapsuleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!navCapsuleRef.current) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (alwaysVisible) {
        // Keep navbar firmly in place without jumping or vanishing during page navigation
        gsap.set(navCapsuleRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          pointerEvents: 'auto',
        });

        // Smooth seamless color & sheen transition from Home page atmosphere to Contact page
        if (!isReducedMotion) {
          gsap.fromTo(
            navCapsuleRef.current,
            {
              borderColor: 'rgba(255, 106, 0, 0.4)',
              boxShadow:
                '0 25px 60px -12px rgba(255, 106, 0, 0.18), 0 0 24px 2px rgba(255, 106, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.35)',
            },
            {
              borderColor: 'rgba(255, 255, 255, 0.14)',
              boxShadow:
                '0 25px 60px -12px rgba(0, 0, 0, 0.95), 0 10px 25px -5px rgba(0, 0, 0, 0.85), 0 0 1px 1px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.22)',
              duration: 0.65,
              ease: 'power2.out',
              clearProps: 'borderColor,boxShadow',
            }
          );
        }

        // Dissolve / glide out as the section finishes and user enters the footer
        const footerEl = document.getElementById('footer');
        if (footerEl) {
          ScrollTrigger.create({
            trigger: footerEl,
            start: 'top 30%',
            end: 'bottom bottom',
            onEnter: () => {
              gsap.to(navCapsuleRef.current, {
                opacity: 0,
                y: -25,
                scale: 0.96,
                pointerEvents: 'none',
                duration: 0.35,
                ease: 'power2.in',
                overwrite: 'auto',
              });
            },
            onLeaveBack: () => {
              gsap.to(navCapsuleRef.current, {
                opacity: 1,
                y: 0,
                scale: 1,
                pointerEvents: 'auto',
                duration: 0.35,
                ease: 'power2.out',
                overwrite: 'auto',
              });
            },
          });
        }

        // Ensure ScrollTrigger accurately measures the layout on route transition
        ScrollTrigger.refresh();
        return;
      }

      // Initial state: hidden in Hero
      gsap.set(navCapsuleRef.current, {
        opacity: 0,
        y: -24,
        scale: 0.96,
        pointerEvents: 'none',
      });

      // ScrollTrigger: Materialize when leaving Hero & approaching About section
      ScrollTrigger.create({
        start: 'top -380px',
        end: 'top -380px',
        onEnter: () => {
          gsap.to(navCapsuleRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            pointerEvents: 'auto',
            duration: 0.45,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        },
        onLeaveBack: () => {
          gsap.to(navCapsuleRef.current, {
            opacity: 0,
            y: -24,
            scale: 0.96,
            pointerEvents: 'none',
            duration: 0.35,
            ease: 'power2.in',
            overwrite: 'auto',
          });
        },
      });
    },
    { scope: navContainerRef }
  );

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Events', href: '/events' },
    { label: 'Organizers', href: '/Organizers' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <header
      ref={navContainerRef}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-2.5 xs:px-4 pt-2.5 sm:pt-5 pointer-events-none font-sans"
    >
      <div
        ref={navCapsuleRef}
        aria-label="Main Navigation"
        className="w-full max-w-4xl rounded-full relative flex items-center justify-between px-3 xs:px-4 sm:px-7 py-2 sm:py-2.5 md:py-3 border border-white/[0.14] overflow-hidden pointer-events-auto shadow-[0_25px_60px_-12px_rgba(0,0,0,0.95),0_10px_25px_-5px_rgba(0,0,0,0.85)]"
        style={{
          backgroundColor: 'rgba(6, 8, 16, 0.30)',
          backdropFilter: 'blur(36px) saturate(210%)',
          WebkitBackdropFilter: 'blur(36px) saturate(210%)',
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

        {/* LEFT: Official Nexus Vyoma Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 relative z-10 focus:outline-none group flex-shrink-0"
        >
          <Image
            src="/brand/nexus-wordmark-official.png"
            alt="Nexus Vyoma Logo"
            width={140}
            height={32}
            className="h-4.5 xs:h-5 sm:h-6 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        {/* CENTER: Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 z-10">
          {navLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== '/' && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-xs sm:text-sm font-semibold transition-colors duration-200 relative group tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] ${
                  isActive ? 'text-[#FF6A00]' : 'text-zinc-100 hover:text-white'
                }`}
              >
                <span>{link.label}</span>
                <span
                  className={`absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#FF6A00] to-[#FF207D] transition-transform duration-300 origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
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
              className="!font-sans !text-[9px] xs:!text-[11px] sm:!text-xs !font-black !tracking-wider uppercase !py-1.5 xs:!py-2 !px-2.5 xs:!px-3.5 sm:!px-5 !rounded-full select-none cursor-pointer"
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
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
          }}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 rounded-2xl transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-[#FF6A00]/15 text-[#FF6A00] font-semibold border border-[#FF6A00]/30'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-sm font-medium text-zinc-200 hover:text-white'
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-[#FF6A00] text-xs">→</span>
                </Link>
              );
            })}
            <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 font-mono">
              <span>ISL ENGINEERING COLLEGE</span>
              <span className="text-[#FF6A00]">HYDERABAD</span>
            </div>
          </div>
        </div>
        </>
      )}
    </header>
  );
}
