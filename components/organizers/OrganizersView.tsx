import React from 'react';
import OrganizersSection from './OrganizersSection';
import OrganizersTitleRolling from './OrganizersTitleRolling';
import { organizerSections } from '@/lib/data/organizersData';

export default function OrganizersView() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 text-white font-sans">
      {/* 01 — Editorial Page Introduction */}
      <header className="w-full text-left pt-2 pb-6 sm:pb-8">
        {/* 2-Cycle Rolling Text Display Heading */}
        <OrganizersTitleRolling className="my-1 sm:my-2" />

        {/* Short Editorial Description */}
        <p className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg text-zinc-400 max-w-2xl font-normal leading-relaxed">
          Meet the minds, mentors, and teams bringing Nexus Vyoma to life.
        </p>

        {/* Festival Geolocation & Venue Metadata matching reference */}
        <div className="mt-3 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-mono tracking-widest text-zinc-400 uppercase">
          <span>17.38405° N / 78.45636° E</span>
          <span className="text-zinc-600">—</span>
          <span>ISL ENGINEERING COLLEGE, HYDERABAD</span>
        </div>
      </header>

      {/* 02 — Vertical Stack of Organizer Sections */}
      <div className="w-full flex flex-col items-center">
        {organizerSections.map((section, index) => (
          <OrganizersSection
            key={section.id}
            section={section}
            showDivider={index > 0}
          />
        ))}
      </div>

      {/* 03 — Editorial Bottom Notes (From reference design) */}
      <div className="w-full border-t border-zinc-900/90 mt-8 sm:mt-12 pt-6 sm:pt-8 pb-4 text-left">
        <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-zinc-500">
          NEXUS VYOMA • CULTURE • TECHNOLOGY
        </p>
        <p className="font-sans text-xs sm:text-sm text-zinc-400 mt-1">
Nexus VYOMA is a three-day inter-college fest of ISL Engineering College,
Hyderabad, bringing together a vibrant audience, creators, innovators and
communities from across colleges for an unforgettable celebration of technology,
creativity, entertainment, culture and collaboration. From high-energy performances
and thrilling exhibitions to technical competitions, food experiences and lifestyle
events, Nexus VYOMA offers a dynamic platform for talent, ideas and meaningful
interactions - creating an unmatched college festival experience in the city        </p>
        <p className="font-sans text-[11px] sm:text-xs text-zinc-600 mt-1.5 italic">
          Organiser names and portraits are placeholders. Official details coming soon.
        </p>
      </div>
    </div>
  );
}
