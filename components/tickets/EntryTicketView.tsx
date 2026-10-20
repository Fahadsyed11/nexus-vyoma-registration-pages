'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import RegistrationTitleRolling from '@/components/registration/RegistrationTitleRolling';
import SlideCommit from '@/components/ui/SlideCommit';
import TicketStubCard from './TicketStubCard';

export interface FreeEventItem {
  _id: string;
  title: string;
  short_description: string;
  long_description?: string;
  venue: string;
  date_time: string;
  formatted_date?: string;
  formatted_time?: string;
  image_url?: string;
  category: string;
  participants_type: 'individual' | 'team';
  team_size?: number;
  min_team_size?: number;
  max_team_size?: number;
  prize?: string;
}

interface UserSessionInfo {
  id: string;
  name: string;
  email: string;
  phone_number?: string;
  institution?: string;
}

interface EntryTicketViewProps {
  initialUser: UserSessionInfo | null;
  initialIsPurchased?: boolean;
  freeEvents: FreeEventItem[];
}

function getEventDisplaySchedule(event: FreeEventItem): { date: string; time: string } {
  if (event.formatted_date) {
    return { date: event.formatted_date, time: event.formatted_time || '' };
  }
  const raw = event.date_time || 'Schedule TBA';
  if (raw.includes(',')) {
    const parts = raw.split(',');
    return { date: parts[0].trim(), time: parts.slice(1).join(',').trim() };
  }
  return { date: raw, time: '' };
}

