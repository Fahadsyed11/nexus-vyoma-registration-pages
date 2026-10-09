import React from "react";

/**
 * Visual Textures & Atmospheric Background Elements
 * Matching Section 7 of the Brand Style Guide (Gradient Waves, Light Glows, Diagonal Streaks)
 */
export function CosmicBackground({ className = "" }: { className?: string }) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-[#000000] ${className}`}
      aria-hidden="true"
    >
      {/* Top-Left Fiery Cosmic Nebula Glow */}
      <div className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-br from-[#D8182B]/35 via-[#FF6A00]/20 to-transparent blur-[120px]" />

      {/* Center-Right Electric Blue Nebula Glow */}
      <div className="absolute top-[30%] -right-[15%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full bg-gradient-to-bl from-[#0066FF]/30 via-[#7B2CFF]/20 to-transparent blur-[140px]" />

      {/* Bottom-Center Crimson-Orange Atmospheric Glow */}
      <div className="absolute -bottom-[20%] left-[20%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full bg-gradient-to-t from-[#B80F1F]/30 via-[#FF6A00]/15 to-transparent blur-[150px]" />

      {/* 45-Degree Laser Diagonal Streak (Electric Blue / Fiery Red) */}
      <div className="absolute top-0 right-1/4 w-[2px] h-[150%] rotate-[35deg] bg-gradient-to-b from-transparent via-[#FF6A00]/30 to-transparent opacity-40 blur-[1px]" />
      <div className="absolute -top-1/4 left-1/3 w-[1px] h-[150%] rotate-[35deg] bg-gradient-to-b from-transparent via-[#0066FF]/30 to-transparent opacity-30 blur-[1px]" />

      {/* Subtle Noise / Dark Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />
    </div>
  );
}

export default CosmicBackground;
