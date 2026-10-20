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
}: EventEnrollmentViewProps) {
  const router = useRouter();

  // Active Tab: 'individual' | 'team'
  const [activeTab, setActiveTab] = useState<'individual' | 'team'>('individual');

  // Accordion open states for event rows (keyed by unique row id)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Selected Pending Events for Checkout
  const [selectedIndividualIds, setSelectedIndividualIds] = useState<string[]>([]);
  const [selectedTeamEvents, setSelectedTeamEvents] = useState<SelectedTeamEventState[]>([]);

  // Submission & feedback states
  const [submitting, setSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

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

  // Filter available events excluding already enrolled & already selected
  const alreadyEnrolledIds = new Set([
    ...initialIndividualEnrolled.map((e) => e.event_id),
    ...initialTeamEnrolled.map((e) => e.event_id),
  ]);

  const eligibleIndividualEvents = availableEvents.filter(
    (ev) =>
      ev.participants_type === 'individual' &&
      (ev.entry_fee || 0) > 0 &&
      !alreadyEnrolledIds.has(ev._id) &&
      !selectedIndividualIds.includes(ev._id)
  );

  const eligibleTeamEvents = availableEvents.filter(
    (ev) =>
      ev.participants_type === 'team' &&
      (ev.entry_fee || 0) > 0 &&
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
    const minMembers = Math.max(0, (ev?.min_team_size || ev?.team_size || 1) - 1);
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
    setSelectedTeamEvents((prev) =>
      prev.map((t) => {
        if (t.eventId !== eventId) return t;
        return { ...t, teamMembers: [...t.teamMembers, ''] };
      })
    );
  };

  const removeMemberField = (eventId: string, index: number) => {
    setSelectedTeamEvents((prev) =>
      prev.map((t) => {
        if (t.eventId !== eventId) return t;
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

  // Checkout submission
  const handleProceedToCheckout = async () => {
    setFeedbackError(null);
    setFeedbackSuccess(null);

    if (totalSelectedCount === 0) {
      setFeedbackError('Please select at least one event before proceeding to checkout.');
      return;
    }

    // Validate team selections
    for (const teamItem of selectedTeamEvents) {
      const eventObj = availableEvents.find((e) => e._id === teamItem.eventId);
      if (!teamItem.teamName.trim()) {
        setFeedbackError(`Please specify a team name for "${eventObj?.title || 'the team event'}".`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/enroll-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedIndividualEventIds: selectedIndividualIds,
          selectedTeamEvents: selectedTeamEvents,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setFeedbackSuccess('Enrolment recorded successfully! Redirecting to checkout...');
        setTimeout(() => {
          router.push('/register/checkout-event');
        }, 1000);
      } else {
        setFeedbackError(data?.message || 'Failed to process event enrolment.');
      }
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

      {/* 04 — Add Events Section (Side-by-Side Dual-Box Layout) */}
      <section className="flex flex-col gap-6 pt-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-3 gap-2">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-base sm:text-lg font-subheading font-medium uppercase tracking-wider text-zinc-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF6A00]" />
              Add Events
            </h2>
            <p className="text-xs font-mono text-zinc-500">
              All 8 free events are included with your pass • Add paid competitions below
            </p>
          </div>
          <span className="text-xs font-mono text-zinc-400 shrink-0">
            {eligibleIndividualEvents.length + eligibleTeamEvents.length} paid events open
          </span>
        </div>

        {/* Two-Column Side-by-Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* LEFT BOX: Event Switcher & Available Catalog */}
          <div className="rounded-2xl border border-white/[0.12] bg-[#07090E] p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
            {/* Segmented Switch at top: [ TEAM ] | [ INDIVIDUAL ] */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-black/60 border border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveTab('team')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === 'team'
                    ? 'bg-[#FF6A00] text-white shadow-[0_0_15px_rgba(255,106,0,0.4)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Team Events
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('individual')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === 'individual'
                    ? 'bg-[#FF6A00] text-white shadow-[0_0_15px_rgba(255,106,0,0.4)]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                Individual Events
              </button>
            </div>

            {/* List Header & Counter */}
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400 px-1 pt-1">
              <span>
                Available {activeTab === 'team' ? 'Team' : 'Individual'} Events
              </span>
              <span className="text-zinc-500">
                {(activeTab === 'team' ? eligibleTeamEvents : eligibleIndividualEvents).length} Available
              </span>
            </div>

            {/* Scrollable Events List */}
            <div className="flex flex-col gap-3 max-h-[620px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-500">
              {activeTab === 'team' ? (
                eligibleTeamEvents.length === 0 ? (
                  <div className="py-12 px-4 text-center rounded-xl border border-dashed border-white/[0.08] text-zinc-500 font-mono text-xs">
                    All available team competitions are already selected or registered.
                  </div>
                ) : (
                  eligibleTeamEvents.map((ev) => (
                    <div
                      key={ev._id}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] transition-all p-4 flex flex-col gap-2.5 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col gap-1 min-w-0">
                          <h4 className="font-subheading font-medium text-sm sm:text-base text-white tracking-wide">
                            {ev.title}
                          </h4>
                          {ev.short_description && (
                            <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                              {ev.short_description}
                            </p>
                          )}
                        </div>
                        <span className="text-xs font-mono font-semibold text-emerald-400 shrink-0 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                          {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.05] text-[11px] font-mono text-zinc-400">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-zinc-300">
                            Squad: {ev.team_size || ev.min_team_size || 2} Members
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span>{ev.venue || 'ISL Campus'}</span>
                          <span className="text-zinc-600">•</span>
                          <span>{ev.date_time || 'Schedule TBA'}</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSelectTeamEvent(ev._id)}
                          className="px-3 py-1.5 rounded-lg border border-[#FF6A00]/60 bg-[#FF6A00]/15 hover:bg-[#FF6A00]/25 text-[#FF8833] hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer font-medium shrink-0"
                        >
                          + Select Event
                        </button>
                      </div>
                    </div>
                  ))
                )
              ) : eligibleIndividualEvents.length === 0 ? (
                <div className="py-12 px-4 text-center rounded-xl border border-dashed border-white/[0.08] text-zinc-500 font-mono text-xs">
                  All available individual events are already selected or paid.
                </div>
              ) : (
                eligibleIndividualEvents.map((ev) => (
                  <div
                    key={ev._id}
                    className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.18] transition-all p-4 flex flex-col gap-2.5 group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1 min-w-0">
                        <h4 className="font-subheading font-medium text-sm sm:text-base text-white tracking-wide">
                          {ev.title}
                        </h4>
                        {ev.short_description && (
                          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                            {ev.short_description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs font-mono font-semibold text-emerald-400 shrink-0 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                        {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/[0.05] text-[11px] font-mono text-zinc-400">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{ev.venue || 'ISL Campus'}</span>
                        <span className="text-zinc-600">•</span>
                        <span>{ev.date_time || 'Schedule TBA'}</span>
                        {ev.category && (
                          <>
                            <span className="text-zinc-600">•</span>
                            <span className="text-zinc-500">{ev.category}</span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleSelectIndividualEvent(ev._id)}
                        className="px-3 py-1.5 rounded-lg border border-[#FF6A00]/60 bg-[#FF6A00]/15 hover:bg-[#FF6A00]/25 text-[#FF8833] hover:text-white font-mono text-xs uppercase tracking-wider transition-all cursor-pointer font-medium shrink-0"
                      >
                        + Select Event
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT BOX: SELECTED EVENTS (not paid) & Checkout */}
          <div className="rounded-2xl border border-white/[0.12] bg-[#07090E] p-4 sm:p-5 flex flex-col gap-4 shadow-xl">
            {/* Header matching user sketch */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-subheading font-semibold text-sm sm:text-base text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF6A00] animate-pulse" />
                Selected Events (not paid)
              </h3>
              <span className="text-xs font-mono text-zinc-400 bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                {totalSelectedCount} Selected
              </span>
            </div>

            {/* List of Selected Events */}
            <div className="flex flex-col gap-3 max-h-[580px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700 hover:scrollbar-thumb-zinc-500">
              {totalSelectedCount === 0 ? (
                <div className="py-16 px-4 text-center rounded-xl border border-dashed border-white/[0.08] text-zinc-500 font-mono text-xs flex flex-col items-center justify-center gap-2">
                  <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>No events selected yet.</span>
                  <span className="text-zinc-600 text-[11px]">Select events from the left box to add them here.</span>
                </div>
              ) : (
                <>
                  {/* Selected Individual Events */}
                  {selectedIndividualEventObjects.map((ev) => (
                    <div
                      key={ev._id}
                      className="rounded-xl border border-white/[0.1] bg-black/40 hover:border-white/[0.2] transition-colors p-3.5 flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-subheading font-medium text-sm text-white truncate">
                              {ev.title}
                            </h4>
                            <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white/[0.06] text-zinc-400 uppercase">
                              INDIVIDUAL
                            </span>
                          </div>
                          <span className="text-xs font-mono text-zinc-400">
                            {ev.venue || 'ISL Campus'} • {ev.date_time || 'Schedule TBA'}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-medium text-emerald-400">
                            {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveIndividual(ev._id)}
                            aria-label={`Remove ${ev.title}`}
                            className="p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Selected Team Events with Squad Setup Fields */}
                  {selectedTeamEvents.map((tItem) => {
                    const ev = availableEvents.find((e) => e._id === tItem.eventId);
                    if (!ev) return null;

                    return (
                      <div
                        key={tItem.eventId}
                        className="rounded-xl border border-white/[0.1] bg-black/40 hover:border-white/[0.2] transition-colors p-3.5 flex flex-col gap-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-subheading font-medium text-sm text-white truncate">
                                {ev.title}
                              </h4>
                              <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-[#FF6A00]/20 text-[#FF8833] uppercase">
                                TEAM
                              </span>
                            </div>
                            <span className="text-xs font-mono text-zinc-400">
                              {ev.venue || 'ISL Campus'} • {ev.date_time || 'Schedule TBA'}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs font-mono font-medium text-emerald-400">
                              {ev.entry_fee ? `₹${ev.entry_fee}` : 'FREE'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTeam(tItem.eventId)}
                              aria-label={`Remove ${ev.title}`}
                              className="p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Squad Inputs */}
                        <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-3 text-xs">
                          {/* Team Name */}
                          <div className="flex flex-col gap-1">
                            <label className="font-mono text-[10px] uppercase text-zinc-400">
                              Team Name <span className="text-[#FF6A00]">*</span>
                            </label>
                            <input
                              type="text"
                              value={tItem.teamName}
                              onChange={(e) => updateTeamName(tItem.eventId, e.target.value)}
                              placeholder="e.g. Apex Titans"
                              className="w-full bg-black/60 text-white font-sans text-xs px-3 py-2 rounded-lg border border-white/[0.12] focus:border-[#FF6A00] focus:outline-none"
                            />
                          </div>

                          {/* Leader (read-only) */}
                          <div className="flex flex-col gap-1">
                            <label className="font-mono text-[10px] uppercase text-zinc-400">
                              Team Leader (You)
                            </label>
                            <input
                              type="email"
                              value={userEmail}
                              readOnly
                              className="w-full bg-white/[0.02] text-zinc-400 font-mono text-xs px-3 py-2 rounded-lg border border-white/[0.08] cursor-not-allowed"
                            />
                          </div>

                          {/* Squad Members */}
                          <div className="flex flex-col gap-1.5 pt-1">
                            <div className="flex items-center justify-between">
                              <label className="font-mono text-[10px] uppercase text-zinc-400">
                                Teammates ({tItem.teamMembers.length} added)
                              </label>
                              <button
                                type="button"
                                onClick={() => addMemberField(tItem.eventId)}
                                className="text-[10px] font-mono text-[#FF8833] hover:text-[#FF6A00] cursor-pointer"
                              >
                                + Add Member
                              </button>
                            </div>

                            {tItem.teamMembers.map((memberEmail, mIdx) => (
                              <div key={mIdx} className="flex items-center gap-2">
                                <input
                                  type="email"
                                  value={memberEmail}
                                  onChange={(e) => updateTeamMember(tItem.eventId, mIdx, e.target.value)}
                                  placeholder={`Teammate #${mIdx + 2} email`}
                                  className="flex-1 bg-black/60 text-white font-mono text-xs px-3 py-1.5 rounded-lg border border-white/[0.1] focus:border-[#FF6A00] focus:outline-none"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeMemberField(tItem.eventId, mIdx)}
                                  aria-label="Remove teammate field"
                                  className="p-1 text-zinc-500 hover:text-red-400 cursor-pointer text-sm"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Bottom Actions inside Right Box */}
            <div className="pt-3 border-t border-white/[0.08] flex flex-col gap-3 mt-auto">
              {/* Total Summary Row */}
              <div className="flex items-center justify-between px-1">
                <span className="font-mono text-xs uppercase tracking-wider text-zinc-400">
                  Total Payable:
                </span>
                <span className="font-sans font-bold text-base text-emerald-400">
                  {totalFee > 0 ? `₹${totalFee}` : '₹0'}
                </span>
              </div>

              {feedbackError && (
                <div
                  className="text-xs text-red-400 font-mono tracking-wide px-3.5 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
                  role="alert"
                >
                  {feedbackError}
                </div>
              )}

              {feedbackSuccess && (
                <div
                  className="text-xs text-emerald-400 font-mono tracking-wide px-3.5 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
                  role="status"
                >
                  {feedbackSuccess}
                </div>
              )}

              <button
                type="button"
                onClick={handleProceedToCheckout}
                disabled={submitting || totalSelectedCount === 0}
                className="w-full relative group overflow-hidden inline-flex items-center justify-center border border-[#FF6A00]/70 hover:border-[#FF6A00] bg-[#FF6A00]/20 text-white font-mono text-xs sm:text-sm tracking-wider uppercase rounded-xl py-3 shadow-[0_0_25px_rgba(255,106,0,0.25)] hover:shadow-[0_0_35px_rgba(255,106,0,0.5)] transition-all duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
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
          </div>
        </div>
      </section>
    </div>
  );
}
