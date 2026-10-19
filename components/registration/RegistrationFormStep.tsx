'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as v from 'valibot';
import {
  registerUserFormDto,
  RegisterUserFormInput,
  RegisterUserFormOutput,
} from '@/dto/(register)/register-user.dto';
import RegistrationTitleRolling from './RegistrationTitleRolling';

interface RegistrationFormStepProps {
  verifiedEmail: string;
}

interface FormState {
  full_name: string;
  phone_number: string;
  email: string;
  institution: string;
  year_of_study: string;
  degree: string;
  state: string;
  city: string;
}

type FieldErrors = Partial<Record<keyof FormState, string>>;

const YEAR_OPTIONS = [
  { value: '1', label: 'First Year' },
  { value: '2', label: 'Second Year' },
  { value: '3', label: 'Third Year' },
  { value: '4', label: 'Fourth Year' },
  { value: '5', label: 'Fifth Year' },
  { value: '6', label: 'Sixth Year' },
];

export default function RegistrationFormStep({ verifiedEmail }: RegistrationFormStepProps) {
  const router = useRouter();

  const [formData, setFormData] = useState<FormState>({
    full_name: '',
    phone_number: '',
    email: verifiedEmail || '',
    institution: '',
    year_of_study: '',
    degree: '',
    state: '',
    city: '',
  });

  // Email is seeded from `verifiedEmail` in the initial state above.
  // The parent page passes `key={verifiedEmail}` so a new query param remounts
  // this component with fresh state (no setState-in-effect needed).

  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const handleChange = (field: keyof FormState, value: string) => {
    if (field === 'email' && verifiedEmail) return;

    setFormData((prev) => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const validateForm = (): { isValid: boolean; output?: RegisterUserFormOutput } => {
    const payload: RegisterUserFormInput = {
      ...formData,
      email: formData.email.trim() || verifiedEmail,
    };

    const result = v.safeParse(registerUserFormDto, payload);

    if (result.success) {
      setFieldErrors({});
      return { isValid: true, output: result.output };
    }

    const errors: FieldErrors = {};
    for (const issue of result.issues) {
      if (issue.path && issue.path.length > 0) {
        const fieldKey = issue.path[0].key as keyof FormState;
        if (!errors[fieldKey]) {
          errors[fieldKey] = issue.message;
        }
      }
    }
    setFieldErrors(errors);
    return { isValid: false };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    setServerSuccess(null);

    if (loading) return;

    const { isValid, output } = validateForm();
    if (!isValid || !output) return;

    setLoading(true);

    try {
      const res = await fetch('/api/registration/submit-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(output),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setServerSuccess(data?.message || 'Registration completed successfully! Redirecting...');
        const targetUrl =
          data?.redirectUrl ||
          data?.redirect_url ||
          `/register/check-email?email=${encodeURIComponent(output.email)}`;
        setTimeout(() => {
          router.push(targetUrl);
        }, 800);
        return;
      }

      // Handle user already registered case
      if (res.status === 400 && data?.message?.toLowerCase().includes('already registered')) {
        setServerError('This email is already registered. Redirecting to check email...');
        const redirectUrl =
          data?.redirectUrl ||
          `/register/check-email?email=${encodeURIComponent(output.email)}`;
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1200);
        return;
      }

      // Handle field-level validation errors from Valibot issues
      if (data?.error && Array.isArray(data.error)) {
        const serverFieldErrors: FieldErrors = {};
        for (const issue of data.error) {
          if (issue.path && issue.path.length > 0) {
            const fieldKey = issue.path[0].key as keyof FormState;
            serverFieldErrors[fieldKey] = issue.message;
          }
        }
        if (Object.keys(serverFieldErrors).length > 0) {
          setFieldErrors(serverFieldErrors);
        }
      }

      setServerError(data?.message || 'Failed to submit registration. Please check the fields below.');
    } catch {
      setServerError('Network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[680px] lg:max-w-[740px] mx-auto flex flex-col items-stretch">
      {/* 01 — Main Form Card Container */}
      <div className="relative isolate w-full p-5 sm:p-9 md:p-10 flex flex-col gap-8 group">
        {/* Translucent rounded glass backdrop with subtle fiery ambient glow */}
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
          className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-36 -z-10 bg-[#FF6A00]/12 blur-3xl rounded-full"
        />

        {/* Card Header: Rolling Text Heading */}
        <div className="w-full flex items-center justify-between">
          <RegistrationTitleRolling title="REGISTRATION" />
        </div>

        {/* Form Body: 3 Structured Sections */}
        <form id="registration-form" onSubmit={handleSubmit} noValidate className="w-full flex flex-col gap-8">
          {/* ========================================================
              SECTION 01: PERSONAL DETAILS
             ======================================================== */}
          <section className="w-full flex flex-col gap-4">
            <div className="border-b border-white/[0.08] pb-2">
              <RegistrationTitleRolling
                as="h2"
                title="01 — PERSONAL DETAILS"
                className="!text-sm sm:!text-base font-mono tracking-wider !text-zinc-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="full_name"
                  className="font-sans font-medium text-xs text-zinc-400 tracking-wider uppercase"
                >
                  Full Name
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => handleChange('full_name', e.target.value)}
                  placeholder="Full Name"
                  disabled={loading}
                  autoComplete="name"
                  aria-invalid={!!fieldErrors.full_name}
                  aria-describedby={fieldErrors.full_name ? 'full_name-error' : undefined}
                  className="w-full bg-[#030407]/90 text-white placeholder-zinc-500 font-sans text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 transition-all duration-200 disabled:opacity-60"
                />
                {fieldErrors.full_name && (
                  <p id="full_name-error" className="text-xs text-red-400 font-mono tracking-wide px-1">
                    {fieldErrors.full_name}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="phone_number"
                  className="font-sans font-medium text-xs text-zinc-400 tracking-wider uppercase"
                >
                  Phone Number
                </label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  inputMode="numeric"
                  value={formData.phone_number}
                  onChange={(e) => handleChange('phone_number', e.target.value)}
                  placeholder="10-digit Phone Number"
                  disabled={loading}
                  autoComplete="tel"
                  maxLength={10}
                  aria-invalid={!!fieldErrors.phone_number}
                  aria-describedby={fieldErrors.phone_number ? 'phone_number-error' : undefined}
                  className="w-full bg-[#030407]/90 text-white placeholder-zinc-500 font-sans text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 transition-all duration-200 disabled:opacity-60"
                />
                {fieldErrors.phone_number && (
                  <p id="phone_number-error" className="text-xs text-red-400 font-mono tracking-wide px-1">
                    {fieldErrors.phone_number}
                  </p>
                )}
              </div>
            </div>

            {/* Email Address (Prefilled and locked) */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="font-sans font-medium text-xs text-zinc-400 tracking-wider uppercase"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                readOnly={Boolean(verifiedEmail)}
                placeholder="Email Address"
                tabIndex={verifiedEmail ? -1 : 0}
                aria-readonly={Boolean(verifiedEmail)}
                className={`w-full font-sans text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border transition-all duration-200 ${
                  verifiedEmail
                    ? 'bg-[#030407]/60 text-zinc-300 placeholder-zinc-500 border-white/[0.12] cursor-not-allowed select-none'
                    : 'bg-[#030407]/90 text-white placeholder-zinc-500 border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50'
                }`}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-xs text-red-400 font-mono tracking-wide px-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>
          </section>

          {/* ========================================================
              SECTION 02: ACADEMIC DETAILS
             ======================================================== */}
          <section className="w-full flex flex-col gap-4">
            <div className="border-b border-white/[0.08] pb-2">
              <RegistrationTitleRolling
                as="h2"
                title="02 — ACADEMIC DETAILS"
                className="!text-sm sm:!text-base font-mono tracking-wider !text-zinc-300"
              />
            </div>

            {/* Institution */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="institution"
                className="font-sans font-medium text-xs text-zinc-400 tracking-wider uppercase"
              >
                Institution
              </label>
              <input
                id="institution"
                name="institution"
                type="text"
                value={formData.institution}
                onChange={(e) => handleChange('institution', e.target.value)}
                placeholder="Institution / College Name"
                disabled={loading}
                aria-invalid={!!fieldErrors.institution}
                aria-describedby={fieldErrors.institution ? 'institution-error' : undefined}
                className="w-full bg-[#030407]/90 text-white placeholder-zinc-500 font-sans text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 transition-all duration-200 disabled:opacity-60"
              />
              {fieldErrors.institution && (
                <p id="institution-error" className="text-xs text-red-400 font-mono tracking-wide px-1">
                  {fieldErrors.institution}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Year of Study */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="year_of_study"
                  className="font-sans font-medium text-xs text-zinc-400 tracking-wider uppercase"
                >
                  Year of Study
                </label>
                <div className="relative w-full">
                  <select
                    id="year_of_study"
                    name="year_of_study"
                    value={formData.year_of_study}
                    onChange={(e) => handleChange('year_of_study', e.target.value)}
                    disabled={loading}
                    aria-invalid={!!fieldErrors.year_of_study}
                    aria-describedby={fieldErrors.year_of_study ? 'year_of_study-error' : undefined}
                    className="w-full bg-[#030407]/90 text-white font-sans text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 transition-all duration-200 disabled:opacity-60 cursor-pointer appearance-none"
                  >
                    <option value="" disabled className="bg-zinc-950 text-zinc-500">
                      Select Year of Study
                    </option>
                    {YEAR_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                {fieldErrors.year_of_study && (
                  <p id="year_of_study-error" className="text-xs text-red-400 font-mono tracking-wide px-1">
                    {fieldErrors.year_of_study}
                  </p>
                )}
              </div>

              {/* Degree */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="degree"
                  className="font-sans font-medium text-xs text-zinc-400 tracking-wider uppercase"
                >
                  Degree
                </label>
                <input
                  id="degree"
                  name="degree"
                  type="text"
                  value={formData.degree}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  placeholder="Degree (e.g. B.Tech CSE)"
                  disabled={loading}
                  aria-invalid={!!fieldErrors.degree}
                  aria-describedby={fieldErrors.degree ? 'degree-error' : undefined}
                  className="w-full bg-[#030407]/90 text-white placeholder-zinc-500 font-sans text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 transition-all duration-200 disabled:opacity-60"
                />
                {fieldErrors.degree && (
                  <p id="degree-error" className="text-xs text-red-400 font-mono tracking-wide px-1">
                    {fieldErrors.degree}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ========================================================
              SECTION 03: LOCATION DETAILS
             ======================================================== */}
          <section className="w-full flex flex-col gap-4">
            <div className="border-b border-white/[0.08] pb-2">
              <RegistrationTitleRolling
                as="h2"
                title="03 — LOCATION DETAILS"
                className="!text-sm sm:!text-base font-mono tracking-wider !text-zinc-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* State */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="state"
                  className="font-sans font-medium text-xs text-zinc-400 tracking-wider uppercase"
                >
                  State
                </label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  placeholder="State"
                  disabled={loading}
                  aria-invalid={!!fieldErrors.state}
                  aria-describedby={fieldErrors.state ? 'state-error' : undefined}
                  className="w-full bg-[#030407]/90 text-white placeholder-zinc-500 font-sans text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 transition-all duration-200 disabled:opacity-60"
                />
                {fieldErrors.state && (
                  <p id="state-error" className="text-xs text-red-400 font-mono tracking-wide px-1">
                    {fieldErrors.state}
                  </p>
                )}
              </div>

              {/* City */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="city"
                  className="font-sans font-medium text-xs text-zinc-400 tracking-wider uppercase"
                >
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="City"
                  disabled={loading}
                  aria-invalid={!!fieldErrors.city}
                  aria-describedby={fieldErrors.city ? 'city-error' : undefined}
                  className="w-full bg-[#030407]/90 text-white placeholder-zinc-500 font-sans text-sm sm:text-base px-4 py-3 sm:py-3.5 rounded-xl border border-white/[0.18] focus:border-[#FF6A00] focus:outline-none focus:ring-2 focus:ring-[#FF6A00]/50 transition-all duration-200 disabled:opacity-60"
                />
                {fieldErrors.city && (
                  <p id="city-error" className="text-xs text-red-400 font-mono tracking-wide px-1">
                    {fieldErrors.city}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Feedback messages */}
          {serverSuccess && (
            <div
              className="text-xs sm:text-sm text-emerald-400 font-mono tracking-wide px-1"
              role="status"
            >
              {serverSuccess}
            </div>
          )}

          {serverError && (
            <div
              className="text-xs sm:text-sm text-red-400 font-mono tracking-wide px-1"
              role="alert"
            >
              {serverError}
            </div>
          )}
        </form>
      </div>

      {/* 02 — Action Button Row */}
      <div className="w-full flex justify-end mt-4 sm:mt-5">
        <button
          type="submit"
          form="registration-form"
          disabled={loading}
          aria-label="Complete registration"
          className="group relative overflow-hidden inline-flex items-center justify-center border border-[#FF6A00]/60 hover:border-[#FF6A00] bg-[#FF6A00]/10 text-white font-mono text-xs sm:text-sm tracking-wider uppercase rounded-xl px-7 sm:px-9 py-2.5 sm:py-3 shadow-[0_0_22px_rgba(255,106,0,0.22)] hover:shadow-[0_0_35px_rgba(255,106,0,0.5)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] select-none cursor-pointer motion-reduce:transition-none"
        >
          {/* Fill layer: slides up on hover/focus */}
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-[#FF6A00] via-[#FF3B2E] to-[#D8182B] translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0 transition-transform duration-300 ease-out motion-reduce:transition-none"
          />
          <span className="relative z-10 inline-flex items-center drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            {loading ? 'SUBMITTING...' : 'COMPLETE REGISTRATION'}
          </span>
        </button>
      </div>
    </div>
  );
}
