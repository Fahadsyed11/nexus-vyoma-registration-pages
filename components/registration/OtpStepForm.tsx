'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import RegistrationTitleRolling from './RegistrationTitleRolling';
import CodeSlots, { CodeSlotsStatus } from './CodeSlots';

interface OtpStepFormProps {
  email: string;
}

export default function OtpStepForm({ email }: OtpStepFormProps) {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState<CodeSlotsStatus>('idle');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (submittedOtp?: string): Promise<boolean> => {
    const code = submittedOtp || otp;
    setError(null);
    setMessage(null);

    if (code.length < 6) {
      setError('Please enter all 6 digits of your verification code.');
      setStatus('error');
      return false;
    }

    if (!email) {
      setError('Email address is missing. Please return and enter your email.');
      return false;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/register/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setStatus('success');
        setMessage(data?.message || 'OTP verified successfully!');
        const redirectUrl = data?.redirect_url || '/register';
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
        return true;
      }

      setStatus('error');
      setError(data?.message || 'Invalid or expired OTP. Please try again.');
      return false;
    } catch {
      setStatus('error');
      setError('Network error occurred. Please check your connection and try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const [countdown, setCountdown] = useState<number>(300);

  // Initialize countdown from localStorage timestamp if available
  React.useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('nv_otp_sent_time');
        if (stored) {
          const elapsed = Math.floor((Date.now() - Number(stored)) / 1000);
          setCountdown(Math.max(0, 300 - elapsed));
        } else {
          localStorage.setItem('nv_otp_sent_time', String(Date.now()));
        }
      } catch {
        // ignore
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // 1-second interval tick-down
  React.useEffect(() => {
    if (countdown <= 0) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [countdown]);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleResend = async () => {
    if (countdown > 0 || resending || loading) return;
    setError(null);
    setMessage(null);
    setResending(true);

    try {
      const res = await fetch('/api/register/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setMessage(data?.message || 'A new verification code has been sent to your email.');
        try {
          localStorage.setItem('nv_otp_sent_time', String(Date.now()));
        } catch {
          // ignore localStorage error
        }
        setCountdown(300);
      } else if (res.status === 429) {
        setMessage(data?.message || 'Code was recently sent. Please check your inbox.');
        // Backend also enforces 5 minutes; retain current countdown
      } else {
        setError(data?.message || 'Failed to resend code. Please try again.');
      }
    } catch {
      setError('Network error while resending code.');
    } finally {
      setResending(false);
    }
  };

  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 500);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  return (
    <div className="w-full max-w-[520px] sm:max-w-[560px] mx-auto flex flex-col items-stretch">
      {/* 01 — Main Form Card Container (Matching wireframe's proportions and outline) */}
      <div className="relative isolate w-full p-5 sm:p-9 md:p-10 flex flex-col gap-6 sm:gap-8 group">
        {/* Translucent rounded glass backdrop behind the text and inputs with subtle fiery ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 rounded-3xl border border-white/[0.08] group-hover:border-[#FF6A00]/30 bg-white/[0.035] shadow-[0_0_50px_rgba(255,106,0,0.14),inset_0_1px_0_rgba(255,255,255,0.12)] transition-all duration-500"
          style={{
            backdropFilter: 'blur(10px) saturate(120%)',
            WebkitBackdropFilter: 'blur(10px) saturate(120%)',
          }}
        />
        {/* Subtle top ambient radial highlight for warmth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-32 -z-10 bg-[#FF6A00]/12 blur-3xl rounded-full"
        />

        {/* Card Header: Rolling Text Heading */}
        <div className="w-full flex items-center justify-between">
          <RegistrationTitleRolling title="ENTER OTP" />

          {/* Email badge & edit link */}
          {email && (
            <Link
              href={`/register/check-email?email=${encodeURIComponent(email)}`}
              className="font-mono text-[11px] sm:text-xs text-zinc-400 hover:text-white transition-colors underline underline-offset-4 tracking-wide"
              title="Change email"
            >
              EDIT EMAIL
            </Link>
          )}
        </div>

        {/* Form Body: Six React Bits Code Slots */}
        <div className="w-full flex flex-col items-center justify-center py-2 sm:py-4">
          <div className="w-full flex justify-center overflow-x-auto py-2">
            <CodeSlots
              length={6}
              value={otp}
              status={status}
              onChange={(code) => {
                setOtp(code);
                setStatus('idle');
                if (error) setError(null);
              }}
              onComplete={async (code) => {
                const ok = await handleVerify(code);
                setStatus(ok ? 'success' : 'error');
              }}
              accentColor="#f5f5f5"
              inkColor="#FF6A00"
              slotColor="#27272a"
              digitColor="#18181b"
              dangerColor="#ff3b30"
              slotSize={isMobile ? 38 : 44}
              gap={isMobile ? 6 : 8}
              radius={12}
              bounce={0.2}
              settle={0.3}
              rise={8}
              cascade={20}
              mask={false}
              caret
              outcome="accept"
              disabled={loading}
              autoFocus
              className="select-none"
            />
          </div>

          {/* Wireframe sub-caption: Subtle helper / Resend trigger with 5-minute timer */}
          <div className="w-full flex items-center justify-between mt-3 text-xs font-mono text-zinc-500 px-1">
            <span>{email ? `Code sent to ${email}` : 'Enter the 6-digit code'}</span>
            {countdown > 0 ? (
              <span className="text-zinc-500 tracking-wider flex items-center gap-1.5 tabular-nums">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6A00]/80 animate-pulse" />
                RESEND IN {formatCountdown(countdown)}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending || loading}
                className="text-[#FF6A00] hover:text-[#FF8833] underline underline-offset-4 transition-colors uppercase cursor-pointer disabled:opacity-40"
              >
                {resending ? 'RESENDING...' : 'RESEND OTP'}
              </button>
            )}
          </div>

          {/* Success Message Banner */}
          {message && (
            <div
              className="w-full mt-3 text-xs sm:text-sm text-emerald-400 font-mono tracking-wide px-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200"
              role="status"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>{message}</span>
            </div>
          )}

          {/* Error Message Banner */}
          {error && (
            <div
              className="w-full mt-3 text-xs sm:text-sm text-red-400 font-mono tracking-wide px-1 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200"
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
        </div>
      </div>

      {/* 02 — Action Button Row (Aligned toward the right below the form container) */}
      <div className="w-full flex justify-end mt-4 sm:mt-5">
        <button
          type="button"
          onClick={() => handleVerify()}
          disabled={loading}
          aria-label="Verify entered OTP"
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
              <span>VERIFYING...</span>
            </>
          ) : (
            <span>VERIFY</span>
          )}
          </span>
        </button>
      </div>
    </div>
  );
}
