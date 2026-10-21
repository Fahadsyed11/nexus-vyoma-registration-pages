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
  initialIndividualPending?: SerializedEnrolledEvent[];
  initialTeamPending?: SerializedEnrolledEvent[];
}

export interface VerifiedMember {
  email: string;
  name?: string;
  college?: string;
}

export interface SelectedTeamEventState {
  eventId: string;
  teamName: string;
  teamMembers: string[];
  verifiedDetails?: VerifiedMember[];
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

  // Selected Pending Events for Checkout
  const [selectedIndividualIds, setSelectedIndividualIds] = useState<string[]>([]);
  const [selectedTeamEvents, setSelectedTeamEvents] = useState<SelectedTeamEventState[]>([]);

  // Progressive Teammate Verification States
  const [pendingMemberEmail, setPendingMemberEmail] = useState<Record<string, string>>({});
  const [verifyingMember, setVerifyingMember] = useState<Record<string, boolean>>({});
  const [memberError, setMemberError] = useState<Record<string, string | null>>({});

  // Submission & feedback states
  const [submitting, setSubmitting] = useState(false);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);

  // Catalog & Enrolled States (Hydrated with server props, refreshed via sequential client API calls)
  const [eventsList, setEventsList] = useState<SerializedEvent[]>(availableEvents);
  const [individualPaid, setIndividualPaid] = useState<SerializedEnrolledEvent[]>(initialIndividualEnrolled);
  const [teamPaid, setTeamPaid] = useState<SerializedEnrolledEvent[]>(initialTeamEnrolled);
  const [pendingIndividual, setPendingIndividual] = useState<SerializedEnrolledEvent[]>(initialIndividualPending || []);
  const [pendingTeam, setPendingTeam] = useState<SerializedEnrolledEvent[]>(initialTeamPending || []);

  // Action loading states
  const [deletingEnrollId, setDeletingEnrollId] = useState<string | null>(null);
  const [enrollingEventId, setEnrollingEventId] = useState<string | null>(null);

  // Refresh trigger for synchronizing after manual user actions
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Sequential API calls & Master Catalog Sync:
  // Fetches /api/event to maintain full metadata for all events, preventing any enrolled events from losing their details.
  // 1. Call GET /api/enrollement/enrolled-event (paid events)
  // 2. Call GET /api/enrollement/enroll-event (available & unpaid reservations)
  useEffect(() => {
    let active = true;

    async function syncEnrollmentData() {
      try {
        // Fetch all events from /api/event to maintain a master catalog with complete details
        const allEventsRes = await fetch('/api/event', {
          method: 'GET',
          cache: 'no-store',
        });
        const allEventsJson = await allEventsRes.json().catch(() => null);

        let masterCatalog: SerializedEvent[] = availableEvents;
        if (allEventsRes.ok && Array.isArray(allEventsJson?.data) && allEventsJson.data.length > 0) {
          masterCatalog = (allEventsJson.data as Record<string, unknown>[]).map((e) => ({
            _id: String(e._id),
            title: String(e.title || ''),
            short_description: e.short_description ? String(e.short_description) : undefined,
            long_description: e.long_description ? String(e.long_description) : undefined,
            venue: e.venue ? String(e.venue) : undefined,
            date_time: e.date_time ? String(e.date_time) : undefined,
            image_url: e.image_url ? String(e.image_url) : undefined,
            entry_fee: typeof e.entry_fee === 'number' ? e.entry_fee : undefined,
            participants_type: (e.participants_type as 'individual' | 'team') ?? undefined,
            team_size: typeof e.team_size === 'number' ? e.team_size : undefined,
            min_team_size: typeof e.min_team_size === 'number' ? e.min_team_size : undefined,
            max_team_size: typeof e.max_team_size === 'number' ? e.max_team_size : undefined,
            category: e.category ? String(e.category) : undefined,
          }));
          if (active) {
            setEventsList(masterCatalog);
          }
        }

        // --- Call 1: GET /api/enrollement/enrolled-event (paid events & user) ---
        const paidRes = await fetch('/api/enrollement/enrolled-event', {
          method: 'GET',
          cache: 'no-store',
        });
        const paidJson = await paidRes.json().catch(() => null);

        if (paidJson?.redirect && paidJson?.redirectUrl) {
          router.push(paidJson.redirectUrl);
          return;
        }

        if (paidRes.ok && paidJson?.data?.paidEvents && active) {
          const rawPaidInd = (paidJson.data.paidEvents.individualEvents || []) as Record<string, unknown>[];
          const rawPaidTm = (paidJson.data.paidEvents.teamEvents || []) as Record<string, unknown>[];

          setIndividualPaid(
            rawPaidInd.map((doc) => {
              const eventId = String(doc.event_id);
              const matched = masterCatalog.find((m) => m._id === eventId);
              return {
                _id: String(doc._id),
                event_id: eventId,
                event_title: matched?.title || (doc.event_title ? String(doc.event_title) : 'Enrolled Event'),
                participation_type: 'individual' as const,
                event_details: matched || (doc.event_details as SerializedEvent | undefined) || null,
              };
            })
          );

          setTeamPaid(
            rawPaidTm.map((doc) => {
              const eventId = String(doc.event_id);
              const matched = masterCatalog.find((m) => m._id === eventId);
              const teamEmails = Array.isArray(doc.team_emails) ? (doc.team_emails as string[]) : [];
              return {
                _id: String(doc._id),
                event_id: eventId,
                event_title: matched?.title || (doc.event_title ? String(doc.event_title) : 'Team Competition'),
                participation_type: 'team' as const,
                team_name: doc.team_name ? String(doc.team_name) : null,
                team_leader_email: userEmail,
                team_size: typeof doc.team_length === 'number' ? doc.team_length : teamEmails.length + 1,
                team_members: teamEmails,
                event_details: matched || (doc.event_details as SerializedEvent | undefined) || null,
              };
            })
          );
        }

        // --- Call 2: GET /api/enrollement/enroll-event (available & pending reservations) ---
        const enrollRes = await fetch('/api/enrollement/enroll-event', {
          method: 'GET',
          cache: 'no-store',
        });
        const enrollJson = await enrollRes.json().catch(() => null);

        if (enrollJson?.redirect && enrollJson?.redirectUrl) {
          router.push(enrollJson.redirectUrl);
          return;
        }

        if (enrollRes.ok && enrollJson?.data?.enrollUserEvents && active) {
          const rawPendingInd = (enrollJson.data.enrollUserEvents.individualEvents || []) as Record<string, unknown>[];
          const rawPendingTm = (enrollJson.data.enrollUserEvents.teamEvents || []) as Record<string, unknown>[];

          setPendingIndividual(
            rawPendingInd.map((doc) => {
              const eventId = String(doc.event_id);
              const matched = masterCatalog.find((m) => m._id === eventId);
              return {
                _id: String(doc._id),
                event_id: eventId,
                event_title: matched?.title || 'Reserved Event',
                participation_type: 'individual' as const,
                event_details: matched || null,
              };
            })
          );

          setPendingTeam(
            rawPendingTm.map((doc) => {
              const eventId = String(doc.event_id);
              const matched = masterCatalog.find((m) => m._id === eventId);
              const teamEmails = Array.isArray(doc.team_emails) ? (doc.team_emails as string[]) : [];
              return {
                _id: String(doc._id),
                event_id: eventId,
                event_title: matched?.title || 'Reserved Team Event',
                participation_type: 'team' as const,
                team_name: doc.team_name ? String(doc.team_name) : null,
                team_leader_email: userEmail,
                team_size: typeof doc.team_length === 'number' ? doc.team_length : teamEmails.length + 1,
                team_members: teamEmails,
                event_details: matched || null,
              };
            })
          );
        }
      } catch (err) {
        console.warn('Sequential enrollment data load warning:', err);
      }
    }

    syncEnrollmentData();

    return () => {
      active = false;
    };
  }, [availableEvents, refreshTrigger, router, userEmail]);

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
    ...individualPaid.map((e) => e.event_id),
    ...teamPaid.map((e) => e.event_id),
    ...pendingIndividual.map((e) => e.event_id),
    ...pendingTeam.map((e) => e.event_id),
  ]);

  const eligibleIndividualEvents = eventsList.filter(
    (ev) =>
      ev.participants_type === 'individual' &&
      (ev.entry_fee || 0) > 0 &&
      !alreadyEnrolledIds.has(ev._id) &&
      !selectedIndividualIds.includes(ev._id)
  );

  const eligibleTeamEvents = eventsList.filter(
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
    setSelectedTeamEvents((prev) => [
      ...prev,
      { eventId, teamName: '', teamMembers: [], verifiedDetails: [] },
    ]);
    setPendingMemberEmail((prev) => ({ ...prev, [eventId]: '' }));
    setMemberError((prev) => ({ ...prev, [eventId]: null }));
    setFeedbackError(null);
  };

  const handleRemoveTeam = (eventId: string) => {
    setSelectedTeamEvents((prev) => prev.filter((t) => t.eventId !== eventId));
    setPendingMemberEmail((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
    setMemberError((prev) => {
      const next = { ...prev };
      delete next[eventId];
      return next;
    });
  };

  const updateTeamName = (eventId: string, name: string) => {
    setSelectedTeamEvents((prev) =>
      prev.map((t) => (t.eventId === eventId ? { ...t, teamName: name } : t))
    );
  };

  // Progressive Teammate Verification: Verify email & add to squad
  const handleVerifyAndAddMember = async (eventId: string) => {
    const rawEmail = pendingMemberEmail[eventId] || '';
    const email = rawEmail.trim().toLowerCase();
    setMemberError((prev) => ({ ...prev, [eventId]: null }));

    if (!email) {
      setMemberError((prev) => ({ ...prev, [eventId]: 'Please enter a teammate email.' }));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMemberError((prev) => ({ ...prev, [eventId]: 'Please enter a valid email format.' }));
      return;
    }

    if (email === userEmail.toLowerCase()) {
      setMemberError((prev) => ({
        ...prev,
        [eventId]: 'You are already registered as Team Leader. Enter your teammate’s email.',
      }));
      return;
    }

    const currentTeam = selectedTeamEvents.find((t) => t.eventId === eventId);
    if (currentTeam?.teamMembers.includes(email)) {
      setMemberError((prev) => ({
        ...prev,
        [eventId]: 'This teammate is already added to this squad.',
      }));
      return;
    }

    const ev = eventsList.find((e) => e._id === eventId);
    const maxTeammates = Math.max(0, (ev?.max_team_size ?? ev?.team_size ?? 1) - 1);
    if (maxTeammates === 0) {
      setMemberError((prev) => ({
        ...prev,
        [eventId]: 'This is a solo team event. The team leader is the only squad member.',
      }));
      return;
    }

    if ((currentTeam?.teamMembers.length || 0) >= maxTeammates) {
      setMemberError((prev) => ({
        ...prev,
        [eventId]: `Maximum squad limit (${ev?.max_team_size || ev?.team_size || 1} members including leader) reached.`,
      }));
      return;
    }

    setVerifyingMember((prev) => ({ ...prev, [eventId]: true }));

    try {
      const res = await fetch('/api/enrollement/check-team-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await res.json().catch(() => null);

      if (res.ok && res.status === 200) {
        const verifiedInfo: VerifiedMember = {
          email,
          name: email.split('@')[0],
        };

        setSelectedTeamEvents((prev) =>
          prev.map((t) => {
            if (t.eventId !== eventId) return t;
            return {
              ...t,
              teamMembers: [...t.teamMembers, verifiedInfo.email],
              verifiedDetails: [...(t.verifiedDetails || []), verifiedInfo],
            };
          })
        );

        // Clear input for the next member
        setPendingMemberEmail((prev) => ({ ...prev, [eventId]: '' }));
        setMemberError((prev) => ({ ...prev, [eventId]: null }));
      } else {
        if (result?.redirect && result?.redirectUrl) {
          router.push(result.redirectUrl);
          return;
        }
        setMemberError((prev) => ({
          ...prev,
          [eventId]:
            result?.message ||
            result?.error ||
            'Team member check failed. Please ensure the member has registered and paid for their pass.',
        }));
      }
    } catch {
      setMemberError((prev) => ({
        ...prev,
        [eventId]: 'Failed to verify member. Please check your connection.',
      }));
    } finally {
      setVerifyingMember((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  const handleRemoveVerifiedMember = (eventId: string, memberEmail: string) => {
    setSelectedTeamEvents((prev) =>
      prev.map((t) => {
        if (t.eventId !== eventId) return t;
        return {
          ...t,
          teamMembers: t.teamMembers.filter((em) => em !== memberEmail),
          verifiedDetails: (t.verifiedDetails || []).filter((m) => m.email !== memberEmail),
        };
      })
    );
    setMemberError((prev) => ({ ...prev, [eventId]: null }));
  };

  // Fee calculation
  const selectedIndividualEventObjects = selectedIndividualIds
    .map((id) => eventsList.find((e) => e._id === id))
    .filter(Boolean) as SerializedEvent[];

  const selectedTeamEventObjects = selectedTeamEvents
    .map((t) => ({
      ...t,
      event: eventsList.find((e) => e._id === t.eventId),
    }))
    .filter((item) => Boolean(item.event));

  const pendingIndividualFee = pendingIndividual.reduce(
    (acc, item) => acc + (item.event_details?.entry_fee || 0),
    0
  );
  const pendingTeamFee = pendingTeam.reduce(
    (acc, item) => acc + (item.event_details?.entry_fee || 0),
    0
  );
  const stagedIndividualFee = selectedIndividualEventObjects.reduce(
    (acc, e) => acc + (e.entry_fee || 0),
    0
  );
  const stagedTeamFee = selectedTeamEventObjects.reduce(
    (acc, t) => acc + (t.event?.entry_fee || 0),
    0
  );

  const totalFee =
    pendingIndividualFee + pendingTeamFee + stagedIndividualFee + stagedTeamFee;
  const totalSelectedCount =
    pendingIndividual.length +
    pendingTeam.length +
    selectedIndividualIds.length +
    selectedTeamEvents.length;

  // Delete an existing unpaid enrolled reservation
  const handleDeleteEnrolled = async (
    enrolledEventId: string,
    eventId: string,
    type: 'individual' | 'team',
  ) => {
    setDeletingEnrollId(enrolledEventId);
    setFeedbackError(null);
    setFeedbackSuccess(null);
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
        setFeedbackSuccess('Event reservation cancelled. Available again in catalogue.');
      } else {
        if (data?.redirect && data?.redirectUrl) {
          router.push(data.redirectUrl);
          return;
        }
        setFeedbackError(data?.message || data?.error || 'Failed to cancel reservation.');
      }
    } catch {
      setFeedbackError('Network error while cancelling reservation.');
    } finally {
      setDeletingEnrollId(null);
    }
  };

  // Enroll single individual event immediately
  const handleEnrollSingleIndividual = async (eventId: string) => {
    setEnrollingEventId(eventId);
    setFeedbackError(null);
    setFeedbackSuccess(null);
    try {
      const res = await fetch('/api/enrollement/enroll-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setSelectedIndividualIds((prev) => prev.filter((id) => id !== eventId));
        setFeedbackSuccess('Individual event reserved! Added to Selected Events (not paid).');
        setRefreshTrigger((v) => v + 1);
      } else {
        if (data?.redirect && data?.redirectUrl) {
          router.push(data.redirectUrl);
          return;
        }
        setFeedbackError(data?.message || data?.error || 'Failed to enroll in event.');
      }
    } catch {
      setFeedbackError('Network error while enrolling.');
    } finally {
      setEnrollingEventId(null);
    }
  };

  // Enroll single team event immediately
  const handleEnrollSingleTeam = async (eventId: string) => {
    const teamItem = selectedTeamEvents.find((t) => t.eventId === eventId);
    if (!teamItem) return;

    const eventObj = eventsList.find((e) => e._id === eventId);
    if (!teamItem.teamName.trim()) {
      setFeedbackError(`Please specify a team name for "${eventObj?.title || 'the team event'}".`);
      return;
    }
    const maxMembers = Math.max(0, (eventObj?.max_team_size ?? eventObj?.team_size ?? 1) - 1);
    const minMembers = Math.max(0, (eventObj?.min_team_size ?? 1) - 1);
    if (maxMembers > 0 && teamItem.teamMembers.length < minMembers) {
      setFeedbackError(
        `"${eventObj?.title || 'Team event'}" requires at least ${minMembers} registered teammate(s). Currently added: ${teamItem.teamMembers.length}.`
      );
      return;
    }

    setEnrollingEventId(eventId);
    setFeedbackError(null);
    setFeedbackSuccess(null);
    try {
      const teamEmails = teamItem.teamMembers.filter((m) => m.trim() !== '');
      const res = await fetch('/api/enrollement/enroll-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId,
          teamName: teamItem.teamName.trim(),
          teamEmails,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        handleRemoveTeam(eventId);
        setFeedbackSuccess('Team event reserved! Added to Selected Events (not paid).');
        setRefreshTrigger((v) => v + 1);
      } else {
        if (data?.redirect && data?.redirectUrl) {
          router.push(data.redirectUrl);
          return;
        }
        setFeedbackError(data?.message || data?.error || 'Failed to enroll team in event.');
      }
    } catch {
      setFeedbackError('Network error while enrolling team.');
    } finally {
      setEnrollingEventId(null);
    }
  };

  // Checkout submission
  // The backend route handles ONE event per POST call, so we make sequential requests.
  const handleProceedToCheckout = async () => {
    setFeedbackError(null);
    setFeedbackSuccess(null);

    // Allow checkout if either new events are staged OR existing pending reservations exist
    const hasStaged = selectedIndividualIds.length > 0 || selectedTeamEvents.length > 0;
    const hasPendingReservations = pendingIndividual.length > 0 || pendingTeam.length > 0;

    if (!hasStaged && !hasPendingReservations) {
      setFeedbackError('Please select at least one event from the catalog.');
      return;
    }

    // If user has pending reservations but hasn't staged new events, go straight to checkout
    if (!hasStaged && hasPendingReservations) {
      router.push('/register/checkout-event');
      return;
    }

    // Validate team selections before hitting the network
    for (const teamItem of selectedTeamEvents) {
      const eventObj = eventsList.find((e) => e._id === teamItem.eventId);
      if (!teamItem.teamName.trim()) {
        setFeedbackError(`Please specify a team name for "${eventObj?.title || 'the team event'}".`);
        return;
      }
      const maxMembers = Math.max(0, (eventObj?.max_team_size ?? eventObj?.team_size ?? 1) - 1);
      const minMembers = Math.max(0, (eventObj?.min_team_size ?? 1) - 1);
      if (maxMembers > 0 && teamItem.teamMembers.length < minMembers) {
        setFeedbackError(
          `"${eventObj?.title || 'Team event'}" requires at least ${minMembers} registered teammate(s). Currently added: ${teamItem.teamMembers.length}.`
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
          if (data?.redirect && data?.redirectUrl) {
            router.push(data.redirectUrl);
            return;
          }
          setFeedbackError(data?.message || data?.error || 'Failed to enroll in an individual event.');
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
          if (data?.redirect && data?.redirectUrl) {
            router.push(data.redirectUrl);
            return;
          }
          setFeedbackError(data?.message || data?.error || 'Failed to enroll your team in an event.');
          setSubmitting(false);
          return;
        }
      }

      setFeedbackSuccess('Enrolment recorded successfully! Redirecting to checkout...');
      setTimeout(() => {
        router.push('/register/checkout-event');
      }, 700);
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

        {individualPaid.length === 0 ? (
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
            {individualPaid.map((enrolled) => {
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
            {teamPaid.length} PAID
          </span>
        </div>

        {teamPaid.length === 0 ? (
          <div className="w-full p-6 sm:p-8 rounded-2xl border border-white/[0.08] bg-[#07090E] text-zinc-500 font-mono text-xs sm:text-sm text-center">
            No paid team events yet. Register your team below.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {teamPaid.map((teamEvent) => {
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
                  {/* --- SECTION 1: Active Enrolled Reservations (Unpaid) from /api/enrollement/enroll-event --- */}
                  {(pendingIndividual.length > 0 || pendingTeam.length > 0) && (
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center justify-between px-1 pt-1 border-b border-amber-500/20 pb-1.5">
                        <span className="font-mono text-[11px] font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Enrolled Reservations (Not Paid)
                        </span>
                        <span className="text-[10px] font-mono text-amber-300/80 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          {pendingIndividual.length + pendingTeam.length} Active
                        </span>
                      </div>

                      {/* Enrolled Individual Reservations */}
                      {pendingIndividual.map((item) => (
                        <div
                          key={item._id}
                          className="rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-3.5 flex flex-col gap-2"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-subheading font-medium text-sm text-white truncate">
                                  {item.event_title}
                                </h4>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase font-semibold">
                                  RESERVED (NOT PAID)
                                </span>
                              </div>
                              <span className="text-xs font-mono text-zinc-400">
                                {item.event_details?.venue || 'ISL Campus'} • {item.event_details?.date_time || 'Schedule TBA'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-mono font-bold text-emerald-400">
                                {item.event_details?.entry_fee ? `₹${item.event_details.entry_fee}` : 'FREE'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteEnrolled(item._id, item.event_id, 'individual')}
                                disabled={deletingEnrollId === item._id}
                                aria-label={`Cancel reservation for ${item.event_title}`}
                                title="Cancel reservation"
                                className="p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {deletingEnrollId === item._id ? (
                                  <span className="w-4 h-4 block border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Enrolled Team Reservations */}
                      {pendingTeam.map((item) => (
                        <div
                          key={item._id}
                          className="rounded-xl border border-amber-500/30 bg-amber-500/[0.04] p-3.5 flex flex-col gap-2.5"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-subheading font-medium text-sm text-white truncate">
                                  {item.event_title}
                                </h4>
                                <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 uppercase font-semibold">
                                  TEAM RESERVED (NOT PAID)
                                </span>
                              </div>
                              <span className="text-xs font-mono text-zinc-400">
                                {item.event_details?.venue || 'ISL Campus'} • {item.event_details?.date_time || 'Schedule TBA'}
                              </span>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-xs font-mono font-bold text-emerald-400">
                                {item.event_details?.entry_fee ? `₹${item.event_details.entry_fee}` : 'FREE'}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteEnrolled(item._id, item.event_id, 'team')}
                                disabled={deletingEnrollId === item._id}
                                aria-label={`Cancel reservation for ${item.event_title}`}
                                title="Cancel team reservation"
                                className="p-1 rounded-md text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer disabled:opacity-50"
                              >
                                {deletingEnrollId === item._id ? (
                                  <span className="w-4 h-4 block border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Team Details Summary */}
                          <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-1.5 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] text-zinc-400">Team Name:</span>
                              <span className="font-medium text-white">{item.team_name || 'Squad'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[11px] text-zinc-400">Team Leader:</span>
                              <span className="font-mono text-zinc-300 text-[11px]">{item.team_leader_email || userEmail}</span>
                            </div>
                            {item.team_members && item.team_members.length > 0 && (
                              <div className="flex flex-col gap-1 pt-1">
                                <span className="font-mono text-[10px] text-zinc-400 uppercase">Teammates ({item.team_members.length}):</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {item.team_members.map((email) => (
                                    <span key={email} className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-[10px] font-mono text-zinc-300">
                                      {email}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* --- SECTION 2: Newly Staged Events (Selected from Catalog, Ready to Enroll) --- */}
                  {(selectedIndividualIds.length > 0 || selectedTeamEvents.length > 0) && (
                    <div className="flex flex-col gap-2.5 pt-1">
                      <div className="flex items-center justify-between px-1 border-b border-white/[0.08] pb-1.5">
                        <span className="font-mono text-[11px] font-semibold text-[#FF8833] uppercase tracking-wider flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6A00]" />
                          Newly Selected (Ready to Enroll)
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.08]">
                          {selectedIndividualIds.length + selectedTeamEvents.length} Staged
                        </span>
                      </div>

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

                          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                            <span className="text-[11px] font-mono text-zinc-500">Staged (Not yet enrolled)</span>
                            <button
                              type="button"
                              onClick={() => handleEnrollSingleIndividual(ev._id)}
                              disabled={enrollingEventId === ev._id}
                              className="px-2.5 py-1 rounded bg-[#FF6A00]/20 hover:bg-[#FF6A00]/30 border border-[#FF6A00]/50 text-[#FF8833] hover:text-white font-mono text-[11px] uppercase tracking-wider font-medium cursor-pointer transition-colors disabled:opacity-50"
                            >
                              {enrollingEventId === ev._id ? 'Enrolling...' : 'Enroll Event →'}
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Selected Team Events with Squad Setup Fields */}
                      {selectedTeamEvents.map((tItem) => {
                        const ev = eventsList.find((e) => e._id === tItem.eventId);
                        if (!ev) return null;

                        const maxTeammates = Math.max(0, (ev.max_team_size ?? ev.team_size ?? 1) - 1);
                        const minTeammates = Math.max(0, (ev.min_team_size ?? 1) - 1);

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

                              {/* Squad Members: Progressive Verification */}
                              {maxTeammates === 0 ? (
                                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300 flex items-center gap-2">
                                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
                                    ✓
                                  </span>
                                  <span>
                                    Solo Team Event • Team limit is 1 (Team Leader is the only squad member).
                                  </span>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2 pt-1">
                                  <div className="flex items-center justify-between">
                                    <label className="font-mono text-[10px] uppercase text-zinc-400">
                                      Team Members ({tItem.teamMembers.length} verified • Min {minTeammates} required)
                                    </label>
                                    <span className="text-[10px] font-mono text-zinc-500">
                                      Max {maxTeammates} Teammates
                                    </span>
                                  </div>

                                  {/* Verified Members List */}
                                  {(tItem.verifiedDetails || []).map((m, mIdx) => (
                                    <div
                                      key={m.email}
                                      className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs"
                                    >
                                      <div className="flex items-center gap-2 min-w-0 pr-2">
                                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[11px] font-bold shrink-0">
                                          ✓
                                        </span>
                                        <div className="flex flex-col min-w-0">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className="text-white font-medium text-xs">
                                              Team Member - {mIdx + 1}:
                                            </span>
                                            <span className="text-emerald-300 font-medium truncate">
                                              {m.name || 'Registered Attendee'}
                                            </span>
                                          </div>
                                          <span className="text-zinc-400 font-mono text-[11px] truncate">
                                            {m.email}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase font-semibold">
                                          VERIFIED
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveVerifiedMember(tItem.eventId, m.email)}
                                          aria-label={`Remove ${m.name || m.email}`}
                                          className="p-1 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors cursor-pointer"
                                        >
                                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                          </svg>
                                        </button>
                                      </div>
                                    </div>
                                  ))}

                                  {/* Progressive Input for Next Team Member with + (Verify) button */}
                                  {tItem.teamMembers.length < maxTeammates ? (
                                    <div className="flex flex-col gap-1 pt-0.5">
                                      <label className="font-mono text-[10px] uppercase text-zinc-400">
                                        Add Team Member - {tItem.teamMembers.length + 1} (Must be registered)
                                      </label>
                                      <div className="flex items-center gap-2">
                                        <input
                                          type="email"
                                          value={pendingMemberEmail[tItem.eventId] || ''}
                                          onChange={(e) => {
                                            setPendingMemberEmail((prev) => ({
                                              ...prev,
                                              [tItem.eventId]: e.target.value,
                                            }));
                                            if (memberError[tItem.eventId]) {
                                              setMemberError((prev) => ({
                                                ...prev,
                                                [tItem.eventId]: null,
                                              }));
                                            }
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              e.preventDefault();
                                              handleVerifyAndAddMember(tItem.eventId);
                                            }
                                          }}
                                          disabled={verifyingMember[tItem.eventId]}
                                          placeholder={`Enter Team Member - ${tItem.teamMembers.length + 1} email`}
                                          className="flex-1 bg-black/60 text-white font-mono text-xs px-3 py-2 rounded-lg border border-white/[0.12] focus:border-[#FF6A00] focus:outline-none disabled:opacity-50"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => handleVerifyAndAddMember(tItem.eventId)}
                                          disabled={
                                            verifyingMember[tItem.eventId] ||
                                            !(pendingMemberEmail[tItem.eventId] || '').trim()
                                          }
                                          title={`Verify & Add Team Member - ${tItem.teamMembers.length + 1}`}
                                          className="h-8.5 px-3 rounded-lg border border-[#FF6A00]/70 bg-[#FF6A00]/20 hover:bg-[#FF6A00] text-white font-bold text-sm flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                                        >
                                          {verifyingMember[tItem.eventId] ? (
                                            <svg className="animate-spin w-4 h-4 text-[#FF6A00]" fill="none" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                            </svg>
                                          ) : (
                                            <span className="text-base leading-none font-bold">+</span>
                                          )}
                                        </button>
                                      </div>

                                      {memberError[tItem.eventId] && (
                                        <p className="text-[11px] font-mono text-red-400 px-1 pt-0.5">
                                          {memberError[tItem.eventId]}
                                        </p>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] font-mono text-zinc-500 text-center">
                                      Maximum squad limit reached for this event.
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                                <span className="text-[11px] font-mono text-zinc-500">Staged (Not yet enrolled)</span>
                                <button
                                  type="button"
                                  onClick={() => handleEnrollSingleTeam(tItem.eventId)}
                                  disabled={enrollingEventId === tItem.eventId}
                                  className="px-2.5 py-1 rounded bg-[#FF6A00]/20 hover:bg-[#FF6A00]/30 border border-[#FF6A00]/50 text-[#FF8833] hover:text-white font-mono text-[11px] uppercase tracking-wider font-medium cursor-pointer transition-colors disabled:opacity-50"
                                >
                                  {enrollingEventId === tItem.eventId ? 'Enrolling Squad...' : 'Enroll Squad →'}
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                  {submitting
                    ? 'Processing Enrolment...'
                    : selectedIndividualIds.length > 0 || selectedTeamEvents.length > 0
                    ? 'Enroll & Proceed To Check Out'
                    : 'Proceed To Check Out'}
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
