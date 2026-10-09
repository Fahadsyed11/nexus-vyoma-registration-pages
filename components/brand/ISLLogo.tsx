import React from "react";

interface ISLLogoProps {
  className?: string;
  size?: number | string;
  layout?: "vertical" | "horizontal";
  textColor?: string;
  crestColor?: string;
}

/**
 * Official ISL Engineering College Logo
 * Geometric lime-green crest + Indigo Blue institutional typography.
 */
export function ISLLogo({
  className = "",
  size = 64,
  layout = "vertical",
  textColor = "#3B49DF",
  crestColor = "#98D800",
}: ISLLogoProps) {
  const isVertical = layout === "vertical";

  return (
    <div
      className={`inline-flex items-center select-none ${
        isVertical ? "flex-col text-center" : "flex-row gap-3 text-left"
      } ${className}`}
      role="img"
      aria-label="ISL Engineering College"
    >
      {/* Geometric Lime Green Crest */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0 drop-shadow-[0_0_12px_rgba(152,216,0,0.35)]"
      >
        {/* Apex Circle */}
        <circle cx="80" cy="24" r="16" fill={crestColor} />

        {/* Central Vertical Stem */}
        <rect x="74" y="44" width="12" height="76" fill={crestColor} rx="2" />

        {/* Left Upper Wing */}
        <polygon points="68,44 24,104 68,104" fill={crestColor} />

        {/* Right Upper Wing */}
        <polygon points="92,44 136,104 92,104" fill={crestColor} />

        {/* Lower Left Chevron Wing */}
        <polygon points="20,126 56,126 80,82 66,74 20,126" fill={crestColor} />

        {/* Lower Right Chevron Wing */}
        <polygon points="140,126 104,126 80,82 94,74 140,126" fill={crestColor} />

        {/* Bottom Horizontal Base Plate */}
        <polygon points="16,132 144,132 80,120" fill={crestColor} opacity="0.9" />
      </svg>

      {/* Typography */}
      <div className={`flex flex-col leading-none ${isVertical ? "mt-2" : ""}`}>
        <span
          className="font-black tracking-wider text-xl md:text-2xl"
          style={{ color: textColor }}
        >
          ISL
        </span>
        <span
          className="font-bold tracking-widest text-[10px] md:text-xs uppercase mt-0.5"
          style={{ color: textColor }}
        >
          ENGINEERING
        </span>
        <span
          className="font-bold tracking-widest text-[10px] md:text-xs uppercase mt-0.5"
          style={{ color: textColor }}
        >
          COLLEGE
        </span>
      </div>
    </div>
  );
}

export default ISLLogo;
