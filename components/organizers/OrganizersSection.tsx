import React from 'react';
import OrganizerProfile from './OrganizerProfile';
import { OrganizerSectionConfig } from '@/lib/data/organizersData';

interface OrganizersSectionProps {
  section: OrganizerSectionConfig;
  showDivider?: boolean;
}

export default function OrganizersSection({
  section,
  showDivider = true,
}: OrganizersSectionProps) {
  const { id, number, title, size, members } = section;

  // Determine section-specific container styling with tight, defined gaps
  const renderMembersLayout = () => {
    switch (id) {
      case 'patrons':
      case 'co-patrons':
        return (
          <div className="flex justify-center items-start gap-6 sm:gap-10 md:gap-14">
            {members.map((member) => (
              <OrganizerProfile
                key={member.id}
                name={member.name}
                role={member.role}
                imageUrl={member.imageUrl}
                socials={member.socials}
                size={size}
                priority={id === 'patrons'}
              />
            ))}
          </div>
        );

      case 'board-members':
        // Dynamically generated wrapping grid: 3x3 layout across tablet & desktop, centers cleanly
        return (
          <div className="flex flex-wrap justify-center items-start gap-x-4 sm:gap-x-8 gap-y-5 sm:gap-y-6 max-w-3xl mx-auto">
            {members.map((member) => (
              <OrganizerProfile
                key={member.id}
                name={member.name}
                role={member.role}
                imageUrl={member.imageUrl}
                socials={member.socials}
                size={size}
              />
            ))}
          </div>
        );

      case 'tech-team':
        // 4 circular portraits in a single desktop row; wraps cleanly on mobile
        return (
          <div className="flex flex-wrap justify-center items-start gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-4 sm:gap-y-6 max-w-4xl mx-auto">
            {members.map((member) => (
              <OrganizerProfile
                key={member.id}
                name={member.name}
                role={member.role}
                imageUrl={member.imageUrl}
                socials={member.socials}
                size={size}
                isTechTeam
              />
            ))}
          </div>
        );

      case 'coordinators':
      default:
        // Same dimensions as others; neatly aligned in 4 columns on desktop, 3 on tablet, 2 on mobile
        return (
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-4 sm:gap-y-6 justify-items-center max-w-4xl mx-auto">
            {members.map((member) => (
              <OrganizerProfile
                key={member.id}
                name={member.name}
                role={member.role}
                imageUrl={member.imageUrl}
                socials={member.socials}
                size={size}
              />
            ))}
          </div>
        );
    }
  };

  return (
    <section id={id} className="w-full relative">
      {/* Thin low-contrast section divider with defined compact spacing */}
      {showDivider && (
        <div className="w-full border-t border-zinc-800/80 my-6 sm:my-8" />
      )}

      {/* Section Header: e.g. "01 — PATRONS" */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <h2 className="font-[family-name:var(--font-barlow-condensed)] tracking-[0.2em] text-sm sm:text-base md:text-lg font-bold uppercase text-zinc-300 text-center">
          {number} — {title}
        </h2>
      </div>

      {/* Profiles Grid / Flex Row */}
      {renderMembersLayout()}
    </section>
  );
}
