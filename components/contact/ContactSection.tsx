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
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  const instagramUrl =
    'https://www.instagram.com/nexusvyoma?utm_source=ig_web_button_share_sheet&rpxt=ZDNlZDc0MzIxNw==';

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errs.name = 'Please enter your name.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Please enter your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.message.trim()) {
      errs.message = 'Please enter your message.';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      // Truthful client submission status: backend delivery is not configured yet
      setSubmittedStatus(
        'Message delivery is not configured yet. Please email us directly at nexusvyoma@islec.edu.in.'
      );
    }
  };

  return (
    <div className="w-full max-w-[97vw] xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto rounded-3xl border border-white/[0.08] bg-[#07080c]/90 backdrop-blur-xl p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
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
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900/60 hover:border-white/20 transition-all duration-200"
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
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl border border-white/[0.08] bg-zinc-950/70 hover:bg-zinc-900/60 hover:border-white/20 transition-all duration-200"
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
                } px-4 py-3 sm:py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors`}
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
                  } px-4 py-3 sm:py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors`}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl bg-[#0c0d12] border border-white/[0.08] px-4 py-3 sm:py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors"
                />
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
                } px-4 py-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-400 transition-colors resize-none`}
              />
              {errors.message && (
                <p className="text-[11px] text-red-400 font-mono mt-1">{errors.message}</p>
              )}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ROW 2 — Action Row: Notice & SUBMIT Button (Under Message Box) */}
          {/* ========================================================================= */}
          <div className="hidden lg:block lg:col-span-5" />
          <div className="lg:col-span-7 pt-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="text-[#FF6A00] text-xs font-mono tracking-wide">
              Message delivery is not configured yet.
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto ml-auto px-8 py-3 rounded-xl bg-gradient-to-r from-[#FF5E00] to-[#E52020] hover:from-[#ff6a00] hover:to-[#ff207d] text-white font-bold tracking-wider text-xs sm:text-sm uppercase transition-all duration-200 shadow-md active:scale-95 cursor-pointer"
            >
              SUBMIT
            </button>
          </div>

          {submittedStatus && (
            <>
              <div className="hidden lg:block lg:col-span-5" />
              <div className="lg:col-span-7">
                <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-mono">
                  {submittedStatus}
                </div>
              </div>
            </>
          )}
        </div>
      </form>
    </div>
  );
}
