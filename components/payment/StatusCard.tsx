'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Copy,
  Check,
  ArrowRight,
} from 'lucide-react';

export type TransactionStatusType = 'success' | 'pending' | 'failed' | 'cancelled';

export interface StatusCardProps {
  status: TransactionStatusType;
  transactionId?: string;
  orderId?: string;
  teamName?: string;
  teamMembers?: string;
}

export default function StatusCard({
  status,
  transactionId = 'TXN_NV26_894120',
  orderId = 'ORD_NV26_54910',
  teamName,
  teamMembers,
}: StatusCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col items-center justify-center text-center px-4 select-none">
      {/* =========================================================================
          FAILED STATUS: Only the payment failed status and nothing else on screen
          ========================================================================= */}
      {status === 'failed' && (
        <>
          {/* Sign Icon with atmospheric glow backdrop */}
          <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
            <div
              className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-3xl pointer-events-none bg-red-500/25 shadow-[0_0_90px_30px_rgba(239,68,68,0.25)]"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-red-500/40 bg-black/40 backdrop-blur-md">
              <XCircle className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.25] text-red-400" />
            </div>
          </div>

          {/* Heading - Pure Typography (No capsule, no container) */}
          <h1 className="font-display uppercase text-4xl sm:text-5xl md:text-6xl tracking-wider text-white mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Payment Failed
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-mono text-xs sm:text-sm tracking-wider">
            <Link
              href="/register"
              className="text-zinc-400 hover:text-white underline underline-offset-8 transition-colors"
            >
              Try again &rarr;
            </Link>
            <span className="text-zinc-600 hidden sm:inline" aria-hidden="true">|</span>
            <Link
              href="/contact"
              className="text-[#FF6A00] hover:text-white underline underline-offset-8 transition-colors"
            >
              Contact Us Page &rarr;
            </Link>
          </div>
        </>
      )}

      {/* =========================================================================
          PENDING STATUS: Only Payment pending status and a link to Contact Us
          ========================================================================= */}
      {status === 'pending' && (
        <>
          {/* Alert Sign Icon with atmospheric glow backdrop */}
          <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
            <div
              className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-3xl pointer-events-none bg-amber-500/25 shadow-[0_0_90px_30px_rgba(245,158,11,0.25)]"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-amber-500/40 bg-black/40 backdrop-blur-md">
              <AlertTriangle className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.25] text-amber-400 animate-pulse" />
            </div>
          </div>

          {/* Heading - Pure Typography (No capsule, no container) */}
          <h1 className="font-display uppercase text-4xl sm:text-5xl md:text-6xl tracking-wider text-white mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Payment Pending
          </h1>

          {/* Link to Contact Us Page - Pure Typography */}
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm sm:text-base font-semibold text-[#FF6A00] hover:text-white underline underline-offset-8 transition-colors font-sans"
          >
            <span>Contact Us Page</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}

      {/* =========================================================================
          SUCCESS STATUS: Success payment status, Transaction ID, Order ID,
          Team details (if any), and NOTE that QR will be sent to email soon
          ========================================================================= */}
      {status === 'success' && (
        <>
          {/* Sign Icon with atmospheric emerald glow backdrop */}
          <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
            <div
              className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-3xl pointer-events-none bg-emerald-500/25 shadow-[0_0_90px_30px_rgba(16,185,129,0.25)]"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-emerald-500/40 bg-black/40 backdrop-blur-md">
              <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.25] text-emerald-400" />
            </div>
          </div>

          {/* Heading - Pure Typography (No capsule, no container) */}
          <h1 className="font-display uppercase text-4xl sm:text-5xl md:text-6xl tracking-wider text-white mb-5 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Payment Successful
          </h1>

          {/* Order Details: Transaction ID, Order ID, Team Details (Pure Typography, No capsules) */}
          <div className="flex flex-col items-center gap-2.5 sm:gap-3 mb-6 font-mono text-sm sm:text-base">
            {/* Transaction ID */}
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-500 uppercase tracking-wider text-xs sm:text-sm">Transaction ID:</span>
              <span className="text-white font-medium tracking-wide">{transactionId}</span>
              <button
                type="button"
                onClick={() => handleCopy(transactionId, 'txn')}
                className="ml-1 text-zinc-500 hover:text-white transition-colors"
                title="Copy Transaction ID"
                aria-label="Copy Transaction ID"
              >
                {copiedField === 'txn' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Order ID */}
            <div className="flex items-center gap-2 text-zinc-300">
              <span className="text-zinc-500 uppercase tracking-wider text-xs sm:text-sm">Order ID:</span>
              <span className="text-white font-medium tracking-wide">{orderId}</span>
              <button
                type="button"
                onClick={() => handleCopy(orderId, 'ord')}
                className="ml-1 text-zinc-500 hover:text-white transition-colors"
                title="Copy Order ID"
                aria-label="Copy Order ID"
              >
                {copiedField === 'ord' ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Team Details (if any) */}
            {teamName && (
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-500 uppercase tracking-wider text-xs sm:text-sm">Team:</span>
                <span className="text-white font-medium">{teamName}</span>
              </div>
            )}
            {teamMembers && (
              <div className="flex items-center gap-2 text-zinc-300">
                <span className="text-zinc-500 uppercase tracking-wider text-xs sm:text-sm">Members:</span>
                <span className="text-white font-medium">{teamMembers}</span>
              </div>
            )}
          </div>

          {/* NOTE: Pure Typography - No capsule, no container box */}
          <p className="text-xs sm:text-sm md:text-base font-mono text-emerald-400 tracking-wide mb-8 drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]">
            <span className="font-bold text-white">NOTE: </span>
            The QR code will be sent to your email soon
          </p>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full font-semibold text-sm text-black bg-[#FF6A00] hover:bg-[#ff7b1a] shadow-[0_0_30px_rgba(255,106,0,0.4)] transition-all duration-200 active:scale-[0.98]"
          >
            <span>Explore Events</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </>
      )}

      {/* =========================================================================
          CANCELLED STATUS: Minimal X icon + status
          ========================================================================= */}
      {status === 'cancelled' && (
        <>
          <div className="relative mb-6 sm:mb-8 flex items-center justify-center">
            <div
              className="absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full blur-3xl pointer-events-none bg-white/10 shadow-[0_0_80px_25px_rgba(255,255,255,0.1)]"
              aria-hidden="true"
            />
            <div className="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full border border-white/20 bg-black/40 backdrop-blur-md">
              <X className="w-12 h-12 sm:w-14 sm:h-14 stroke-[2.5] text-zinc-200" />
            </div>
          </div>

          <h1 className="font-display uppercase text-4xl sm:text-5xl md:text-6xl tracking-wider text-white mb-6 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
            Payment Cancelled
          </h1>

          <Link
            href="/register"
            className="text-xs sm:text-sm font-mono tracking-wider text-zinc-400 hover:text-white underline underline-offset-8 transition-colors"
          >
            Resume Registration &rarr;
          </Link>
        </>
      )}
    </div>
  );
}
