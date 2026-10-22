'use client';

import React, { useEffect, useState } from 'react';
import OrganizerProfile from './OrganizerProfile';
import OrganizersTitleRolling from './OrganizersTitleRolling';
import {
  DbOrganizerMember,
  groupMembersByHierarchy,
} from '@/lib/data/organizersData';

interface OrganizersViewProps {
  initialMembers?: DbOrganizerMember[];
}

export default function OrganizersView({ initialMembers = [] }: OrganizersViewProps) {
  const [members, setMembers] = useState<DbOrganizerMember[]>(initialMembers);

  // Live client-side fetch from /api/organizer-member
  useEffect(() => {
    let isMounted = true;
    fetch('/api/organizer-member')
      .then((res) => res.json())
      .then((json) => {
        if (isMounted && Array.isArray(json?.data) && json.data.length > 0) {
          setMembers(json.data);
        }
      })
      .catch(() => {
        // Fall back gracefully to initialMembers
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const groupedSections = groupMembersByHierarchy(members);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-white font-sans">
      {/* 01 — Editorial Page Introduction */}
      <header className="w-full text-left pt-2 pb-6 sm:pb-8">
        <OrganizersTitleRolling className="my-1 sm:my-2" />

        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
          Meet the minds, mentors, and teams bringing Nexus Vyoma to life.
        </p>

        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
          <span>17.38405° N / 78.45636° E</span>
          <span className="text-zinc-600">—</span>
          <span>ISL ENGINEERING COLLEGE, HYDERABAD</span>
        </div>
      </header>

      {/* 02 — Role Hierarchy Sections (Dynamic from /api/organizer-member) */}
      <div className="w-full flex flex-col items-center">
        {groupedSections.map(({ section, members: sectionMembers }, index) => {
          const isSingle = sectionMembers.length === 1;

          return (
            <React.Fragment key={section.id}>
              {/* Thin hairline section divider */}
              {index > 0 && (
                <div className="w-full border-t border-zinc-800/80 my-8 sm:my-12" />
              )}

              <section
                aria-label={section.title}
                className="w-full flex flex-col items-center"
              >
                {/* Section Header: Centered across all sections */}
                <div className="w-full flex items-center justify-center pb-6 sm:pb-8 text-center">
                  <h2 className="font-[family-name:var(--font-barlow-condensed)] tracking-[0.2em] text-lg sm:text-xl md:text-2xl font-bold uppercase text-zinc-100">
                    {section.title}
                  </h2>
                </div>

                {/* Member Portraits: Centered if 1 member, centered wrapping flex row if multiple */}
                <div
                  className={`w-full flex flex-wrap justify-center items-start ${
                    isSingle
                      ? 'gap-0'
                      : 'gap-x-6 sm:gap-x-10 md:gap-x-12 gap-y-8 sm:gap-y-10'
                  }`}
                >
                  {sectionMembers.map((member, mIdx) => (
                    <OrganizerProfile
                      key={member._id || `${section.id}-${mIdx}`}
                      name={member.name}
                      title={member.title}
                      role={member.role}
                      imageUrl={member.profile_image}
                      socials={{
                        instagram: member.instagram,
                        linkedin: member.linkedin,
                      }}
                      size={section.size}
                      priority={section.id === 'chief-patron'}
                      isTechTeam={section.id === 'tech-team'}
                    />
                  ))}
                </div>
              </section>
            </React.Fragment>
          );
        })}
      </div>

      {/* 03 — Editorial Bottom Notes */}
      <div className="w-full border-t border-zinc-900/90 mt-12 sm:mt-16 pt-6 sm:pt-8 pb-4 text-left">
        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          NEXUS VYOMA • CULTURE • TECHNOLOGY
        </p>
        <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-1">
          Nexus VYOMA is a three-day inter-college fest of ISL Engineering College,
          Hyderabad, bringing together a vibrant audience, creators, innovators and
          communities from across colleges for an unforgettable celebration of technology,
          creativity, entertainment, culture and collaboration.
        </p>
      </div>
    </div>
  );
}
