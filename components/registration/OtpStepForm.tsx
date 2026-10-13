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

  const handleVerify = async (submittedOtp?: string) => {
    const code = submittedOtp || otp;
    setError(null);
    setMessage(null);

    if (code.length < 6) {
      setError('Please enter all 6 digits of your verification code.');
      setStatus('error');
      return;
    }

    if (!email) {
      setError('Email address is missing. Please return and enter your email.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setStatus('success');
        setMessage(data?.message || 'OTP verified successfully!');
        const redirectUrl = data?.redirect_url || '/checkout';
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
        return;
      }

      setStatus('error');
      setError(data?.message || 'Invalid or expired OTP. Please try again.');
    } catch {
      setStatus('error');
      setError('Network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resending || loading) return;
    setError(null);
    setMessage(null);
    setResending(true);

    try {
      const res = await fetch('/api/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok || res.status === 429) {
        setMessage(data?.message || 'A new verification code has been sent to your email.');
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
      <div className="w-full rounded-2xl sm:rounded-3xl border border-white/[0.16] bg-[#07080c]/85 backdrop-blur-md p-5 sm:p-9 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.85)] flex flex-col gap-6 sm:gap-8">
        {/* Card Header: Rolling Text Heading */}
        <div className="w-full flex items-center justify-between">
          <RegistrationTitleRolling title="ENTER OTP" />

          {/* Email badge & edit link */}
          {email && (
            <Link
              href={`/check-email?email=${encodeURIComponent(email)}`}
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
              onChange={(code) => {
                setOtp(code);
                if (status === 'error') setStatus('idle');
                if (error) setError(null);
              }}
              onComplete={(code) => {
                handleVerify(code);
              }}
              status={status}
              disabled={loading}
              slotSize={isMobile ? 38 : 46}
              gap={isMobile ? 6 : 10}
              radius={isMobile ? 10 : 12}
              autoFocus
              className="select-none"
            />
          </div>

          {/* Wireframe sub-caption: Subtle helper / Resend trigger */}
          <div className="w-full flex items-center justify-between mt-3 text-xs font-mono text-zinc-500 px-1">
            <span>{email ? `Code sent to ${email}` : 'Enter the 6-digit code'}</span>
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || loading}
              className="text-zinc-400 hover:text-white transition-colors uppercase cursor-pointer disabled:opacity-40"
            >
              {resending ? 'RESENDING...' : 'RESEND OTP'}
            </button>
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
          disabled={loading || otp.length < 6}
          aria-label="Verify entered OTP"
          className="group relative inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/70 bg-transparent text-white font-mono text-xs sm:text-sm tracking-wider uppercase rounded-xl px-7 sm:px-9 py-2.5 sm:py-3 transition-all duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-1 focus-visible:ring-white select-none cursor-pointer"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>VERIFYING...</span>
            </>
          ) : (
            <span>Verify</span>
          )}
        </button>
      </div>
    </div>
  );
}
