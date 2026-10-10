import React from "react";

interface SparkProps {
  className?: string;
  size?: number;
  color?: string;
  glow?: boolean;
}

/**
 * Official 4-point Nexus Star / Spark element
 * Used as accents across posters, headers, and badge flourishes.
 */
export function Spark({
  className = "",
  size = 24,
  color = "#FBB03B",
  glow = true,
}: SparkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block select-none ${glow ? "drop-shadow-[0_0_8px_rgba(251,176,59,0.75)]" : ""} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M12 0C12 7.5 12 12 4.5 12C12 12 12 16.5 12 24C12 16.5 12 12 19.5 12C12 12 12 7.5 12 0Z"
        fill={color}
      />
      <circle cx="12" cy="12" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

export default Spark;
