'use client';

import React, { useState } from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import ContactTitleRolling from './ContactTitleRolling';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const instagramUrl =
    'https://www.instagram.com/nexusvyoma?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw==';

  const validate = () => {
    const errs: { [key: string]: string } = {};

    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      errs.name = 'Please enter your name.';
    } else if (trimmedName.length < 3) {
      errs.name = 'Name must be at least 3 characters.';
    } else if (trimmedName.length > 50) {
      errs.name = 'Name cannot exceed 50 characters.';
    }

    const trimmedEmail = formData.email.trim();
    if (!trimmedEmail) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errs.email = 'Please enter a valid email address.';
    }

    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (!cleanPhone) {
      errs.phone = 'Please enter your phone number.';
    } else if (cleanPhone.length !== 10) {
      errs.phone = 'Phone number must be exactly 10 digits.';
    }

    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage) {
      errs.message = 'Please enter your message.';
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length > 0) return;

    setIsSubmitting(true);
    try {
      const cleanPhone = formData.phone.trim().replace(/\D/g, '');
      const payload = {
        full_name: formData.name.trim(),
        phone_number: cleanPhone,
        email: formData.email.trim(),
        message: formData.message.trim(),
      };

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => null);

      if (res.status === 201) {
        setFeedback({
          type: 'success',
          message:
            result?.message || 'Thank you! Your message has been sent successfully.',
        });
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
      } else {
        // Handle validation issues from backend Valibot schema if present
        if (result?.error && Array.isArray(result.error)) {
          const apiErrors: { [key: string]: string } = {};
          for (const issue of result.error) {
            const field = issue?.path?.[0]?.key;
            if (field === 'full_name') apiErrors.name = issue.message || 'Invalid name';
            if (field === 'phone_number') apiErrors.phone = issue.message || 'Invalid phone number';
            if (field === 'email') apiErrors.email = issue.message || 'Invalid email';
            if (field === 'message') apiErrors.message = issue.message || 'Invalid message';
          }
          if (Object.keys(apiErrors).length > 0) {
            setErrors(apiErrors);
          }
        }

        setFeedback({
          type: 'error',
          message:
            result?.message ||
            (typeof result?.error === 'string'
              ? result.error
              : 'Failed to send message. Please review your input.'),
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-full xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto rounded-3xl border border-white/[0.08] bg-[#07080c]/90 backdrop-blur-xl p-5 xs:p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* ========================================================================= */}
          {/* ROW 1 — LEFT COLUMN: Large Heading & Interactive Contact Rows */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-8 lg:space-y-0">
            <div>
              <ContactTitleRolling />
            </div>

            <div className="space-y-3.5 sm:space-y-4">
              {/* EMAIL ROW */}
              <a
                href="mailto:nexusvyoma@islec.edu.in"
                className="group flex items-center justify-between p-3.5 sm:p-4 min-h-[44px] rounded-xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900/60 hover:border-white/20 transition-all duration-200"
                aria-label="Send email to nexusvyoma@islec.edu.in"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-zinc-400 group-hover:text-white transition-colors flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase leading-tight">
                      EMAIL
                    </span>
                    <span className="text-xs sm:text-sm font-sans text-zinc-200 group-hover:text-white transition-colors truncate">
                      nexusvyoma@islec.edu.in
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0 ml-2" />
              </a>

              {/* INSTAGRAM ROW */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 sm:p-4 min-h-[44px] rounded-xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900/60 hover:border-white/20 transition-all duration-200"
                aria-label="Visit Nexus Vyoma Instagram page"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04] text-zinc-400 group-hover:text-white transition-colors flex-shrink-0">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase leading-tight">
                      INSTAGRAM
                    </span>
                    <span className="text-xs sm:text-sm font-sans text-zinc-200 group-hover:text-white transition-colors truncate">
                      @nexusvyoma
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0 ml-2" />
              </a>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 1 — RIGHT COLUMN: Form Inputs (Dictates Row 1 height to bottom of Message) */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 space-y-4 sm:space-y-5">
            {/* 1. NAME */}
            <div className="space-y-1.5">
              <label
                htmlFor="name"
                className="block text-[11px] font-mono font-medium tracking-wider text-zinc-300 uppercase"
              >
                NAME
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full rounded-xl bg-[#0c0d12] border ${
                  errors.name ? 'border-red-500' : 'border-white/[0.08]'
                } px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors`}
              />
              {errors.name && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{errors.name}</p>
              )}
            </div>

            {/* 2. EMAIL & PH NO (Side-by-side on desktop, stacked on mobile) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-[11px] font-mono font-medium tracking-wider text-zinc-300 uppercase"
                >
                  EMAIL
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full rounded-xl bg-[#0c0d12] border ${
                    errors.email ? 'border-red-500' : 'border-white/[0.08]'
                  } px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors`}
                />
                {errors.email && (
                  <p className="text-[11px] text-red-400 font-mono mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-[11px] font-mono font-medium tracking-wider text-zinc-300 uppercase"
                >
                  PH NO
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData({ ...formData, phone: clean });
                  }}
                  className={`w-full rounded-xl bg-[#0c0d12] border ${
                    errors.phone ? 'border-red-500' : 'border-white/[0.08]'
                  } px-4 py-3 sm:py-3.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-400 font-mono mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* 3. MESSAGE */}
            <div className="space-y-1.5">
              <label
                htmlFor="message"
                className="block text-[11px] font-mono font-medium tracking-wider text-zinc-300 uppercase"
              >
                MESSAGE
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className={`w-full rounded-xl bg-[#0c0d12] border ${
                  errors.message ? 'border-red-500' : 'border-white/[0.08]'
                } px-4 py-3.5 text-base sm:text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors resize-none`}
              />
              {errors.message && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{errors.message}</p>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2 — Action Row: SUBMIT Button & Dynamic Feedback (Under Message Box) */}
          {/* ========================================================================= */}
          <div className="hidden lg:block lg:col-span-5" />
          <div className="lg:col-span-7 pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-zinc-500 text-xs font-mono tracking-wide">
              We usually respond within 24–48 hours.
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto ml-auto px-8 py-3.5 sm:py-3 min-h-[44px] rounded-xl bg-gradient-to-r from-[#FF5E00] to-[#E52020] hover:from-[#ff6a00] hover:to-[#ff207d] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-wider text-xs sm:text-sm uppercase transition-all duration-200 shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>SUBMITTING...</span>
                </>
              ) : (
                <span>SUBMIT</span>
              )}
            </button>
          </div>

          {feedback && (
            <>
              <div className="hidden lg:block lg:col-span-5" />
              <div className="lg:col-span-7">
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2.5 animate-in fade-in duration-200 ${
                    feedback.type === 'success'
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/30 bg-red-500/10 text-red-300'
                  }`}
                >
                  <span className="text-base select-none font-bold">
                    {feedback.type === 'success' ? '✓' : '⚠'}
                  </span>
                  <span>{feedback.message}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