export default function EntryTicketView({
  initialUser,
  initialIsPurchased = false,
  freeEvents = [],
}: EntryTicketViewProps) {
  const router = useRouter();

  // Track height of left stationary aside to match scroll container (identical to EventsExplorer.tsx)
  const leftAsideRef = useRef<HTMLElement>(null);
  const [asideHeight, setAsideHeight] = useState<number | null>(null);

  useEffect(() => {
    const el = leftAsideRef.current;
    if (!el) return;

    let rafId: number;
    const updateHeight = () => {
      if (window.innerWidth >= 1024) {
        const height = el.offsetHeight;
        if (height > 0) {
          setAsideHeight((prev) => (prev !== height ? height : prev));
        }
      } else {
        setAsideHeight((prev) => (prev !== null ? null : prev));
      }
    };

    updateHeight();

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHeight);
    });
    ro.observe(el);

    window.addEventListener('resize', updateHeight);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Buyer Form Modal State for unauthenticated visitors
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fullName, setFullName] = useState(initialUser?.name || '');
  const [email, setEmail] = useState(initialUser?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(initialUser?.phone_number || '');
  const [institution, setInstitution] = useState(initialUser?.institution || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const redirectTargetRef = useRef<string | null>(null);

  const isPurchased = initialIsPurchased;

  const handleSlideConfirm = async () => {
    setError(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedInstitution = institution.trim();


    setLoading(true);

    try {
      const res = await fetch('/api/registration/entry-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: initialUser?.name || trimmedName,
          email: initialUser?.email || trimmedEmail,
          phone_number: initialUser?.phone_number || trimmedPhone,
          institution: initialUser?.institution || trimmedInstitution,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const errMsg = data?.message || 'Failed to initiate ticket order. Please try again.';
        setError(errMsg);
        throw new Error(errMsg);
      }

      // Direct to payment gateway checkout or post-gateway status page
      if (data?.data?.paymentUrl || data?.data?.paymentLink) {
        redirectTargetRef.current = data.data.paymentUrl || data.data.paymentLink;
      } else if (data?.data?.orderId) {
        // Post-order fallback directed to status page (success/pending)
        redirectTargetRef.current = `/payment/success?order_id=${data.data.orderId}`;
      } else {
        redirectTargetRef.current = '/payment/success';
      }

      // Smooth pending transition before switching to done phase
      await new Promise((resolve) => setTimeout(resolve, 600));
      return true;
    } catch (err) {
      if (err instanceof Error && err.message !== 'Attendee details required') {
        setError(err.message);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleSlideDone = () => {
    const target = redirectTargetRef.current || '/payment/success';
    if (target.startsWith('http://') || target.startsWith('https://')) {
      window.location.href = target;
    } else {
      router.push(target);
    }
  };

  const handleInitiatePurchase = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // If not logged in and modal isn't open, open modal first
    if (!initialUser && !isModalOpen) {
      setIsModalOpen(true);
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();
    const trimmedPhone = phoneNumber.trim();
    const trimmedInstitution = institution.trim();

    if (!initialUser) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
        setError('Please provide a valid email address.');
        return;
      }
      if (!trimmedName) {
        setError('Please enter your full name.');
        return;
      }
      if (!trimmedPhone || trimmedPhone.replace(/\D/g, '').length < 10) {
        setError('Please enter a valid 10-digit phone number.');
        return;
      }
      if (!trimmedInstitution) {
        setError('Please enter your college or institution name.');
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch('/api/registration/entry-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: trimmedName,
          email: trimmedEmail,
          phone_number: trimmedPhone,
          institution: trimmedInstitution,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setSuccessMessage(
          data?.message || 'Order initiated successfully! Redirecting...'
        );

        if (data?.data?.paymentUrl || data?.data?.paymentLink) {
          window.location.href = data.data.paymentUrl || data.data.paymentLink;
        } else if (data?.data?.orderId) {
          setTimeout(() => {
            router.push(`/payment/success?order_id=${data.data.orderId}`);
          }, 800);
        } else {
          setTimeout(() => {
            router.push('/payment/success');
          }, 1000);
        }
        return;
      }

      setError(data?.message || 'Failed to initiate ticket order. Please try again.');
    } catch {
      setError('A network error occurred. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
      {/* ============================================================ */}
      {/* MOBILE-ONLY HEADER: Title & Quick Ticket Summary             */}
      {/* ============================================================ */}
      <div className="lg:hidden col-span-1 w-full flex flex-col gap-4">
        <RegistrationTitleRolling
          title="ENTRY TICKET"
          className="text-4xl xs:text-5xl sm:text-6xl text-white uppercase select-none leading-none"
        />
        <p className="font-mono text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase">
          OFFICIAL 3-DAY FEST PASS • ₹299
        </p>

        {/* Mobile Ticket Stub */}
        <TicketStubCard
          price={299}
          isPurchased={isPurchased}
          attendeeName={initialUser?.name || fullName}
          attendeeEmail={initialUser?.email || email}
        />

        {/* Mobile Buy CTA */}
        <div className="pt-2">
          {isPurchased ? (
            <Link
              href="/register/enroll-event"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg transition-colors flex items-center justify-center min-h-[44px]"
            >
              ✓ Pass Confirmed • Enroll in Events &rarr;
            </Link>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <SlideCommit
                width={320}
                height={54}
                label="Slide to pay ₹299"
                doneLabel="Redirecting..."
                errorLabel="Order Failed"
                trackColor="#10131E"
                handleColor="#FF6A00"
                successColor="#22c55e"
                dangerColor="#e5484d"
                disabled={loading}
                onConfirm={handleSlideConfirm}
                onDone={handleSlideDone}
                className="w-full max-w-[340px]"
              />
              <p className="text-[10px] font-mono text-zinc-500 tracking-wide text-center">
                Slide the handle to confirm pass<span className="hidden sm:inline">. Keyboard: use arrow keys or End</span>.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* DESKTOP-ONLY COLUMN: Stationary Left Panel (Matches /events) */}
      {/* ============================================================ */}
      <aside
        ref={leftAsideRef}
        className="hidden lg:flex lg:col-span-5 xl:col-span-4 w-full flex-col gap-6 lg:sticky lg:top-24"
      >
        {/* Title & Subtitle matching EventsExplorer.tsx (as='div' to keep single h1 per page) */}
        <div>
          <RegistrationTitleRolling
            title="ENTRY TICKET"
            as="div"
            className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl tracking-tight text-white uppercase select-none leading-none"
          />
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-zinc-400 uppercase mt-4">
            OFFICIAL 3-DAY FEST PASS
          </p>
        </div>

        {/* Ticket Stub Card */}
        <TicketStubCard
          price={299}
          isPurchased={isPurchased}
          attendeeName={initialUser?.name || fullName}
          attendeeEmail={initialUser?.email || email}
        />

        {/* Action Panel in /events #0c0d13 style */}
        <div className="rounded-2xl bg-[#0c0d13] border border-zinc-800/90 p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-2.5">
            <span className="text-zinc-400 uppercase tracking-wider">Pass Type</span>
            <span className="text-white font-medium">3-Day All-Access</span>
          </div>

          <div className="flex items-center justify-between text-xs font-mono border-b border-zinc-800 pb-2.5">
            <span className="text-zinc-400 uppercase tracking-wider">Free Events Included</span>
            <span className="text-emerald-400 font-semibold">{freeEvents.length} Events (₹0)</span>
          </div>

          <div className="flex items-baseline justify-between text-xs font-mono pb-1">
            <span className="text-zinc-400 uppercase tracking-wider">Total Payable</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs text-[#FF6A00]">₹</span>
              <span className="font-[family-name:var(--font-display)] text-2xl text-white">299</span>
            </div>
          </div>

          {/* Feedback Banners */}
          {error && !isModalOpen && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono">
              {error}
            </div>
          )}

          {successMessage && !isModalOpen && (
            <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              {successMessage}
            </div>
          )}

          {/* Primary Action Button (Matches /events button style) */}
          {isPurchased ? (
            <Link
              href="/register/enroll-event"
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-lg transition-colors flex items-center justify-center min-h-[44px]"
            >
              ✓ Pass Confirmed • Enroll in Events &rarr;
            </Link>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <SlideCommit
                width={320}
                height={54}
                label="Slide to pay ₹299"
                doneLabel="Redirecting..."
                errorLabel="Order Failed"
                trackColor="#10131E"
                handleColor="#FF6A00"
                successColor="#22c55e"
                dangerColor="#e5484d"
                disabled={loading}
                onConfirm={handleSlideConfirm}
                onDone={handleSlideDone}
                className="w-full max-w-[340px]"
              />
              <p className="text-[10px] font-mono text-zinc-500 tracking-wide text-center">
                Slide the handle to confirm pass. Keyboard: use arrow keys or End.
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* ============================================================ */}
      {/* RIGHT COLUMN: Independently Scrollable Free Events Section   */}
      {/* ============================================================ */}
      <section
        aria-label="Free Events Included With Pass"
        className="lg:col-span-7 xl:col-span-8 w-full flex flex-col"
      >
        {/* Right Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2.5 pb-3 mb-4 border-b border-zinc-800/80">
          <div className="flex flex-col gap-1 sm:gap-0.5">
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#FF6A00]">
                ACCESS INCLUDED
              </span>
              <span className="sm:hidden text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md whitespace-nowrap shrink-0">
                {freeEvents.length} FREE EVENTS
              </span>
            </div>
            <h2 className="font-subheading font-medium text-xl sm:text-2xl text-white uppercase tracking-wide leading-tight">
              Included Free Events
            </h2>
          </div>
          <span className="hidden sm:inline-flex text-xs font-mono font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md whitespace-nowrap shrink-0">
            {freeEvents.length} FREE EVENTS
          </span>
        </div>

        {/* Scrollable Event Listing Container (Matches /events right scroll container on desktop; natural flow on mobile) */}
        <div
          tabIndex={0}
          className="w-full flex flex-col gap-4 sm:gap-5 lg:overflow-y-auto lg:pr-3 [scrollbar-width:thin] [scrollbar-color:#2a2d3d_transparent] focus:outline-none"
          style={asideHeight ? { maxHeight: `${asideHeight - 50}px` } : undefined}
        >
          {freeEvents.length === 0 ? (
            <div className="w-full min-h-[320px] rounded-2xl bg-[#0c0d13] border border-zinc-800 flex flex-col items-center justify-center p-8 text-center gap-4">
              <span className="font-display text-2xl text-zinc-400 uppercase tracking-wide">
                No Free Events Found
              </span>
              <p className="text-zinc-500 text-xs sm:text-sm max-w-sm">
                Free events will appear here once scheduled.
              </p>
            </div>
          ) : (
            freeEvents.map((event, idx) => {
              const { date, time } = getEventDisplaySchedule(event);
              const hasImage = Boolean(event.image_url && event.image_url.startsWith('http'));

              return (
                <div
                  key={event._id}
                  className="group relative w-full rounded-2xl bg-[#0c0d13] border border-zinc-800/90 hover:border-zinc-700 transition-all duration-200 p-4 sm:p-5 md:p-6 text-left outline-none"
                >
                  {/* Bottom Right Corner: Participation Type (Matches EventCard.tsx) */}
                  <div className="absolute bottom-3 sm:bottom-4 md:bottom-5 right-3.5 sm:right-5 md:right-6 z-10 whitespace-nowrap select-none">
                    <span className="font-sans text-xs sm:text-sm font-medium text-zinc-400">
                      {event.participants_type === 'team'
                        ? `Team (${event.min_team_size || event.team_size || 2}-${event.max_team_size || event.team_size || 4})`
                        : 'Individual'}
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
                    {/* Left: Event Banner Thumbnail with color-matched ambient blur (matching EventCard.tsx) */}
                    <div className="relative overflow-hidden w-full max-w-[340px] sm:max-w-none sm:w-36 md:w-40 aspect-square sm:h-36 md:h-40 flex-shrink-0 self-center sm:self-auto mx-auto sm:mx-0 rounded-xl bg-[#0c0d15] border border-white/[0.08] flex items-center justify-center transition-transform duration-200">
                      {hasImage ? (
                        <>
                          {/* Ambient color-matched backdrop — eliminates black side bezels */}
                          <Image
                            src={event.image_url!}
                            alt=""
                            fill
                            className="object-cover blur-xl scale-125 opacity-35 select-none pointer-events-none"
                            aria-hidden="true"
                            unoptimized
                          />
                          {/* Uncropped sharp poster */}
                          <Image
                            src={event.image_url!}
                            alt={event.title}
                            fill
                            sizes="(max-width: 640px) 100vw, 192px"
                            className="object-contain relative z-10 transition-transform duration-200 group-hover:scale-[1.02]"
                            unoptimized
                          />
                        </>
                      ) : (
                        <span className="font-display text-xl sm:text-2xl md:text-3xl font-black text-[#FF6A00] tracking-wider select-none">
                          {`0${idx + 1}`}
                        </span>
                      )}
                    </div>

                    {/* Right: Event Information (Matches EventCard.tsx) */}
                    <div className="flex-1 flex flex-col justify-between py-0.5 gap-2.5">
                      {/* Category, Title & Description */}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF6A00] block select-none">
                            {event.category}
                          </span>
                        </div>

                        <h3 className="font-subheading font-medium text-xl sm:text-2xl md:text-3xl tracking-wide text-white uppercase group-hover:text-zinc-100 transition-colors leading-tight">
                          {event.title}
                        </h3>

                        {event.short_description && (
                          <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed mt-1 line-clamp-2">
                            {event.short_description}
                          </p>
                        )}
                      </div>

                      {/* Metadata: Venue, Highlighted Date, Time */}
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-zinc-300 font-sans pr-16 sm:pr-20">
                        <span>{event.venue}</span>
                        <span suppressHydrationWarning className="text-[#FF6A00] font-medium">{date}</span>
                        {time && <span suppressHydrationWarning className="text-zinc-400">{time}</span>}
                      </div>

                      {/* Prize Note if present */}
                      {event.prize && (
                        <div className="text-[11px] font-mono text-amber-400/90 pt-0.5">
                          Prize: {event.prize}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* ============================================================ */}
      {/* BUYER MODAL (For unauthenticated visitors who click Buy)     */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-[#0c0d13] p-6 sm:p-8 flex flex-col gap-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-800 pb-4">
              <div className="flex flex-col">
                <span className="font-mono text-[11px] font-bold text-[#FF6A00] uppercase tracking-wider">
                  CHECKOUT • 3-DAY PASS
                </span>
                <h3 className="font-subheading font-medium text-xl text-white uppercase">
                  Passholder Details
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleInitiatePurchase} className="flex flex-col gap-4 text-xs font-mono">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-name" className="text-zinc-400 uppercase tracking-wider">
                  Full Name <span className="text-[#FF6A00]">*</span>
                </label>
                <input
                  id="modal-name"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Syed Fahad"
                  className="w-full bg-[#12141c] text-white placeholder-zinc-600 font-sans text-sm px-4 py-3 rounded-lg border border-zinc-700 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="modal-email" className="text-zinc-400 uppercase tracking-wider">
                  Email Address <span className="text-[#FF6A00]">*</span>
                </label>
                <input
                  id="modal-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="attendee@example.com"
                  className="w-full bg-[#12141c] text-white placeholder-zinc-600 font-sans text-sm px-4 py-3 rounded-lg border border-zinc-700 focus:border-[#FF6A00] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-phone" className="text-zinc-400 uppercase tracking-wider">
                    Phone <span className="text-[#FF6A00]">*</span>
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="9876543210"
                    className="w-full bg-[#12141c] text-white placeholder-zinc-600 font-sans text-sm px-4 py-3 rounded-lg border border-zinc-700 focus:border-[#FF6A00] focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="modal-college" className="text-zinc-400 uppercase tracking-wider">
                    College <span className="text-[#FF6A00]">*</span>
                  </label>
                  <input
                    id="modal-college"
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="ISL Engineering College"
                    className="w-full bg-[#12141c] text-white placeholder-zinc-600 font-sans text-sm px-4 py-3 rounded-lg border border-zinc-700 focus:border-[#FF6A00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Price Row */}
              <div className="p-3 rounded-lg bg-black/40 border border-zinc-800 flex items-center justify-between text-xs">
                <span className="text-zinc-400">Total Payable:</span>
                <span className="text-emerald-400 font-semibold font-sans text-sm">₹299</span>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {error}
                </div>
              )}

              <div className="flex flex-col items-center justify-center gap-2 w-full pt-1">
                <SlideCommit
                  width={340}
                  height={54}
                  label="Slide to confirm ₹299"
                  doneLabel="Redirecting..."
                  errorLabel="Order Failed"
                  trackColor="#10131E"
                  handleColor="#FF6A00"
                  successColor="#22c55e"
                  dangerColor="#e5484d"
                  disabled={loading}
                  onConfirm={handleSlideConfirm}
                  onDone={handleSlideDone}
                  className="w-full max-w-[340px]"
                />
                <p className="text-[10px] font-mono text-zinc-500 tracking-wide text-center">
                  Slide handle to complete purchase
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
