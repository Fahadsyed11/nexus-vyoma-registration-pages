'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  User,
  AlertCircle,
  Tag,
  Receipt,
  Users,
  RotateCcw,
} from 'lucide-react';
import SlideCommit from '@/components/ui/SlideCommit';
import RegistrationTitleRolling from '@/components/registration/RegistrationTitleRolling';

export interface PopulatedEvent {
  _id: string;
  title: string;
  entry_fee: number;
  venue?: string;
  date_time?: string;
  category?: string;
  short_description?: string;
  participants_type?: string;
}

export interface EnrolledTeamEventDoc {
  _id: string;
  team_name: string;
  team_emails: string[];
  team_leader_register_user_id?: string;
  team_length: number;
  event_id: PopulatedEvent;
  isPaid: boolean;
  reservation_time?: string;
}

export interface EnrolledIndividualEventDoc {
  _id: string;
  register_user_id?: string;
  event_id: PopulatedEvent;
  isPaid: boolean;
  reservation_time?: string;
}

export interface OrderSummaryUser {
  id?: string;
  name?: string;
  email: string;
  phone_number?: string;
  institution?: string;
  degree?: string;
}

export interface OrderSummaryResponseData {
  user: OrderSummaryUser;
  enrolledTeamEvents: EnrolledTeamEventDoc[];
  enrolledIndividualEvents: EnrolledIndividualEventDoc[];
  teamEventsAmount: number;
  individualEventsAmount: number;
}

interface CashfreeCheckoutResult {
  error?: { message?: string; code?: string };
  redirect?: boolean;
  paymentDetails?: unknown;
}

interface CashfreeInstance {
  checkout: (options: {
    paymentSessionId: string;
    redirectTarget?: '_modal' | '_self' | '_top';
  }) => Promise<CashfreeCheckoutResult>;
}

declare global {
  interface Window {
    Cashfree?: (options: { mode: 'sandbox' | 'production' }) => CashfreeInstance;
  }
}

async function loadCashfreeSDK(): Promise<CashfreeInstance> {
  const mode =
    process.env.NEXT_PUBLIC_CASHFREE_MODE === 'production' ? 'production' : 'sandbox';

  if (typeof window !== 'undefined' && window.Cashfree) {
    return window.Cashfree({ mode });
  }

  await new Promise<void>((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not available'));

    if (window.Cashfree) return resolve();

    const existing = document.querySelector('script[src*="cashfree.js"]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Cashfree SDK')));
      if (window.Cashfree) resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Cashfree SDK'));
    document.body.appendChild(script);
  });

  if (!window.Cashfree) {
    throw new Error('Cashfree SDK is not available');
  }

  return window.Cashfree({ mode });
}

