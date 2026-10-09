'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import SpecularButton from '@/components/ui/SpecularButton';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navCapsuleRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!navCapsuleRef.current) return;

      const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (isReducedMotion) {
        gsap.set(navCapsuleRef.current, { opacity: 1, y: 0, scale: 1, pointerEvents: 'auto' });
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
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3 sm:pt-5 pointer-events-none font-sans"
    >
      <div
        ref={navCapsuleRef}
        aria-label="Main Navigation"
        className="w-full max-w-4xl rounded-full relative transition-all duration-300 flex items-center justify-between px-5 sm:px-7 py-2.5 sm:py-3 border border-white/[0.14] overflow-hidden pointer-events-auto shadow-[0_25px_60px_-12px_rgba(0,0,0,0.95),0_10px_25px_-5px_rgba(0,0,0,0.85)]"
        style={{
          backgroundColor: 'rgba(5, 7, 14, 0.94)',
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
            className="h-5 sm:h-6 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            priority
          />
        </Link>

        {/* CENTER: Navigation Links */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8 z-10">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-xs sm:text-sm font-semibold text-zinc-100 hover:text-white transition-colors duration-200 relative group tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
            >
              <span>{link.label}</span>
              <span className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-gradient-to-r from-[#FF6A00] to-[#FF207D] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </Link>
          ))}
        </div>

        {/* RIGHT: SpecularButton CTA Action */}
        <div className="flex items-center gap-2.5 sm:gap-3 z-10 flex-shrink-0">
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
            onClick={() => router.push('/register')}
            className="!font-sans !text-[10px] xs:!text-[11px] sm:!text-xs !font-black !tracking-wider uppercase !py-2 !px-3.5 sm:!px-5 !rounded-full select-none"
          >
            <span>CLAIM YOUR PASS</span>
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white/90 flex-shrink-0"
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

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full bg-white/10 border border-white/15 text-white focus:outline-none"
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

      {/* Mobile Mirror Glass Drawer */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-x-4 top-16 pointer-events-auto rounded-3xl p-6 border border-white/10 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 font-sans"
          style={{
            backgroundColor: 'rgba(10, 15, 30, 0.95)',
            backdropFilter: 'blur(24px) saturate(180%)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
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
  );
}
