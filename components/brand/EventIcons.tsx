import React from "react";

export type EventCategoryId =
  | "cosplay"
  | "dj"
  | "auto-expo"
  | "qawwali"
  | "tech-battles"
  | "food-fest";

interface EventIconProps {
  id: EventCategoryId;
  className?: string;
  size?: number;
  color?: string;
}

export const EVENT_DETAILS: Record<
  EventCategoryId,
  { title: string; caption: string }
> = {
  cosplay: {
    title: "COSPLAY",
    caption: "CHARACTERS LIVE ON",
  },
  dj: {
    title: "DJ",
    caption: "FEEL EVERY BEAT",
  },
  "auto-expo": {
    title: "AUTOMOBILE EXPO",
    caption: "MACHINES MOVE PEOPLE",
  },
  qawwali: {
    title: "QAWWALI NIGHT",
    caption: "LET THE SOUL SING",
  },
  "tech-battles": {
    title: "TECH BATTLES",
    caption: "THINK. BUILD. CONQUER.",
  },
  "food-fest": {
    title: "FOOD FEST",
    caption: "TASTE THE CELEBRATION",
  },
};

/**
 * Official Event Line Icons matching Section 8 of the Brand Style Guide
 */
export function EventIcon({
  id,
  className = "",
  size = 48,
  color = "#FFFFFF",
}: EventIconProps) {
  switch (id) {
    case "cosplay":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Drama Mask */}
          <path
            d="M24 6C15.163 6 8 13.163 8 22C8 30.837 15.163 42 24 42C32.837 42 40 30.837 40 22C40 13.163 32.837 6 24 6Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Half Shadow Split */}
          <path
            d="M24 6V42C32.837 42 40 30.837 40 22C40 13.163 32.837 6 24 6Z"
            fill={color}
            opacity="0.9"
          />
          {/* Left Eye Cutout */}
          <ellipse cx="17" cy="18" rx="2.5" ry="3.5" fill={color} />
          {/* Right Eye Cutout (on filled side, inverted) */}
          <ellipse cx="31" cy="18" rx="2.5" ry="3.5" fill="#000000" />
          {/* Mask Smile */}
          <path
            d="M18 28C21 32 27 32 30 28"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "dj":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Headband */}
          <path
            d="M10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Left Ear Cup */}
          <rect
            x="8"
            y="22"
            width="6"
            height="14"
            rx="3"
            stroke={color}
            strokeWidth="2"
            fill={color}
          />
          {/* Right Ear Cup */}
          <rect
            x="34"
            y="22"
            width="6"
            height="14"
            rx="3"
            stroke={color}
            strokeWidth="2"
            fill={color}
          />
        </svg>
      );

    case "auto-expo":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Motion speed streaks */}
          <line x1="4" y1="16" x2="10" y2="16" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <line x1="2" y1="22" x2="8" y2="22" stroke={color} strokeWidth="2" strokeLinecap="round" />
          
          {/* Aerodynamic Car Body Outline */}
          <path
            d="M10 28L14 18C15 15 18 14 22 14H32C36 14 40 18 42 22L45 28C46 30 45 32 43 32H12C10 32 9 30 10 28Z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Windshield */}
          <path
            d="M20 17H31L35 24H20V17Z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {/* Front Wheel */}
          <circle cx="37" cy="33" r="4.5" stroke={color} strokeWidth="2" fill="#0A0F1E" />
          <circle cx="37" cy="33" r="1.5" fill={color} />
          {/* Rear Wheel */}
          <circle cx="17" cy="33" r="4.5" stroke={color} strokeWidth="2" fill="#0A0F1E" />
          <circle cx="17" cy="33" r="1.5" fill={color} />
        </svg>
      );

    case "qawwali":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Traditional Dome Silhouette with Spire */}
          <path
            d="M24 6V10M24 10C24 14 14 18 14 26V38H34V26C34 18 24 10 24 10Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Base Steps */}
          <line x1="10" y1="41" x2="38" y2="41" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </svg>
      );

    case "tech-battles":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Laptop Screen */}
          <rect
            x="8"
            y="10"
            width="32"
            height="22"
            rx="2"
            stroke={color}
            strokeWidth="2.5"
          />
          {/* Laptop Base Plate */}
          <path
            d="M4 36H44C44 36 41 33 39 33H9C7 33 4 36 4 36Z"
            stroke={color}
            strokeWidth="2"
            strokeLinejoin="round"
          />
          {/* Node Graph Lines & Circles on Screen */}
          <circle cx="15" cy="24" r="2" fill={color} />
          <circle cx="24" cy="16" r="2" fill={color} />
          <circle cx="33" cy="22" r="2" fill={color} />
          <polyline
            points="15,24 24,16 33,22"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "food-fest":
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
          aria-hidden="true"
        >
          {/* Cloche Dome Handle */}
          <circle cx="24" cy="12" r="2.5" stroke={color} strokeWidth="2" />
          
          {/* Cloche Dome Cover */}
          <path
            d="M8 30C8 20 15 15 24 15C33 15 40 20 40 30H8Z"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Serving Platter Tray */}
          <line x1="6" y1="33" x2="42" y2="33" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          {/* Tray Handle Underneath */}
          <path
            d="M10 37H38C39 37 40 38 39 39C38 40 36 41 33 41H15C12 41 10 40 9 39C8 38 9 37 10 37Z"
            fill={color}
            opacity="0.8"
          />
        </svg>
      );

    default:
      return null;
  }
}

interface EventBadgeCardProps {
  id: EventCategoryId;
  className?: string;
}

/**
 * Event Badge Card with matching icon, title, and brand caption.
 */
export function EventBadgeCard({ id, className = "" }: EventBadgeCardProps) {
  const details = EVENT_DETAILS[id];

  return (
    <div
      className={`flex flex-col items-center text-center p-6 rounded-xl border border-white/10 bg-[#0A0F1E]/80 backdrop-blur-md hover:border-[#FF6A00]/50 hover:shadow-[0_0_24px_rgba(255,106,0,0.25)] transition-all duration-300 group ${className}`}
    >
      <div className="mb-4 text-white group-hover:text-[#FF6A00] transition-colors duration-300">
        <EventIcon id={id} size={48} />
      </div>
      <h3 className="text-lg md:text-xl font-bold tracking-wider text-white font-[family-name:var(--font-display,var(--nv-font-display))]">
        {details.title}
      </h3>
      <p className="text-xs tracking-widest text-[#E5E5E5]/70 uppercase mt-1 font-sans">
        {details.caption}
      </p>
    </div>
  );
}

export default EventIcon;
