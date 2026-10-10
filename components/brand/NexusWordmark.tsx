import React from "react";
import { Spark } from "./Spark";

interface NexusWordmarkProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero";
  showSubtitle?: boolean;
  showSparks?: boolean;
}

/**
 * Official Nexus Vyoma Flaming Wordmark
 * Displays the condensed arched title with flame gradient texture and official fest subtitle.
 */
export function NexusWordmark({
  className = "",
  size = "lg",
  showSubtitle = true,
  showSparks = true,
}: NexusWordmarkProps) {
  const sizeStyles = {
    sm: {
      title: "text-2xl md:text-3xl tracking-tight",
      subtitle: "text-[9px] md:text-[10px] tracking-[0.25em]",
      sparkSize: 14,
      gap: "gap-2",
    },
    md: {
      title: "text-4xl md:text-5xl tracking-tight",
      subtitle: "text-xs md:text-sm tracking-[0.3em]",
      sparkSize: 18,
      gap: "gap-3",
    },
    lg: {
      title: "text-5xl md:text-7xl lg:text-8xl tracking-tighter",
      subtitle: "text-xs md:text-sm lg:text-base tracking-[0.35em]",
      sparkSize: 24,
      gap: "gap-4",
    },
    xl: {
      title: "text-6xl md:text-8xl lg:text-9xl tracking-tighter",
      subtitle: "text-sm md:text-base lg:text-lg tracking-[0.4em]",
      sparkSize: 32,
      gap: "gap-6",
    },
    hero: {
      title: "text-7xl sm:text-8xl md:text-9xl lg:text-[11rem] tracking-tighter",
      subtitle: "text-xs sm:text-sm md:text-base lg:text-xl tracking-[0.42em]",
      sparkSize: 36,
      gap: "gap-6 md:gap-8",
    },
  }[size];

  return (
    <div className={`flex flex-col items-center justify-center text-center select-none ${className}`}>
      {/* Flaming Wordmark Row */}
      <div className={`flex items-center justify-center ${sizeStyles.gap}`}>
        {showSparks && (
          <Spark
            size={sizeStyles.sparkSize}
            color="#FFFFFF"
            className="animate-pulse opacity-90 hidden sm:inline-block"
          />
        )}

        <h1
          className={`font-black uppercase leading-none font-[family-name:var(--font-display,var(--nv-font-display))] ${sizeStyles.title}`}
          style={{
            background:
              "linear-gradient(180deg, #FFFFFF 0%, #FFE0B2 25%, #FF6A00 65%, #B80F1F 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 28px rgba(255, 106, 0, 0.45))",
          }}
        >
          NEXUS VYOMA
        </h1>

        {showSparks && (
          <Spark
            size={sizeStyles.sparkSize}
            color="#FFFFFF"
            className="animate-pulse opacity-90 hidden sm:inline-block"
          />
        )}
      </div>

      {/* Official Fest Subtitle */}
      {showSubtitle && (
        <p
          className={`mt-2 font-medium uppercase text-[#E5E5E5] opacity-90 font-sans ${sizeStyles.subtitle}`}
        >
          A THREE-DAY INTER-COLLEGE FEST
        </p>
      )}
    </div>
  );
}

export default NexusWordmark;
