'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';
import SlideCommit from '@/components/ui/SlideCommit';
import RegistrationTitleRolling from '@/components/registration/RegistrationTitleRolling';

export interface UnpaidIndividualEvent {
  _id: string;
  event_id: string;
  event_title: string;
  entry_fee: number;
  venue?: string;
  date_time?: string;
  category?: string;
  participation_type: 'individual';
}

export interface UnpaidTeamEvent {
  _id: string;
  event_id: string;
  event_title: string;
  entry_fee: number;
  venue?: string;
  date_time?: string;
  category?: string;
  short_description?: string;
  participation_type: 'team';
  team_name: string;
  team_leader_email?: string;
  team_size: number;
  team_members: string[];
  /** Entry-ticket charge per other member (from order-summary API). */
  memberEntryTickets?: {
    email: string;
    entryTicketPrice: number;
    isRegistered: boolean;
    requiresRegistration: boolean;
  }[];
}

export interface CheckoutEventViewProps {
  userName: string;
  userEmail: string;
  userPhone?: string;
  userInstitution?: string;
  userDegree?: string;
  userProfileImage?: string;
  unpaidIndividualEvents: UnpaidIndividualEvent[];
  unpaidTeamEvents: UnpaidTeamEvent[];
  /** Entry-ticket status for the current user (from order-summary API). */
  entryTicketDetails: { isPurchased: boolean; price: number };
  /** Server-authoritative pricing — never recompute totals on the client. */
  serverPricing: {
    totalTeamEventsPrice: number;
    totalIndividualEventsPrice: number;
    totalEntryTicketPrice: number;
    grandTotal: number;
  };
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

export default function CheckoutEventView({
  userName,
  userEmail,
  userPhone,
  userInstitution,
  userDegree,
  unpaidIndividualEvents,
  unpaidTeamEvents,
  entryTicketDetails,
  serverPricing,
}: CheckoutEventViewProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedTeamRows, setExpandedTeamRows] = useState<Record<string, boolean>>({});

