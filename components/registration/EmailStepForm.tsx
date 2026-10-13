'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegistrationTitleRolling from './RegistrationTitleRolling';

interface EmailStepFormProps {
  initialEmail?: string;
}

export default function EmailStepForm({ initialEmail = '' }: EmailStepFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = email.trim();
    if (!trimmed) {
      setError('Please enter your email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setError('Please enter a valid email address (e.g. example@islec.edu.in).');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        // 200: OTP sent successfully
        try {
          localStorage.setItem('nv_otp_sent_time', String(Date.now()));
        } catch {
          // ignore localStorage error
        }
        router.push(`/register/verify-email?email=${encodeURIComponent(trimmed)}`);
        return;
      }

      if (res.status === 429) {
        // 429: OTP was already sent within 5 minutes, proceed to verify
        router.push(`/register/verify-email?email=${encodeURIComponent(trimmed)}&recent=1`);
        return;
      }

      if (res.status === 404) {
        setError(data?.message || 'Email not found in registered attendees. Please complete registration first.');
        return;
      }

      setError(data?.message || 'Failed to submit email. Please try again.');
    } catch {
      setError('Network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[520px] sm:max-w-[560px] mx-auto flex flex-col items-stretch">
      {/* 01 — Main Form Card Container (Matching wireframe's proportions and outline) */}
      <div className="relative isolate w-full p-5 sm:p-9 md:p-10 flex flex-col gap-6 sm:gap-8">
        {/* Translucent rounded glass backdrop with fiery ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-white/[0.08] hover:border-[#FF6A00]/30 bg-white/[0.035] shadow-[0_0_50px_rgba(255,106,0,0.14),inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-300"
          style={{
            backdropFilter: 'blur(10px) saturate(120%)',
            WebkitBackdropFilter: 'blur(10px) saturate(120%)',
            backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(255, 106, 0, 0.08) 0%, transparent 70%)',
          }}
        />
        {/* Card Header: Rolling Text Heading */}
        <div className="w-full flex items-center justify-between">
          <RegistrationTitleRolling title="ENTER EMAIL" />
        </div>

        {/* Form Body: Email Input */}
        <form id="email-form" onSubmit={handleSubmit} className="w-full flex flex-col gap-3">
          <div className="w-full relative">
            <input
              id="email-input"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Enter email: (example@islec.edu.in)"
              disabled={loading}
              autoComplete="email"
              autoFocus
              className="w-full bg-[#030407]/90 text-white placeholder-zinc-500 font-sans text-sm sm:text-base px-4 sm:px-5 py-3.5 sm:py-4 rounded-xl border border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 focus:shadow-[0_0_20px_rgba(255,106,0,0.35)] transition-all duration-200"
            />
          </div>

          {/* Validation / API Error Feedback */}
          {error && (
            <div
              className="text-xs sm:text-sm text-red-400 font-mono tracking-wide px-1 pt-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200"
              role="alert"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* 02 — Action Button Row (Aligned toward the right below the form container) */}
      <div className="w-full flex justify-end mt-4 sm:mt-5">
        <button
          type="submit"
          form="email-form"
          disabled={loading}
          aria-label="Send OTP verification code"
          className="group relative overflow-hidden inline-flex items-center justify-center gap-2 border border-[#FF6A00]/60 hover:border-[#FF6A00] bg-[#FF6A00]/10 text-white font-mono text-xs sm:text-sm tracking-wider uppercase rounded-xl px-7 sm:px-9 py-2.5 sm:py-3 shadow-[0_0_22px_rgba(255,106,0,0.22)] hover:shadow-[0_0_35px_rgba(255,106,0,0.5)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] select-none cursor-pointer motion-reduce:transition-none"
        >
          {/* Fill layer: slides up on hover/focus with Nexus Vyoma fiery energy */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#FF6A00] via-[#FF3B2E] to-[#D8182B] translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
          />
          <span className="relative z-10 inline-flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>SENDING...</span>
            </>
          ) : (
            <span>SEND OTP</span>
          )}
          </span>
        </button>
      </div>
    </div>
  );
}
