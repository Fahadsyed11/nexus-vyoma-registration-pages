'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface SerializedEvent {
  _id: string;
  title: string;
  short_description?: string;
  long_description?: string;
  venue?: string;
  date_time?: string;
  image_url?: string;
  entry_fee?: number;
  participants_type?: 'individual' | 'team';
  team_size?: number;
  min_team_size?: number;
  max_team_size?: number;
  category?: string;
}

export interface SerializedEnrolledEvent {
  _id: string;
  event_title: string;
  event_id: string;
  participation_type?: 'individual' | 'team';
  team_name?: string | null;
  team_leader_email?: string | null;
  team_size?: number | null;
  team_members?: string[];
  event_details?: SerializedEvent | null;
}

interface EventEnrollmentViewProps {
  userName: string;
  userEmail: string;
  availableEvents: SerializedEvent[];
  initialIndividualEnrolled: SerializedEnrolledEvent[];
  initialTeamEnrolled: SerializedEnrolledEvent[];
  initialIndividualPending: SerializedEnrolledEvent[];
  initialTeamPending: SerializedEnrolledEvent[];
}

interface SelectedTeamEventState {
  eventId: string;
  teamName: string;
  teamMembers: string[];
}

export default function EventEnrollmentView({
  userName,
  userEmail,
  availableEvents,
  initialIndividualEnrolled,
  initialTeamEnrolled,
  initialIndividualPending,
  initialTeamPending,
}: EventEnrollmentViewProps) {
  const router = useRouter();

  // Active Tab: 'individual' | 'team'
  const [activeTab, setActiveTab] = useState<'individual' | 'team'>('individual');

  // Accordion open states for event rows (keyed by unique row id)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Inline drawer state for the "Add Events" selection drawer
  const [isIndividualDrawerOpen, setIsIndividualDrawerOpen] = useState(false);
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);

  // Selected Pending Events for Checkout
  const [selectedIndividualIds, setSelectedIndividualIds] = useState<string[]>([]);
  const [selectedTeamEvents, setSelectedTeamEvents] = useState<SelectedTeamEventState[]>([]);

  // Submission & feedback states
  const [submitting, setSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Pending (unpaid) enrolled events — mutable so we can remove on delete
  const [pendingIndividual, setPendingIndividual] = useState<SerializedEnrolledEvent[]>(initialIndividualPending);
  const [pendingTeam, setPendingTeam] = useState<SerializedEnrolledEvent[]>(initialTeamPending);

  // ID of the enrollment currently being deleted (for loading state)
  const [deletingEnrollId, setDeletingEnrollId] = useState<string | null>(null);

  // Horizontal scroll & drag controls for Individual Enrolled Events
  const individualScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragScrollLeft, setDragScrollLeft] = useState(0);

  const scrollIndividual = (direction: 'left' | 'right') => {
    if (individualScrollRef.current) {
      const scrollAmount = 320;
      individualScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!individualScrollRef.current) return;
    setIsDragging(true);
    setDragStartX(e.pageX - individualScrollRef.current.offsetLeft);
    setDragScrollLeft(individualScrollRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !individualScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - individualScrollRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.5;
    individualScrollRef.current.scrollLeft = dragScrollLeft - walk;
  };

  // Trackpad / cursor wheel horizontal scroll for Individual Enrolled Events
  useEffect(() => {
    const el = individualScrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // If user scrolls vertically with trackpad or mouse wheel (deltaY) without shift key
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && !e.shiftKey) {
        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        if (maxScrollLeft > 0) {
          const atStart = el.scrollLeft <= 0 && e.deltaY < 0;
          const atEnd = el.scrollLeft >= maxScrollLeft - 1 && e.deltaY > 0;
          if (!atStart && !atEnd) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
          }
        }
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, []);

  // Filter available events excluding already enrolled (paid OR pending) & already selected
  const alreadyEnrolledIds = new Set([
    ...initialIndividualEnrolled.map((e) => e.event_id),
    ...initialTeamEnrolled.map((e) => e.event_id),
    ...pendingIndividual.map((e) => e.event_id),
    ...pendingTeam.map((e) => e.event_id),
  ]);

  const eligibleIndividualEvents = availableEvents.filter(
    (ev) =>
      ev.participants_type === 'individual' &&
      !alreadyEnrolledIds.has(ev._id) &&
      !selectedIndividualIds.includes(ev._id)
  );

  const eligibleTeamEvents = availableEvents.filter(
    (ev) =>
      ev.participants_type === 'team' &&
      !alreadyEnrolledIds.has(ev._id) &&
      !selectedTeamEvents.some((t) => t.eventId === ev._id)
  );

  // Add individual event to pending selection
  const handleSelectIndividualEvent = (eventId: string) => {
    if (!eventId || selectedIndividualIds.includes(eventId)) return;
    setSelectedIndividualIds((prev) => [...prev, eventId]);
    setFeedbackError(null);
  };

  const handleRemoveIndividual = (eventId: string) => {
    setSelectedIndividualIds((prev) => prev.filter((id) => id !== eventId));
  };

  // Add team event to pending selection
  const handleSelectTeamEvent = (eventId: string) => {
    if (!eventId || selectedTeamEvents.some((t) => t.eventId === eventId)) return;
    const ev = availableEvents.find((e) => e._id === eventId);
    // min_team_size = minimum number of OTHER members (leader is separate)
    const minMembers = ev?.min_team_size ?? ev?.team_size ?? 1;
    const initialMembers = Array(minMembers).fill('');

    setSelectedTeamEvents((prev) => [
      ...prev,
      { eventId, teamName: '', teamMembers: initialMembers },
    ]);
    setFeedbackError(null);
  };

  const handleRemoveTeam = (eventId: string) => {
    setSelectedTeamEvents((prev) => prev.filter((t) => t.eventId !== eventId));
  };

  const updateTeamName = (eventId: string, name: string) => {
    setSelectedTeamEvents((prev) =>
      prev.map((t) => (t.eventId === eventId ? { ...t, teamName: name } : t))
    );
  };

  const updateTeamMember = (eventId: string, index: number, value: string) => {
    setSelectedTeamEvents((prev) =>
      prev.map((t) => {
        if (t.eventId !== eventId) return t;
        const updated = [...t.teamMembers];
        updated[index] = value;
        return { ...t, teamMembers: updated };
      })
    );
  };

  const addMemberField = (eventId: string) => {
    const ev = availableEvents.find((e) => e._id === eventId);
    // max_team_size = max number of OTHER members (leader is separate)
    const maxMembers = ev?.max_team_size ?? ev?.team_size ?? 99;
    setSelectedTeamEvents((prev) =>
      prev.map((t) => {
        if (t.eventId !== eventId) return t;
        if (t.teamMembers.length >= maxMembers) return t; // cap reached, do nothing
        return { ...t, teamMembers: [...t.teamMembers, ''] };
      })
    );
  };

  const removeMemberField = (eventId: string, index: number) => {
    const ev = availableEvents.find((e) => e._id === eventId);
    // min_team_size = minimum number of OTHER members (leader is separate)
    const minMembers = ev?.min_team_size ?? 1;
    setSelectedTeamEvents((prev) =>
      prev.map((t) => {
        if (t.eventId !== eventId) return t;
        if (t.teamMembers.length <= minMembers) return t; // floor reached, do nothing
        return { ...t, teamMembers: t.teamMembers.filter((_, i) => i !== index) };
      })
    );
  };

  // Fee calculation
  const selectedIndividualEventObjects = selectedIndividualIds
    .map((id) => availableEvents.find((e) => e._id === id))
    .filter(Boolean) as SerializedEvent[];

  const selectedTeamEventObjects = selectedTeamEvents
    .map((t) => ({
      ...t,
      event: availableEvents.find((e) => e._id === t.eventId),
    }))
    .filter((item) => Boolean(item.event));

  const totalFee = [
    ...selectedIndividualEventObjects.map((e) => e.entry_fee || 0),
    ...selectedTeamEventObjects.map((t) => t.event?.entry_fee || 0),
  ].reduce((acc, fee) => acc + fee, 0);

  const totalSelectedCount = selectedIndividualIds.length + selectedTeamEvents.length;

  // Delete a pending (unpaid) enrollment
  const handleDeleteEnrolled = async (
    enrolledEventId: string,
    eventId: string,
    type: 'individual' | 'team',
  ) => {
    setDeletingEnrollId(enrolledEventId);
    try {
      const res = await fetch('/api/enrollement/enroll-event', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrolledEventId, eventId }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        if (type === 'individual') {
          setPendingIndividual((prev) => prev.filter((e) => e._id !== enrolledEventId));
        } else {
          setPendingTeam((prev) => prev.filter((e) => e._id !== enrolledEventId));
        }
      } else {
        setFeedbackError(data?.message || 'Failed to remove enrollment.');
      }
    } catch {
      setFeedbackError('Network error while removing enrollment.');
    } finally {
      setDeletingEnrollId(null);
    }
  };

  // Checkout submission
  // The backend route handles ONE event per POST call, so we make sequential requests.
  const handleProceedToCheckout = async () => {
    setFeedbackError(null);
    setFeedbackSuccess(null);

    // Allow checkout if either new events are selected OR existing pending reservations exist
    const hasPendingReservations = pendingIndividual.length > 0 || pendingTeam.length > 0;
    if (totalSelectedCount === 0 && !hasPendingReservations) {
      setFeedbackError('Please select at least one event, or you have no pending reservations to check out.');
      return;
    }

    // If user has pending reservations but hasn't selected new events, go straight to checkout
    if (totalSelectedCount === 0 && hasPendingReservations) {
      router.push('/register/checkout-event');
      return;
    }

    // Validate team selections before hitting the network
    for (const teamItem of selectedTeamEvents) {
      const eventObj = availableEvents.find((e) => e._id === teamItem.eventId);
      if (!teamItem.teamName.trim()) {
        setFeedbackError(`Please specify a team name for "${eventObj?.title || 'the team event'}".`);
        return;
      }
      const minEmails = eventObj?.min_team_size ?? 1;
      const filledEmails = teamItem.teamMembers.filter((m) => m.trim() !== '');
      if (filledEmails.length < minEmails) {
        setFeedbackError(
          `"${eventObj?.title || 'Team event'}" requires at least ${minEmails} member email${minEmails !== 1 ? 's' : ''} (excluding you).`
        );
        return;
      }
    }

    setSubmitting(true);

    try {
      // --- Individual events: one POST per event ---
      for (const eventId of selectedIndividualIds) {
        const res = await fetch('/api/enrollement/enroll-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok && res.status !== 200) {
          setFeedbackError(data?.message || 'Failed to enroll in an individual event.');
          setSubmitting(false);
          return;
        }
      }

      // --- Team events: one POST per event ---
      for (const teamItem of selectedTeamEvents) {
        const teamEmails = teamItem.teamMembers.filter((m) => m.trim() !== '');
        const res = await fetch('/api/enrollement/enroll-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            eventId: teamItem.eventId,
            teamName: teamItem.teamName.trim(),
            teamEmails,
          }),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok && res.status !== 200) {
          setFeedbackError(data?.message || 'Failed to enroll your team in an event.');
          setSubmitting(false);
          return;
        }
      }

      setFeedbackSuccess('Enrolment recorded successfully! Redirecting to checkout...');
      setTimeout(() => {
        router.push('/register/checkout-event');
      }, 1000);
    } catch {
      setFeedbackError('A network error occurred. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-10 text-white pb-20">
      {/* 01 — Top Personalized Greeting */}
      <div className="flex flex-col gap-1 pt-2">
        <h1 className="text-base sm:text-lg font-display font-medium uppercase tracking-wider text-zinc-400">
          Hi{' '}
          <span className="text-zinc-200 font-semibold">
            {userName}
          </span>{' '}
          :)
        </h1>
        <p className="text-xs font-mono text-zinc-500 tracking-wide uppercase break-all sm:break-normal">
          Nexus Vyoma 2026 • Registered Attendee Portal • {userEmail}
        </p>
      </div>

      {/* 02 — Individual Enrolled Events Section (Smooth Sideways Scrolling) */}
      <section className="w-full min-w-0 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base sm:text-lg font-subheading font-medium uppercase tracking-wider text-zinc-400">
            Individual Events (Paid)
          </h2>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <span className="text-xs font-mono text-emerald-400 font-medium">
              {initialIndividualEnrolled.length} PAID
            </span>
            {initialIndividualEnrolled.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollIndividual('left')}
                  aria-label="Scroll left"
                  className="p-1.5 rounded-lg border border-white/[0.1] bg-[#07090E] hover:border-[#FF6A00]/50 hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollIndividual('right')}
                  aria-label="Scroll right"
                  className="p-1.5 rounded-lg border border-white/[0.1] bg-[#07090E] hover:border-[#FF6A00]/50 hover:bg-white/[0.05] text-zinc-400 hover:text-white transition-all cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {initialIndividualEnrolled.length === 0 ? (
          <div className="w-full p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#07090E] text-zinc-500 font-mono text-xs sm:text-sm text-center">
            No paid individual events yet. Browse and add events below.
          </div>
        ) : (
          <div
            ref={individualScrollRef}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className={`w-full min-w-0 flex gap-4 overflow-x-auto pb-4 pt-1 touch-pan-x -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-proximity scrollbar-thin scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-500 scrollbar-track-transparent ${
              isDragging ? 'cursor-grabbing select-none' : 'cursor-grab'
            }`}
          >
            {initialIndividualEnrolled.map((enrolled) => {
              const details = enrolled.event_details;
              return (
                <div
                  key={enrolled._id}
                  className="snap-start shrink-0 w-[260px] sm:w-[300px] rounded-2xl border border-white/[0.1] bg-[#07090E] hover:border-[#FF6A00]/40 transition-colors p-4 flex flex-col gap-3 group select-none"
                >
                  {/* Event Thumbnail */}
                  <div className="w-full aspect-[16/9] rounded-xl overflow-hidden relative bg-zinc-950 border border-white/[0.06]">
                    {details?.image_url && details.image_url.startsWith('http') ? (
                      <Image
                        src={details.image_url}
                        alt={enrolled.event_title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300 pointer-events-none"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-950 text-zinc-600 font-mono text-xs uppercase p-2 text-center pointer-events-none">
                        {enrolled.event_title}
                      </div>
                    )}
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-sm">
                      PAID
                    </span>
                  </div>

                  {/* Title, Metadata & Entry Fee */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-subheading font-medium text-sm sm:text-base text-white tracking-wide truncate">
                        {enrolled.event_title}
                      </h3>
                      {/* Entry Fee directly inside individual enrolled event */}
                      <span className="text-xs font-sans font-medium text-emerald-400 shrink-0">
                        {details?.entry_fee ? `₹${details.entry_fee}` : 'FREE'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-zinc-400 flex flex-col gap-0.5">
                      <span>{details?.date_time || 'Schedule TBA'}</span>
                      <span className="text-zinc-500 truncate">{details?.venue || 'Venue TBA'}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 03 — Team Enrolled Events Section (Expandable Accordion Rows) */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-subheading font-medium uppercase tracking-wider text-zinc-400">
            Team Events (Paid)
          </h2>
          <span className="text-xs font-mono text-emerald-400 font-medium">
            {initialTeamEnrolled.length} PAID
          </span>
        </div>

        {initialTeamEnrolled.length === 0 ? (
          <div className="w-full p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#07090E] text-zinc-500 font-mono text-xs sm:text-sm text-center">
            No paid team events yet. Register your team below.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {initialTeamEnrolled.map((teamEvent) => {
              const rowId = `team-enrolled-${teamEvent._id}`;
              const isExpanded = Boolean(expandedRows[rowId]);
              const details = teamEvent.event_details;

              return (
                <div
                  key={teamEvent._id}
                  className="rounded-2xl border border-white/[0.1] bg-[#07090E] hover:border-white/[0.2] transition-colors overflow-hidden"
                >
                  {/* Collapsed Bar: Clickable Header */}
                  <div
                    onClick={() => toggleRow(rowId)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 pr-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase font-semibold">
                          PAID • TEAM EVENT
                        </span>
                        <h3 className="font-subheading font-medium text-base sm:text-lg text-white">
                          {teamEvent.event_title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {details?.short_description || 'Team competition'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 min-w-0">
                        <span>{details?.venue || 'Venue TBA'}</span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        <span>{details?.date_time || 'Schedule TBA'}</span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        {/* Entry Fee directly inside team event collapsed row */}
                        <span className="text-xs font-sans font-medium text-emerald-400">
                          {details?.entry_fee ? `₹${details.entry_fee}` : 'FREE'}
                        </span>
                      </div>
                    </div>

                    {/* Expand/Collapse Arrow Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleRow(rowId);
                      }}
                      aria-expanded={isExpanded}
                      aria-label={isExpanded ? 'Collapse event details' : 'Expand event details'}
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
                        {/* Clean metadata line without artificial card containers */}
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-400">
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Team: </span>
                            <span className="text-white font-medium">{teamEvent.team_name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Leader: </span>
                            <span className="text-white font-medium">{teamEvent.team_leader_email || userEmail}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Squad Size: </span>
                            <span className="text-white font-medium">{teamEvent.team_size || (teamEvent.team_members?.length || 0) + 1}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Fee: </span>
                            <span className="text-emerald-400 font-sans font-medium">{details?.entry_fee ? `₹${details.entry_fee}` : 'FREE'}</span>
                          </div>
                        </div>

                        {/* Members List - Separated with clean distance and '|' delimiter */}
                        {teamEvent.team_members && teamEvent.team_members.length > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pt-1 text-xs">
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px] shrink-0">
                              Registered Members:
                            </span>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-300 font-mono tracking-wide">
                              {teamEvent.team_members.map((memberEmail, mIdx) => (
                                <React.Fragment key={mIdx}>
                                  <span>{memberEmail}</span>
                                  {mIdx < (teamEvent.team_members?.length ?? 0) - 1 && (
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

      {/* 04 — Pending Individual Reservations (isPaid: false) */}
      {pendingIndividual.length > 0 && (
        <section className="w-full min-w-0 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base sm:text-lg font-subheading font-medium uppercase tracking-wider text-zinc-400">
              Individual Events
              <span className="ml-2 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                PENDING PAYMENT
              </span>
            </h2>
            <span className="text-xs font-mono text-amber-400 font-medium shrink-0">
              {pendingIndividual.length} RESERVED
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {pendingIndividual.map((enrolled) => {
              const details = enrolled.event_details;
              const isDeleting = deletingEnrollId === enrolled._id;
              return (
                <div
                  key={enrolled._id}
                  className="rounded-2xl border border-amber-500/20 bg-[#07090E] hover:border-amber-500/40 transition-colors p-4 flex items-start justify-between gap-4"
                >
                  <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/30">
                        RESERVED
                      </span>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {details?.category || 'Individual'}
                      </span>
                    </div>
                    <h3 className="font-subheading font-medium text-sm sm:text-base text-white tracking-wide">
                      {enrolled.event_title}
                    </h3>
                    <div className="text-[11px] font-mono text-zinc-400 flex flex-wrap gap-x-3 gap-y-0.5">
                      <span>{details?.date_time || 'Schedule TBA'}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-500 truncate">{details?.venue || 'Venue TBA'}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-emerald-400 font-sans font-medium">
                        {details?.entry_fee ? `₹${details.entry_fee}` : 'FREE'}
                      </span>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteEnrolled(enrolled._id, enrolled.event_id, 'individual')
                    }
                    disabled={isDeleting}
                    aria-label={`Remove ${enrolled.event_title} from reservations`}
                    className="shrink-0 p-2 rounded-xl border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isDeleting ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 05 — Pending Team Reservations (isPaid: false) */}
      {pendingTeam.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-subheading font-medium uppercase tracking-wider text-zinc-400">
              Team Events
              <span className="ml-2 text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                PENDING PAYMENT
              </span>
            </h2>
            <span className="text-xs font-mono text-amber-400 font-medium">
              {pendingTeam.length} RESERVED
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {pendingTeam.map((teamEvent) => {
              const rowId = `pending-team-${teamEvent._id}`;
              const isExpanded = Boolean(expandedRows[rowId]);
              const details = teamEvent.event_details;
              const isDeleting = deletingEnrollId === teamEvent._id;
              const isLeader = teamEvent.team_leader_email === userEmail;

              return (
                <div
                  key={teamEvent._id}
                  className="rounded-2xl border border-amber-500/20 bg-[#07090E] hover:border-amber-500/40 transition-colors overflow-hidden"
                >
                  {/* Collapsed Bar */}
                  <div
                    onClick={() => toggleRow(rowId)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                  >
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 pr-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-mono text-amber-400 tracking-widest uppercase font-semibold">
                          RESERVED • TEAM EVENT
                        </span>
                        <h3 className="font-subheading font-medium text-base sm:text-lg text-white">
                          {teamEvent.event_title}
                        </h3>
                        <p className="text-xs text-zinc-400 line-clamp-1">
                          {details?.short_description || 'Team competition'}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-mono text-zinc-400 min-w-0">
                        <span>{details?.venue || 'Venue TBA'}</span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        <span>{details?.date_time || 'Schedule TBA'}</span>
                        <span className="hidden sm:inline text-zinc-600">•</span>
                        <span className="text-emerald-400 font-sans font-medium">
                          {details?.entry_fee ? `₹${details.entry_fee}` : 'FREE'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Expand chevron */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleRow(rowId); }}
                        aria-expanded={isExpanded}
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                        className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-colors"
                      >
                        <svg
                          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-amber-400' : 'text-zinc-400'}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Delete — only for team leader */}
                      {isLeader && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEnrolled(teamEvent._id, teamEvent.event_id, 'team');
                          }}
                          disabled={isDeleting}
                          aria-label={`Remove ${teamEvent.event_title} team from reservations`}
                          className="p-2 rounded-xl border border-red-500/20 text-red-400/70 hover:text-red-400 hover:border-red-500/50 hover:bg-red-500/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                        >
                          {isDeleting ? (
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Expanded Panel */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none ${isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <div className="p-4 sm:p-5 pt-3 border-t border-white/[0.06] flex flex-col gap-3 font-mono text-xs">
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-zinc-400">
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Team: </span>
                            <span className="text-white font-medium">{teamEvent.team_name || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Leader: </span>
                            <span className="text-white font-medium">{teamEvent.team_leader_email || userEmail}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Squad Size: </span>
                            <span className="text-white font-medium">{teamEvent.team_size || (teamEvent.team_members?.length || 0) + 1}</span>
                          </div>
                          <div>
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px]">Fee: </span>
                            <span className="text-emerald-400 font-sans font-medium">{details?.entry_fee ? `₹${details.entry_fee}` : 'FREE'}</span>
                          </div>
                        </div>

                        {teamEvent.team_members && teamEvent.team_members.length > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 pt-1 text-xs">
                            <span className="text-zinc-500 uppercase tracking-wider text-[11px] shrink-0">Members:</span>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-zinc-300 font-mono tracking-wide">
                              {teamEvent.team_members.map((memberEmail, mIdx) => (
                                <React.Fragment key={mIdx}>
                                  <span>{memberEmail}</span>
                                  {mIdx < (teamEvent.team_members?.length ?? 0) - 1 && (
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
        </section>
      )}

      {/* 06 — Add Events Section (Inline Expandable Drawer) */}
      <section className="flex flex-col gap-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.08] pb-3">
          <h2 className="text-base sm:text-lg font-subheading font-medium uppercase tracking-wider text-zinc-400">
            Add Events
          </h2>

          {/* Two Tabs: Individual vs Team */}
          <div className="flex items-center p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveTab('individual')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'individual'
                  ? 'bg-[#FF6A00] text-white font-medium shadow-[0_0_15px_rgba(255,106,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Individual Events
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                activeTab === 'team'
                  ? 'bg-[#FF6A00] text-white font-medium shadow-[0_0_15px_rgba(255,106,0,0.4)]'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Team Events
            </button>
          </div>
        </div>

        {/* Tab 1: Individual Events */}
        {activeTab === 'individual' && (
          <div className="flex flex-col gap-4">
            {/* INLINE EXPANDABLE DRAWER ROW (Replaces conventional select menu) */}
            <div className="rounded-2xl border border-white/[0.12] bg-[#07090E] hover:border-[#FF6A00]/40 transition-colors overflow-hidden">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsIndividualDrawerOpen((prev) => !prev);
                  }
                }}
                onClick={() => setIsIndividualDrawerOpen((prev) => !prev)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-3 pr-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#FF6A00] shrink-0" />
                  <span className="font-subheading font-medium text-xs sm:text-base text-white tracking-wide">
                    Select an Individual Event to Enroll
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2 sm:px-2.5 py-0.5 rounded-full shrink-0">
                    {eligibleIndividualEvents.length} available
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsIndividualDrawerOpen((prev) => !prev);
                  }}
                  aria-expanded={isIndividualDrawerOpen}
                  aria-label={isIndividualDrawerOpen ? 'Collapse event drawer' : 'Expand event drawer'}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] transition-colors"
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isIndividualDrawerOpen ? 'rotate-180 text-[#FF6A00]' : 'text-zinc-400'
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

              {/* Inline Drawer Content Area (Normal document flow, pushing subsequent content down) */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                  isIndividualDrawerOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`p-4 sm:p-5 pt-0 border-t border-white/[0.06] flex flex-col gap-3 transition-opacity duration-250 ease-out motion-reduce:transition-none ${
                      isIndividualDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {eligibleIndividualEvents.length === 0 ? (
                      <div className="py-6 text-center text-xs font-mono text-zinc-500">
                        All eligible individual events are already paid or added to your selection.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5 pt-3">
                        {eligibleIndividualEvents.map((ev) => {
                          const rowId = `catalog-ind-${ev._id}`;
                          const isExpanded = Boolean(expandedRows[rowId]);

                          return (
                            <div
                              key={ev._id}
                              className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] transition-colors overflow-hidden"
                            >
                              {/* Collapsed Event Row: Title + Short Description + Small Chevron */}
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleRow(rowId)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleRow(rowId);
                                  }
                                }}
                                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                              >
                                <div className="flex-1 flex flex-col gap-0.5 min-w-0 pr-2">
                                  <h4 className="font-subheading font-medium text-sm sm:text-base text-white tracking-wide truncate">
                                    {ev.title}
                                  </h4>
                                  {ev.short_description && (
                                    <p className="text-xs text-zinc-400 line-clamp-1">
                                      {ev.short_description}
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRow(rowId);
                                  }}
                                  aria-expanded={isExpanded}
                                  aria-label={isExpanded ? `Collapse ${ev.title} details` : `Expand ${ev.title} details`}
                                  className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                                >
                                  <svg
                                    className={`w-4 h-4 transition-transform duration-250 ${
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

                              {/* Expanded Content: Price, Venue, Schedule, Long Description & Action */}
                              <div
                                className={`grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none ${
                                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                }`}
                              >
                                <div className="overflow-hidden">
                                  <div
                                    className={`p-3.5 sm:p-4 pt-2 border-t border-white/[0.06] flex flex-col gap-3 transition-opacity duration-200 ${
                                      isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                    }`}
                                  >
                                    {ev.long_description && ev.long_description !== ev.short_description && (
                                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                                        {ev.long_description}
                                      </p>
                                    )}

                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-400">
                                        <span>{ev.venue || 'ISL Campus'}</span>
                                        <span className="text-zinc-600">•</span>
                                        <span>{ev.date_time || 'Schedule TBA'}</span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-emerald-400 font-sans font-semibold">
                                          {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectIndividualEvent(ev._id);
                                        }}
                                        className="px-3.5 py-1.5 rounded-lg border border-[#FF6A00]/60 bg-[#FF6A00]/15 hover:bg-[#FF6A00]/25 text-[#FF8833] hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer font-medium"
                                      >
                                        + Add to Selection
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Individual Event Rows */}
            <div className="flex flex-col gap-3 mt-2">
              <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Selected Individual Events ({selectedIndividualEventObjects.length})
              </h3>

              {selectedIndividualEventObjects.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-white/[0.08] text-zinc-500 font-mono text-xs text-center">
                  No individual events added to checkout yet. Expand the drawer above to choose events.
                </div>
              ) : (
                selectedIndividualEventObjects.map((ev) => {
                  const rowId = `selected-ind-${ev._id}`;
                  const isExpanded = Boolean(expandedRows[rowId]);

                  return (
                    <div
                      key={ev._id}
                      className="rounded-2xl border border-white/[0.12] bg-[#07090E] hover:border-[#FF6A00]/30 transition-colors overflow-hidden"
                    >
                      {/* Header Bar */}
                      <div
                        onClick={() => toggleRow(rowId)}
                        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 pr-2">
                          <div className="flex flex-col">
                            <h4 className="font-subheading font-medium text-sm sm:text-base text-white">
                              {ev.title}
                            </h4>
                            <span className="text-xs text-zinc-400 truncate max-w-sm">
                              {ev.venue || 'Venue TBA'} • {ev.date_time || 'Schedule TBA'}
                            </span>
                          </div>

                          {/* Entry Fee directly inside selected event row */}
                          <span className="text-xs font-mono font-medium text-emerald-400 shrink-0">
                            {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Expand/Collapse Chevron Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(rowId);
                            }}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Collapse event details' : 'Expand event details'}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00] transition-colors"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform duration-300 ${
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

                          {/* Remove (×) Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveIndividual(ev._id);
                            }}
                            aria-label={`Remove ${ev.title}`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Expandable Details Container */}
                      <div
                        className={`grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none ${
                          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-4 pt-1 border-t border-white/[0.06] text-xs font-sans text-zinc-300 flex flex-col gap-2">
                            <p>{ev.short_description || ev.long_description || 'No additional description provided.'}</p>
                            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                              <span>Category: {ev.category || 'General'}</span>
                              <span className="text-emerald-400">Entry fee: {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Team Events */}
        {activeTab === 'team' && (
          <div className="flex flex-col gap-4">
            {/* INLINE EXPANDABLE DRAWER ROW FOR TEAM EVENTS */}
            <div className="rounded-2xl border border-white/[0.12] bg-[#07090E] hover:border-[#FF6A00]/40 transition-colors overflow-hidden">
              <div
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsTeamDrawerOpen((prev) => !prev);
                  }
                }}
                onClick={() => setIsTeamDrawerOpen((prev) => !prev)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 cursor-pointer select-none"
              >
                <div className="flex-1 flex flex-wrap items-center gap-2 sm:gap-3 pr-2 min-w-0">
                  <span className="w-2 h-2 rounded-full bg-[#FF6A00] shrink-0" />
                  <span className="font-subheading font-medium text-xs sm:text-base text-white tracking-wide">
                    Select a Team Event to Register Squad
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-mono text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2 sm:px-2.5 py-0.5 rounded-full shrink-0">
                    {eligibleTeamEvents.length} available
                  </span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsTeamDrawerOpen((prev) => !prev);
                  }}
                  aria-expanded={isTeamDrawerOpen}
                  aria-label={isTeamDrawerOpen ? 'Collapse team drawer' : 'Expand team drawer'}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6A00] transition-colors"
                >
                  <svg
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isTeamDrawerOpen ? 'rotate-180 text-[#FF6A00]' : 'text-zinc-400'
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

              {/* Inline Drawer Content Area for Team Events */}
              <div
                className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
                  isTeamDrawerOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                }`}
              >
                <div className="overflow-hidden">
                  <div
                    className={`p-4 sm:p-5 pt-0 border-t border-white/[0.06] flex flex-col gap-3 transition-opacity duration-250 ease-out motion-reduce:transition-none ${
                      isTeamDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {eligibleTeamEvents.length === 0 ? (
                      <div className="py-6 text-center text-xs font-mono text-zinc-500">
                        All eligible team events are already paid or added to your selection.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2.5 pt-3">
                        {eligibleTeamEvents.map((ev) => {
                          const rowId = `catalog-team-${ev._id}`;
                          const isExpanded = Boolean(expandedRows[rowId]);

                          return (
                            <div
                              key={ev._id}
                              className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.15] transition-colors overflow-hidden"
                            >
                              {/* Collapsed Event Row: Title + Short Description + Small Chevron */}
                              <div
                                role="button"
                                tabIndex={0}
                                onClick={() => toggleRow(rowId)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    toggleRow(rowId);
                                  }
                                }}
                                className="p-3.5 sm:p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                              >
                                <div className="flex-1 flex flex-col gap-0.5 min-w-0 pr-2">
                                  <h4 className="font-subheading font-medium text-sm sm:text-base text-white tracking-wide truncate">
                                    {ev.title}
                                  </h4>
                                  {ev.short_description && (
                                    <p className="text-xs text-zinc-400 line-clamp-1">
                                      {ev.short_description}
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleRow(rowId);
                                  }}
                                  aria-expanded={isExpanded}
                                  aria-label={isExpanded ? `Collapse ${ev.title} details` : `Expand ${ev.title} details`}
                                  className="shrink-0 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
                                >
                                  <svg
                                    className={`w-4 h-4 transition-transform duration-250 ${
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

                              {/* Expanded Content: Price, Squad Size, Venue, Schedule, Details & Action */}
                              <div
                                className={`grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none ${
                                  isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                                }`}
                              >
                                <div className="overflow-hidden">
                                  <div
                                    className={`p-3.5 sm:p-4 pt-2 border-t border-white/[0.06] flex flex-col gap-3 transition-opacity duration-200 ${
                                      isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                    }`}
                                  >
                                    {ev.long_description && ev.long_description !== ev.short_description && (
                                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                                        {ev.long_description}
                                      </p>
                                    )}

                                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-zinc-400">
                                        <span>Squad: {ev.team_size || ev.min_team_size || 2} Members</span>
                                        <span className="text-zinc-600">•</span>
                                        <span>{ev.venue || 'ISL Campus'}</span>
                                        <span className="text-zinc-600">•</span>
                                        <span>{ev.date_time || 'Schedule TBA'}</span>
                                        <span className="text-zinc-600">•</span>
                                        <span className="text-emerald-400 font-sans font-semibold">
                                          {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                                        </span>
                                      </div>

                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleSelectTeamEvent(ev._id);
                                        }}
                                        className="px-3.5 py-1.5 rounded-lg border border-[#FF6A00]/60 bg-[#FF6A00]/15 hover:bg-[#FF6A00]/25 text-[#FF8833] hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer font-medium"
                                      >
                                        + Setup Squad
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Team Event Rows */}
            <div className="flex flex-col gap-3 mt-2">
              <h3 className="text-xs font-mono uppercase text-zinc-400 tracking-wider">
                Selected Team Events ({selectedTeamEvents.length})
              </h3>

              {selectedTeamEvents.length === 0 ? (
                <div className="p-6 rounded-2xl border border-dashed border-white/[0.08] text-zinc-500 font-mono text-xs text-center">
                  No team events added yet. Expand the drawer above to select a team competition.
                </div>
              ) : (
                selectedTeamEvents.map((tItem) => {
                  const ev = availableEvents.find((e) => e._id === tItem.eventId);
                  if (!ev) return null;
                  const rowId = `selected-team-${tItem.eventId}`;
                  const isExpanded = Boolean(expandedRows[rowId] ?? true);

                  return (
                    <div
                      key={tItem.eventId}
                      className="rounded-2xl border border-white/[0.12] bg-[#07090E] hover:border-[#FF6A00]/30 transition-colors overflow-hidden"
                    >
                      {/* Header Bar */}
                      <div
                        onClick={() => toggleRow(rowId)}
                        className="p-4 flex items-center justify-between gap-3 cursor-pointer select-none"
                      >
                        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 pr-2">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <h4 className="font-subheading font-medium text-sm sm:text-base text-white">
                                {ev.title}
                              </h4>
                              <span className="text-[10px] font-mono bg-[#FF6A00]/20 text-[#FF8833] px-2 py-0.5 rounded-full uppercase">
                                SQUAD
                              </span>
                            </div>
                            <span className="text-xs text-zinc-400 truncate max-w-sm">
                              {ev.venue || 'Venue TBA'} • {ev.date_time || 'Schedule TBA'}
                            </span>
                          </div>

                          {/* Entry Fee directly inside selected team event row */}
                          <span className="text-xs font-mono font-medium text-emerald-400 shrink-0">
                            {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Expand/Collapse Chevron Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRow(rowId);
                            }}
                            aria-expanded={isExpanded}
                            aria-label={isExpanded ? 'Collapse team details' : 'Expand team details'}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.05] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FF6A00] transition-colors"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform duration-300 ${
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

                          {/* Remove (×) Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveTeam(tItem.eventId);
                            }}
                            aria-label={`Remove ${ev.title}`}
                            className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-red-400 transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Expandable Squad Setup Panel */}
                      <div
                        className={`grid transition-[grid-template-rows] duration-250 ease-out motion-reduce:transition-none ${
                          isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="p-4 pt-1 border-t border-white/[0.06] flex flex-col gap-4 text-xs">
                            {/* Team Name Input */}
                            <div className="flex flex-col gap-1.5">
                              <label className="font-mono text-[11px] uppercase text-zinc-400">
                                Team Name <span className="text-[#FF6A00]">*</span>
                              </label>
                              <input
                                type="text"
                                value={tItem.teamName}
                                onChange={(e) => updateTeamName(tItem.eventId, e.target.value)}
                                placeholder="e.g. Apex Predators"
                                className="w-full bg-black/60 text-white font-sans text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.12] focus:border-[#FF6A00] focus:outline-none"
                              />
                            </div>

                            {/* Leader Email (Prefilled & Readonly) */}
                            <div className="flex flex-col gap-1.5">
                              <label className="font-mono text-[11px] uppercase text-zinc-400">
                                Team Leader Email (You)
                              </label>
                              <input
                                type="email"
                                value={userEmail}
                                readOnly
                                className="w-full bg-white/[0.03] text-zinc-400 font-mono text-xs px-3.5 py-2.5 rounded-xl border border-white/[0.08] cursor-not-allowed"
                              />
                            </div>

                            {/* Squad Member Emails */}
                            <div className="flex flex-col gap-2 pt-1">
                              <div className="flex items-center justify-between">
                                <label className="font-mono text-[11px] uppercase text-zinc-400">
                                  Team Member Emails ({tItem.teamMembers.length} added)
                                  {(() => {
                                    const ev = availableEvents.find((e) => e._id === tItem.eventId);
                                    const minM = ev?.min_team_size ?? 1;
                                    const maxM = ev?.max_team_size ?? ev?.team_size ?? 99;
                                    return (
                                      <span className="ml-1.5 text-zinc-600 normal-case">
                                        ({minM}–{maxM} required)
                                      </span>
                                    );
                                  })()}
                                </label>
                                {(() => {
                                  const ev = availableEvents.find((e) => e._id === tItem.eventId);
                                  const maxM = ev?.max_team_size ?? ev?.team_size ?? 99;
                                  const atMax = tItem.teamMembers.length >= maxM;
                                  return (
                                    <button
                                      type="button"
                                      onClick={() => addMemberField(tItem.eventId)}
                                      disabled={atMax}
                                      className={`text-[11px] font-mono transition-colors ${
                                        atMax
                                          ? 'text-zinc-600 cursor-not-allowed'
                                          : 'text-[#FF8833] hover:text-[#FF6A00] cursor-pointer'
                                      }`}
                                    >
                                      {atMax ? 'Max members reached' : '+ Add Member'}
                                    </button>
                                  );
                                })()}
                              </div>

                              {tItem.teamMembers.map((memberEmail, mIdx) => (
                                <div key={mIdx} className="flex items-center gap-2">
                                  <input
                                    type="email"
                                    value={memberEmail}
                                    onChange={(e) => updateTeamMember(tItem.eventId, mIdx, e.target.value)}
                                    placeholder={`Member #${mIdx + 2} email (e.g. teammate@islec.edu.in)`}
                                    className="flex-1 bg-black/60 text-white font-mono text-xs px-3 py-2 rounded-lg border border-white/[0.1] focus:border-[#FF6A00] focus:outline-none"
                                  />
                                  {(() => {
                                    const ev = availableEvents.find((e) => e._id === tItem.eventId);
                                    const minM = ev?.min_team_size ?? 1;
                                    const atMin = tItem.teamMembers.length <= minM;
                                    return (
                                      <button
                                        type="button"
                                        onClick={() => removeMemberField(tItem.eventId, mIdx)}
                                        aria-label="Remove member field"
                                        disabled={atMin}
                                        className={`p-2 transition-colors ${
                                          atMin
                                            ? 'text-zinc-700 cursor-not-allowed'
                                            : 'text-zinc-500 hover:text-red-400 cursor-pointer'
                                        }`}
                                      >
                                        ×
                                      </button>
                                    );
                                  })()}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 05 — Bottom Checkout Button (Total summary removed) */}
        <div className="w-full mt-4 flex flex-col gap-3">
          {feedbackError && (
            <div
              className="text-xs text-red-400 font-mono tracking-wide px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20"
              role="alert"
            >
              {feedbackError}
            </div>
          )}

          {feedbackSuccess && (
            <div
              className="text-xs text-emerald-400 font-mono tracking-wide px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
              role="status"
            >
              {feedbackSuccess}
            </div>
          )}

          <button
            type="button"
            onClick={handleProceedToCheckout}
            disabled={submitting}
            className="w-full relative group overflow-hidden inline-flex items-center justify-center border border-[#FF6A00]/70 hover:border-[#FF6A00] bg-[#FF6A00]/20 text-white font-mono text-xs sm:text-sm tracking-wider uppercase rounded-xl py-3.5 shadow-[0_0_25px_rgba(255,106,0,0.25)] hover:shadow-[0_0_35px_rgba(255,106,0,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-[#FF6A00] via-[#FF3B2E] to-[#D8182B] translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"
            />
            <span className="relative z-10 font-bold tracking-widest flex items-center gap-2">
              {submitting ? 'Processing Enrolment...' : 'Proceed To Check Out'}
              {!submitting && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