export default function CheckoutEventView() {
  const router = useRouter();
  const [summaryData, setSummaryData] = useState<OrderSummaryResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedTeamRows, setExpandedTeamRows] = useState<Record<string, boolean>>({});

  const toggleTeamRow = (id: string) => {
    setExpandedTeamRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // -------------------------------------------------------------------------
  // 01 — Fetch order summary on page load via POST /api/checkout/order-summary
  // -------------------------------------------------------------------------
  const fetchOrderSummary = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/checkout/order-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resJson = await res.json().catch(() => null);

      if (resJson?.redirect && resJson?.redirectUrl) {
        router.push(resJson.redirectUrl);
        return;
      }

      if (!res.ok || !resJson?.data) {
        const errorMsg =
          resJson?.message || resJson?.error || 'Unable to prepare checkout summary.';
        setErrorMessage(errorMsg);
        return;
      }

      const data = resJson.data as OrderSummaryResponseData;
      const teamEvents = data.enrolledTeamEvents ?? [];
      const indEvents = data.enrolledIndividualEvents ?? [];

      // If both are empty, redirect to the enroll-event page
      if (teamEvents.length === 0 && indEvents.length === 0) {
        router.push('/register/enroll-event');
        return;
      }

      setSummaryData(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch order summary';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isCancelled = false;

    async function initializeCheckout() {
      try {
        const res = await fetch('/api/checkout/order-summary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const resJson = await res.json().catch(() => null);

        if (isCancelled) return;

        if (resJson?.redirect && resJson?.redirectUrl) {
          router.push(resJson.redirectUrl);
          return;
        }

        if (!res.ok || !resJson?.data) {
          const errorMsg =
            resJson?.message || resJson?.error || 'Unable to prepare checkout summary.';
          setErrorMessage(errorMsg);
          setIsLoading(false);
          return;
        }

        const data = resJson.data as OrderSummaryResponseData;
        const teamEvents = data.enrolledTeamEvents ?? [];
        const indEvents = data.enrolledIndividualEvents ?? [];

        // If both are empty, redirect to the enroll-event page
        if (teamEvents.length === 0 && indEvents.length === 0) {
          router.push('/register/enroll-event');
          return;
        }

        setSummaryData(data);
      } catch (err) {
        if (isCancelled) return;
        const msg = err instanceof Error ? err.message : 'Failed to fetch order summary';
        setErrorMessage(msg);
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    initializeCheckout();

    return () => {
      isCancelled = true;
    };
  }, [router]);

  // -------------------------------------------------------------------------
  // 02 — Compute Totals (Team fee is per participant: fee * team_length)
  // -------------------------------------------------------------------------
  const unpaidIndividualEvents = summaryData?.enrolledIndividualEvents ?? [];
  const unpaidTeamEvents = summaryData?.enrolledTeamEvents ?? [];
  const totalEventsCount = unpaidIndividualEvents.length + unpaidTeamEvents.length;

  const individualTotal =
    summaryData?.individualEventsAmount ??
    unpaidIndividualEvents.reduce((acc, ev) => acc + (Number(ev.event_id?.entry_fee) || 0), 0);

  const teamTotal =
    summaryData?.teamEventsAmount ??
    unpaidTeamEvents.reduce((acc, ev) => {
      const perHead = Number(ev.event_id?.entry_fee) || 0;
      const count = Number(ev.team_length) || 1;
      return acc + perHead * count;
    }, 0);

  const subtotal = individualTotal + teamTotal;
  const serviceFee = 30; // ₹30 Service charge
  const grandTotal = subtotal + serviceFee;

  // -------------------------------------------------------------------------
  // 03 — Cashfree Payment Submission (POST /api/payments/create-order)
  // -------------------------------------------------------------------------
  const handleConfirmPayment = async () => {
    if (isLocked || isProcessing) {
      return false;
    }

    setErrorMessage(null);

    if (totalEventsCount === 0) {
      const msg = 'No unpaid events available for checkout.';
      setErrorMessage(msg);
      throw new Error(msg);
    }

    // Permanently disable slider once slid so it cannot be slid again
    setIsLocked(true);
    setIsProcessing(true);

    try {
      // 1. Request Cashfree order session from server
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const resJson = await res.json().catch(() => null);

      // Handle redirect instructions
      if (resJson?.redirect && resJson?.redirectUrl) {
        router.push(resJson.redirectUrl);
        return false;
      }

      if (!res.ok || !resJson?.data?.payment_session_id) {
        const errorMsg =
          resJson?.message || resJson?.error || 'Unable to initiate payment. Please try again.';
        setErrorMessage(errorMsg);
        // Allow user to retry if server failed prior to gateway
        setIsLocked(false);
        throw new Error(errorMsg);
      }

      const paymentSessionId = resJson.data.payment_session_id as string;

      // 2. Initialize Cashfree v3 SDK
      const cashfree = await loadCashfreeSDK();

      // 3. Open Cashfree modal checkout popup
      const checkoutResult = await cashfree.checkout({
        paymentSessionId,
        redirectTarget: '_modal',
      });

      if (checkoutResult?.error) {
        const cancelMsg = checkoutResult.error.message || 'Payment was cancelled or failed.';
        setErrorMessage(cancelMsg);
        setIsLocked(false);
        throw new Error(cancelMsg);
      }

      if (checkoutResult?.paymentDetails) {
        router.push('/payment/success');
        return true;
      }

      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setErrorMessage(msg);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentDone = () => {
    router.push('/payment/success');
  };

  // -------------------------------------------------------------------------
  // 04 — Loading State
  // -------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-24 flex flex-col items-center justify-center gap-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#FF6A00] border-t-transparent animate-spin" />
        <p className="font-mono text-sm tracking-wider uppercase text-zinc-400">
          Preparing Checkout Summary...
        </p>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // 05 — Error / Empty State fallback
  // -------------------------------------------------------------------------
  if (!summaryData && errorMessage) {
    return (
      <div className="w-full max-w-xl mx-auto py-20 flex flex-col items-center justify-center gap-6 text-center">
        <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-bold font-display uppercase tracking-wider text-white">
            Unable to Load Checkout
          </h2>
          <p className="text-sm font-mono text-zinc-400 max-w-md">{errorMessage}</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchOrderSummary}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider bg-white/[0.08] hover:bg-white/[0.15] text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
          <Link
            href="/register/enroll-event"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider bg-[#FF6A00] text-black font-semibold hover:bg-[#ff7b1a] transition-colors"
          >
            <span>Back to Enrollment</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentUser = summaryData?.user;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 text-white pb-20">
      {/* 01 — Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <Link
          href="/register/enroll-event"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-[#FF6A00] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to enrollment</span>
        </Link>
      </div>

      {/* 02 — Main Page Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-[#FF6A00] uppercase">
          <span>Step 04 • Final Confirmation</span>
        </div>
        <RegistrationTitleRolling
          title="CHECKOUT EVENT"
          as="h1"
          className="text-3xl sm:text-4xl md:text-5xl font-display font-medium uppercase tracking-wider text-white"
        />
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl">
          Review your enrolled events, verify participant details, and slide to complete your registration checkout.
        </p>
      </div>

      {/* 03 — Participant Information Card (Entry Fees removed as all users are already paid) */}
      <section
        aria-labelledby="participant-info-heading"
        className="rounded-2xl border border-white/[0.1] bg-[#07090E]/90 p-5 sm:p-6 flex flex-col gap-4 backdrop-blur-md relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF6A00]/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#FF6A00]" />
            <h2 id="participant-info-heading" className="text-xs font-mono uppercase tracking-wider text-zinc-300 font-semibold">
              Participant Information
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Full Name</span>
            <span className="text-white font-medium text-sm truncate">
              {currentUser?.name || 'Attendee'}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Email Address</span>
            <span className="text-zinc-200 truncate">{currentUser?.email || ''}</span>
          </div>
          {currentUser?.phone_number && (
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Phone</span>
              <span className="text-zinc-200">{currentUser.phone_number}</span>
            </div>
          )}
          {currentUser?.institution && (
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Institution</span>
              <span className="text-zinc-200 truncate">{currentUser.institution}</span>
            </div>
          )}
          {currentUser?.degree && (
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Degree / Program</span>
              <span className="text-zinc-200 truncate">{currentUser.degree}</span>
            </div>
          )}
        </div>
      </section>

      {/* 04 — Enrolled Events (Unpaid) Section */}
      <section aria-labelledby="enrolled-events-heading" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#FF6A00]" />
            <h2 id="enrolled-events-heading" className="text-sm font-mono uppercase tracking-wider text-white font-semibold">
              Enrolled Events (Unpaid)
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">
            {totalEventsCount} {totalEventsCount === 1 ? 'event' : 'events'}
          </span>
        </div>

        {totalEventsCount === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/[0.12] p-8 text-center flex flex-col items-center justify-center gap-3 bg-[#07090E]/50">
            <AlertCircle className="w-8 h-8 text-zinc-500" />
            <p className="text-sm text-zinc-400 font-mono">No unpaid enrolled events found.</p>
            <Link
              href="/register/enroll-event"
              className="mt-2 text-xs font-mono uppercase tracking-wider text-[#FF6A00] hover:underline"
            >
              Go to event enrollment to select events →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Individual Events */}
            {unpaidIndividualEvents.map((ev) => {
              const eventDoc = ev.event_id;
              const fee = Number(eventDoc?.entry_fee) || 0;

              return (
                <div
                  key={ev._id}
                  className="rounded-2xl border border-white/[0.1] bg-[#0A0D16]/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-[#FF6A00]/40"
                >
                  <div className="flex flex-col gap-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/[0.08] text-zinc-300">
                        Individual
                      </span>
                      {eventDoc?.category && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#FF6A00]/15 text-[#FF8833] border border-[#FF6A00]/25">
                          {eventDoc.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-subheading font-medium text-base sm:text-lg text-white">
                      {eventDoc?.title || 'Individual Event'}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                      {eventDoc?.venue && (
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                          {eventDoc.venue}
                        </span>
                      )}
                      {eventDoc?.date_time && (
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                          {eventDoc.date_time}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="sm:text-right shrink-0 font-mono border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.08]">
                    <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">Entry Fee</span>
                    <span className="text-base sm:text-lg font-semibold text-emerald-400">
                      {fee > 0 ? `₹${fee}` : 'FREE'}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Team Events (Per participant fee: entry_fee * team_length) */}
            {unpaidTeamEvents.map((ev) => {
              const isExpanded = Boolean(expandedTeamRows[ev._id]);
              const eventDoc = ev.event_id;
              const perPersonFee = Number(eventDoc?.entry_fee) || 0;
              const teamLength = Number(ev.team_length) || (1 + (ev.team_emails?.length || 0));
              const totalTeamFee = perPersonFee * teamLength;
              const leaderEmail = currentUser?.email || 'Leader';

              return (
                <div
                  key={ev._id}
                  className="rounded-2xl border border-white/[0.1] bg-[#07090E] hover:border-white/[0.2] transition-colors overflow-hidden"
                >
                  {/* Collapsed Bar: Clickable Header */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleTeamRow(ev._id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleTeamRow(ev._id);
                      }
                    }}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 pr-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-mono text-[#FF6A00] tracking-widest uppercase font-semibold">
                          TEAM EVENT • {teamLength} PARTICIPANTS
                        </span>
                        <h3 className="font-subheading font-medium text-base sm:text-lg text-white">
                          {eventDoc?.title || 'Team Competition'}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          Team: {ev.team_name}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 min-w-0">
                        <span>{eventDoc?.venue || 'Venue TBA'}</span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        <span>{eventDoc?.date_time || 'Schedule TBA'}</span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        <div className="flex flex-col sm:items-end">
                          <span className="text-xs font-sans font-medium text-emerald-400">
                            {totalTeamFee > 0 ? `₹${totalTeamFee}` : 'FREE'}
                          </span>
                          <span className="text-[10px] text-zinc-500">
                            (₹{perPersonFee} × {teamLength})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Chevron Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTeamRow(ev._id);
                      }}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? `Collapse ${eventDoc?.title} details` : `Expand ${eventDoc?.title} details`}
                      className="shrink-0 p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] transition-colors"
                    >
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isExpanded ? 'rotate-180 text-[#FF6A00]' : 'text-zinc-400'
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  {/* Expanded Dropdown Panel */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none ${
                      isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-4 sm:p-5 pt-3 border-t border-white/[0.06] flex flex-col gap-3 font-mono text-xs">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-400">
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">TEAM: </span>
                            <span className="text-white font-medium">{ev.team_name}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">LEADER: </span>
                            <span className="text-white font-medium">{leaderEmail}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">SQUAD SIZE: </span>
                            <span className="text-white font-medium">{teamLength} members</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">FEE PER PARTICIPANT: </span>
                            <span className="text-emerald-400 font-sans font-medium">₹{perPersonFee}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">TOTAL TEAM FEE: </span>
                            <span className="text-emerald-400 font-sans font-medium">
                              ₹{totalTeamFee} ({teamLength} × ₹{perPersonFee})
                            </span>
                          </div>
                        </div>

                        {/* Members Event Fee Breakdown: Show each team member with amount they have to pay */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-[#FF6A00]" />
                              PARTICIPANT CHARGES:
                            </span>
                            <span className="text-zinc-400 text-[11px] font-mono">
                              ₹{perPersonFee} per member
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Leader */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                              <span className="text-[#FF6A00] font-semibold text-[11px]">LEADER:</span>
                              <span className="text-zinc-200">{leaderEmail}</span>
                              <span className="text-emerald-400 font-mono font-medium">₹{perPersonFee}</span>
                            </div>

                            {/* Other team members */}
                            {(ev.team_emails || []).map((email, mIdx) => (
                              <div
                                key={mIdx}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.08]"
                              >
                                <span className="text-zinc-400 font-semibold text-[11px]">
                                  MEMBER {mIdx + 1}:
                                </span>
                                <span className="text-zinc-200">{email}</span>
                                <span className="text-emerald-400 font-mono font-medium">₹{perPersonFee}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 05 — Order Summary Card */}
      <section
        aria-labelledby="order-summary-heading"
        className="rounded-2xl border border-white/[0.12] bg-[#07090E]/95 p-6 sm:p-7 flex flex-col gap-6 shadow-2xl relative"
      >
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-[#FF6A00]" />
            <h2 id="order-summary-heading" className="text-sm font-mono uppercase tracking-wider text-white font-semibold">
              Order Summary
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-400">All prices in INR (₹)</span>
        </div>

        {/* Pricing Hierarchy: Subtotal -> Event items -> Service Fee -> Total Amount */}
        <div className="flex flex-col gap-5 font-mono text-xs sm:text-sm">
          {/* Subtotal Section */}
          <div className="flex flex-col gap-3 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
              <span className="text-xs sm:text-sm font-display uppercase tracking-wider text-white font-semibold">
                Subtotal
              </span>
              <span className="text-zinc-200 font-semibold text-sm sm:text-base font-mono">
                ₹{subtotal}
              </span>
            </div>

            {/* Event Items inside Subtotal */}
            <div className="flex flex-col gap-2 pt-1 text-xs text-zinc-400">
              {unpaidIndividualEvents.map((ev) => (
                <div key={ev._id} className="flex items-center justify-between">
                  <span className="truncate pr-2 text-zinc-300">
                    {ev.event_id?.title || 'Individual Event'}{' '}
                    <span className="text-zinc-500">(Individual)</span>
                  </span>
                  <span className="text-emerald-400 font-medium shrink-0">
                    ₹{Number(ev.event_id?.entry_fee) || 0}
                  </span>
                </div>
              ))}

              {unpaidTeamEvents.map((t) => {
                const perPerson = Number(t.event_id?.entry_fee) || 0;
                const count = Number(t.team_length) || (1 + (t.team_emails?.length || 0));
                const teamPrice = perPerson * count;
                return (
                  <div key={t._id} className="flex items-center justify-between">
                    <span className="truncate pr-2 text-zinc-300">
                      {t.event_id?.title || 'Team Event'}{' '}
                      <span className="text-zinc-500">
                        ({t.team_name} • {count} {count === 1 ? 'participant' : 'participants'} × ₹{perPerson})
                      </span>
                    </span>
                    <span className="text-emerald-400 font-medium shrink-0">
                      ₹{teamPrice}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Service Fee Section */}
          <div className="flex flex-col gap-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs sm:text-sm font-display uppercase tracking-wider text-white font-semibold block">
                  Service Charge
                </span>
                <span className="text-[11px] text-zinc-500 font-sans">
                  Platform convenience & payment gateway processing fee
                </span>
              </div>
              <span className="text-zinc-200 font-semibold text-sm sm:text-base font-mono shrink-0">
                ₹{serviceFee}
              </span>
            </div>
          </div>

          {/* Final Total Amount Section */}
          <div className="rounded-xl bg-[#FF6A00]/10 border border-[#FF6A00]/25 p-4 flex items-center justify-between text-base sm:text-lg font-bold">
            <div>
              <span className="text-white uppercase tracking-wider font-display block">
                Total Amount
              </span>
              <span className="text-[11px] font-mono text-zinc-400 font-normal">
                Subtotal (₹{subtotal}) + Service (₹{serviceFee})
              </span>
            </div>
            <span className="text-[#FF6A00] text-2xl sm:text-3xl font-mono">
              ₹{grandTotal}
            </span>
          </div>
        </div>

        {/* Error Feedback Display */}
        {errorMessage && (
          <div
            className="text-xs text-red-400 font-mono tracking-wide px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        {/* 06 — Interactive Slide Commit Button */}
        <div className="pt-2 flex flex-col items-center justify-center gap-3">
          <SlideCommit
            width={340}
            height={56}
            label={isLocked ? 'Processing Checkout...' : `Slide to confirm ₹${grandTotal}`}
            doneLabel="Redirecting..."
            errorLabel="Checkout Failed"
            trackColor="#10131E"
            handleColor="#FF6A00"
            successColor="#22c55e"
            dangerColor="#e5484d"
            disabled={totalEventsCount === 0 || isProcessing || isLocked}
            onConfirm={handleConfirmPayment}
            onDone={handlePaymentDone}
            className="w-full max-w-[340px]"
          />
          <p className="text-[11px] font-mono text-zinc-500 tracking-wide text-center">
            {isLocked
              ? 'Payment initiated. Please complete the gateway transaction.'
              : 'Slide the handle to confirm your registration. Keyboard: use arrow keys or End.'}
          </p>
        </div>
      </section>
    </div>
  );
}
