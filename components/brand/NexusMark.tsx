import React from "react";

interface NexusMarkProps {
  className?: string;
  size?: number | string;
  withGlow?: boolean;
}

/**
 * Official Nexus Vyoma Symbol / Mark
 * Precision 3-tier segmented diagonal X with white orbit loop and 4-point star spark.
 */
export function NexusMark({
  className = "",
  size = 120,
  withGlow = true,
}: NexusMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${withGlow ? "drop-shadow-[0_0_24px_rgba(255,106,0,0.45)]" : ""} ${className}`}
      aria-label="Nexus Vyoma Official Symbol"
      role="img"
    >
      <defs>
        {/* Tier 1: Crimson Red Gradient */}
        <linearGradient id="nvCrimsonTier" x1="80" y1="90" x2="160" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D8182B" />
          <stop offset="100%" stopColor="#9C0B1B" />
        </linearGradient>

        {/* Tier 2: Deep Orange Gradient */}
        <linearGradient id="nvOrangeTier" x1="120" y1="135" x2="190" y2="175" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6A00" />
          <stop offset="100%" stopColor="#E54E00" />
        </linearGradient>

        {/* Tier 3: Golden Amber Gradient */}
        <linearGradient id="nvGoldTier" x1="150" y1="180" x2="230" y2="230" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBB03B" />
          <stop offset="100%" stopColor="#D98A00" />
        </linearGradient>

        {/* Spark Star Radial Glow */}
        <radialGradient id="nvSparkGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
          <stop offset="0%" stopColor="#FFF2D6" />
          <stop offset="40%" stopColor="#FBB03B" />
          <stop offset="100%" stopColor="#FF6A00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Back Orbit Ring (behind the upper-left of X) */}
      <path
        d="M190 92C232 98 258 114 246 138C236 156 206 172 170 181"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.95"
      />
      
      {/* Back Orbit Curve Taper */}
      <path
        d="M175 93C225 100 256 117 246 138C238 154 214 168 184 177C204 168 226 153 234 140C242 124 214 108 175 93Z"
        fill="#FFFFFF"
      />

      {/* SEGMENT 1 (TOP): Crimson Red with curved shoulder */}
      <path
        d="M80 92C92 92 110 92 128 92L160 130H112L80 92Z"
        fill="url(#nvCrimsonTier)"
      />
      {/* Smooth rounded top curve */}
      <path
        d="M80 92C92 92 110 92 128 92C128 92 160 130 160 130H112L80 92Z"
        fill="url(#nvCrimsonTier)"
      />
      <path
        d="M80 92C100 92 128 92 128 92L160 130H112L80 92Z"
        fill="url(#nvCrimsonTier)"
      />

      {/* SEGMENT 2 (MIDDLE): Deep Orange block */}
      <path
        d="M117 134L165 134L192 174L144 174L117 134Z"
        fill="url(#nvOrangeTier)"
      />

      {/* SEGMENT 3 (BOTTOM): Golden Amber block with 45deg cut */}
      <path
        d="M149 178L197 178L232 225H184L149 178Z"
        fill="url(#nvGoldTier)"
      />

      {/* Front Orbit Ring (looping in front and swooping around) */}
      <path
        d="M246 138C222 178 152 208 86 218C68 221 68 206 90 196C138 174 188 144 220 118C236 106 248 112 246 138Z"
        fill="#FFFFFF"
        opacity="0.98"
      />

      {/* Orbit Left Crescent Flurry */}
      <path
        d="M72 221C116 214 165 190 205 160C155 186 104 206 72 221Z"
        fill="#FFFFFF"
      />

      {/* 4-Point Golden Star Spark on right */}
      <g transform="translate(216, 146)">
        <circle cx="16" cy="16" r="18" fill="url(#nvSparkGlow)" opacity="0.6" />
        <path
          d="M16 0C16 10 16 16 6 16C16 16 16 22 16 32C16 22 16 16 26 16C16 16 16 10 16 0Z"
          fill="#FBB03B"
        />
        <circle cx="16" cy="16" r="2.5" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export default NexusMark;
