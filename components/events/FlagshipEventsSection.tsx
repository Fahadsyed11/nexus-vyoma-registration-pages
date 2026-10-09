'use client';

import React from 'react';
import FlagshipScrollDeck from './FlagshipScrollDeck';

export default function FlagshipEventsSection() {
  return (
    <section
      id="events"
      className="relative w-full bg-transparent flex flex-col items-center justify-center overflow-visible select-none"
    >
      <FlagshipScrollDeck />
    </section>
  );
}