  const toggleTeamRow = (id: string) => {
    setExpandedTeamRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Server is the source of truth — client never recomputes amounts
  const individualTotal   = serverPricing.totalIndividualEventsPrice;
  const teamTotal         = serverPricing.totalTeamEventsPrice;
  const entryTicketTotal  = serverPricing.totalEntryTicketPrice;
  const total             = serverPricing.grandTotal;
  const subtotal          = individualTotal + teamTotal;

  const totalEventsCount = unpaidIndividualEvents.length + unpaidTeamEvents.length;

  const handleConfirmPayment = async () => {
    setErrorMessage(null);

    if (totalEventsCount === 0) {
      const msg = 'No unpaid events available for checkout.';
      setErrorMessage(msg);
      throw new Error(msg);
    }

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

      // Handle redirect instructions (e.g. unauthenticated / expired session)
      if (resJson?.redirect && resJson?.redirectUrl) {
        router.push(resJson.redirectUrl);
        return false;
      }

      if (!res.ok || !resJson?.data?.payment_session_id) {
        const errorMsg =
          resJson?.message || resJson?.error || 'Unable to initiate payment. Please try again.';
        setErrorMessage(errorMsg);
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

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-8 text-white pb-20">
      {/* 01 — Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pt-2">
        {/* Back Link */}
        <Link
          href="/register/enroll-event"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-zinc-400 hover:text-[#FF6A00] transition-colors group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Back to enrollment</span>
        </Link>
      </div>

      {/* 02 — Main Page Header with signature rolling animation */}
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

      {/* 03 — Participant Information Card */}
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
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 rounded-md">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Entry Fees: {total > 0 ? 'Not Paid' : 'Paid'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Full Name</span>
            <span className="text-white font-medium text-sm truncate">{userName || 'Attendee'}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Email Address</span>
            <span className="text-zinc-200 truncate">{userEmail}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Entry Fees Status</span>
            <span className="text-amber-400 font-medium text-sm flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {total > 0 ? `Not Paid (₹${total})` : 'Paid'}
            </span>
          </div>
          {userPhone && (
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Phone</span>
              <span className="text-zinc-200">{userPhone}</span>
            </div>
          )}
          {userInstitution && (
            <div className="flex flex-col gap-1 sm:col-span-2">
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Institution</span>
              <span className="text-zinc-200 truncate">{userInstitution}</span>
            </div>
          )}
          {userDegree && (
            <div className="flex flex-col gap-1">
              <span className="text-zinc-500 text-[11px] uppercase tracking-wider">Degree / Program</span>
              <span className="text-zinc-200 truncate">{userDegree}</span>
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
            {unpaidIndividualEvents.map((ev) => (
              <div
                key={ev._id}
                className="rounded-2xl border border-white/[0.1] bg-[#0A0D16]/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-[#FF6A00]/40"
              >
                <div className="flex flex-col gap-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/[0.08] text-zinc-300">
                      Individual
                    </span>
                    {ev.category && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-[#FF6A00]/15 text-[#FF8833] border border-[#FF6A00]/25">
                        {ev.category}
                      </span>
                    )}
                  </div>
                  <h3 className="font-subheading font-medium text-base sm:text-lg text-white">
                    {ev.event_title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400">
                    {ev.venue && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        {ev.venue}
                      </span>
                    )}
                    {ev.date_time && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                        {ev.date_time}
                      </span>
                    )}
                  </div>
                </div>

                <div className="sm:text-right shrink-0 font-mono border-t sm:border-t-0 pt-2 sm:pt-0 border-white/[0.08]">
                  <span className="text-[11px] uppercase tracking-wider text-zinc-500 block">Entry Fee</span>
                  <span className="text-base sm:text-lg font-semibold text-emerald-400">
                    {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                  </span>
                </div>
              </div>
            ))}

            {/* Team Events (Expandable Drawer Dropdowns matching enroll-event) */}
            {unpaidTeamEvents.map((ev) => {
              const isExpanded = Boolean(expandedTeamRows[ev._id]);

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
                          TEAM EVENT
                        </span>
                        <h3 className="font-subheading font-medium text-base sm:text-lg text-white">
                          {ev.event_title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {ev.short_description || 'Team competition'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 min-w-0">
                        <span>{ev.venue || 'Venue TBA'}</span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        <span>{ev.date_time || 'Schedule TBA'}</span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        <span className="text-xs font-sans font-medium text-emerald-400">
                          {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                        </span>
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
                      aria-label={isExpanded ? `Collapse ${ev.event_title} details` : `Expand ${ev.event_title} details`}
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
                            <span className="text-white font-medium">{ev.team_name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">LEADER: </span>
                            <span className="text-white font-medium">{ev.team_leader_email || userEmail}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">SQUAD SIZE: </span>
                            <span className="text-white font-medium">{ev.team_size} members</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">TOTAL TEAM FEE: </span>
                            <span className="text-emerald-400 font-sans font-medium">
                              {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                            </span>
                          </div>
                        </div>

                        {/* Members Entry Fees Breakdown */}
                        <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06] text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">
                              ENTRY TICKET CHARGES:
                            </span>
                            <span className="text-zinc-400 text-[11px] font-mono">
                              ₹249 per attendee
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            {/* Leader */}
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                              <span className="text-[#FF6A00] font-semibold text-[11px]">LEADER:</span>
                              <span className="text-zinc-200">{ev.team_leader_email || userEmail}</span>
                              {entryTicketDetails.isPurchased ? (
                                <span className="text-emerald-400 font-mono font-medium text-[10px]">Paid ✓</span>
                              ) : (
                                <span className="text-amber-400 font-mono font-medium">₹249</span>
                              )}
                            </div>
                            {/* Other members */}
                            {(ev.memberEntryTickets ?? ev.team_members.map((email) => ({ email, entryTicketPrice: 249, isRegistered: true, requiresRegistration: false }))).map((member, mIdx) => (
                              <div key={mIdx} className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.08]">
                                <span className="text-zinc-400 font-semibold text-[11px]">M{mIdx + 1}:</span>
                                <span className="text-zinc-200">{member.email}</span>
                                {member.entryTicketPrice === 0 ? (
                                  <span className="text-emerald-400 font-mono font-medium text-[10px]">Paid ✓</span>
                                ) : (
                                  <span className="text-amber-400 font-mono font-medium">₹249</span>
                                )}
                                {('requiresRegistration' in member) && member.requiresRegistration && (
                                  <span className="text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">⚠ not registered</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Registered Members List */}
                        {ev.team_members && ev.team_members.length > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pt-1 text-xs">
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px] shrink-0">
                              REGISTERED SQUAD:
                            </span>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-300 font-mono tracking-wide">
                              {ev.team_members.map((memberEmail, mIdx) => (
                                <React.Fragment key={mIdx}>
                                  <span>{memberEmail}</span>
                                  {mIdx < ev.team_members.length - 1 && (
                                    <span className="text-zinc-600 select-none">|</span>
                                  )}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                        )}
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

        {/* Pricing Rows */}
        <div className="flex flex-col gap-3 font-mono text-xs sm:text-sm">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Subtotal</span>
            <span className="text-zinc-200">₹{subtotal}</span>
          </div>

          <div className="flex items-center justify-between text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span>Service Charge</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">(Included)</span>
            </div>
            <span className="text-emerald-400">₹0</span>
          </div>

          {/* Individual Event Fees */}
          {unpaidIndividualEvents.length > 0 && (
            <div className="flex items-center justify-between text-zinc-400">
              <span>Individual Event Fees ({unpaidIndividualEvents.length})</span>
              <span className="text-zinc-200">₹{individualTotal}</span>
            </div>
          )}

          {/* Team Event Fees */}
          {unpaidTeamEvents.length > 0 && (
            <div className="flex flex-col gap-1.5 text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Team Event Fees ({unpaidTeamEvents.length})</span>
                <span className="text-zinc-200">₹{teamTotal}</span>
              </div>
              <div className="flex flex-col gap-1 pl-3 border-l border-white/[0.08] text-[11px]">
                {unpaidTeamEvents.map((t) => (
                  <div key={t._id} className="flex items-center justify-between">
                    <span className="text-zinc-300">
                      {t.event_title}{' '}
                      <span className="text-zinc-500">({t.team_name})</span>
                    </span>
                    <span className="text-emerald-400 font-medium">₹{t.entry_fee}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Entry Ticket Charges */}
          {entryTicketTotal > 0 && (
            <div className="flex flex-col gap-1.5 text-zinc-400">
              <div className="flex items-center justify-between">
                <span>
                  Entry Ticket Charges
                  {entryTicketDetails.price > 0 && entryTicketTotal > 0
                    ? ` (₹${entryTicketDetails.price} × ${Math.round(entryTicketTotal / entryTicketDetails.price)} attendee${Math.round(entryTicketTotal / entryTicketDetails.price) !== 1 ? 's' : ''})`
                    : ''}
                </span>
                <span className="text-zinc-200">₹{entryTicketTotal}</span>
              </div>
              <div className="flex flex-col gap-1 pl-3 border-l border-amber-500/20 text-[11px] text-amber-400/80">
                <span>Mandatory fest entry ticket — one per attendee, charged once.</span>
              </div>
            </div>
          )}

          {entryTicketDetails.isPurchased && entryTicketTotal === 0 && (
            <div className="flex items-center justify-between text-zinc-400">
              <span>Your Entry Ticket</span>
              <span className="text-emerald-400 font-medium">Already purchased ✓</span>
            </div>
          )}

          <div className="border-t border-white/[0.1] pt-3 mt-1 flex items-center justify-between text-base sm:text-lg font-bold">
            <span className="text-white uppercase tracking-wider font-display">Total</span>
            <span className="text-[#FF6A00] text-xl sm:text-2xl font-mono">₹{total}</span>
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
            label={`Slide to confirm ₹${total}`}
            doneLabel="Redirecting..."
            errorLabel="Checkout Failed"
            trackColor="#10131E"
            handleColor="#FF6A00"
            successColor="#22c55e"
            dangerColor="#e5484d"
            disabled={totalEventsCount === 0 || isProcessing}
            onConfirm={handleConfirmPayment}
            onDone={handlePaymentDone}
            className="w-full max-w-[340px]"
          />
          <p className="text-[11px] font-mono text-zinc-500 tracking-wide text-center">
            Slide the handle to confirm your registration. Keyboard: use arrow keys or End.
          </p>
        </div>
      </section>
    </div>
  );
}
