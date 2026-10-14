'use client';

import React from 'react';
import Navbar from '@/components/navbar/Navbar';
import FooterSection from '@/components/footer/FooterSection';
import StatusBackground from './StatusBackground';

interface StatusLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Common layout wrapper for transaction status pages (Success, Pending, Failed, Cancelled).
 * Integrates the shared PatternWaves background behind Navbar, Status Card, and Footer.
 */
export default function StatusLayout({ children, className = '' }: StatusLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#000000] text-white selection:bg-[#FF6A00] selection:text-white overflow-x-hidden">
      {/* 01 — Shared PatternWaves Silk Background (Canvas layer z-0) */}
      <StatusBackground />

      {/* 02 — Nexus Vyoma Mirror-Glass Fixed/Sticky Navbar (z-50) */}
      <Navbar alwaysVisible />

      {/* 03 — Main Centered Status Section (z-10) */}
      <main
        className={`flex-1 min-h-screen flex flex-col items-center justify-center w-full px-4 sm:px-6 pt-20 pb-12 z-10 ${className}`}
      >
        {children}
      </main>

      {/* 04 — Nexus Vyoma Cinematic Text-Stroke Footer (z-20) */}
      <FooterSection />
    </div>
  );
}
