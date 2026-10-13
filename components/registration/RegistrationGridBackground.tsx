import React from 'react';

/**
 * RegistrationGridBackground
 * Renders the wireframe's signature subtle gray grid background ("BG - grid")
 * over a pure black canvas with a soft radial falloff.
 */
export default function RegistrationGridBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none select-none z-0 overflow-hidden bg-black"
      aria-hidden="true"
    >
      {/* Subtle Gray Square Grid */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          maskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, rgba(0, 0, 0, 0.4) 80%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 50% 50%, black 50%, rgba(0, 0, 0, 0.4) 80%, transparent 100%)',
        }}
      />

      {/* Gentle center atmospheric lift */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 45%, rgba(255, 106, 0, 0.04) 0%, transparent 65%)',
        }}
      />
    </div>
  );
}
