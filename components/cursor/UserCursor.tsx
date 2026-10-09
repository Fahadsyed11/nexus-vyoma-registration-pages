"use client";

import React, { useEffect, useRef, useState } from "react";

export type CursorColorPreset =
  | "orange"
  | "crimson"
  | "blue"
  | "lime"
  | "purple";

interface UserCursorProps {
  name?: string;
  role?: string;
  color?: CursorColorPreset | string;
  customColor?: string;
  avatar?: string;
  className?: string;
  showRole?: boolean;
}

const COLOR_MAP: Record<
  CursorColorPreset,
  { primary: string; bg: string; border: string; glow: string; text: string }
> = {
  orange: {
    primary: "#FF6A00",
    bg: "rgba(255, 106, 0, 0.9)",
    border: "#FFA24D",
    glow: "0 0 16px rgba(255, 106, 0, 0.5)",
    text: "#FFFFFF",
  },
  crimson: {
    primary: "#D8182B",
    bg: "rgba(216, 24, 43, 0.9)",
    border: "#FF4D5E",
    glow: "0 0 16px rgba(216, 24, 43, 0.5)",
    text: "#FFFFFF",
  },
  blue: {
    primary: "#0066FF",
    bg: "rgba(0, 102, 255, 0.9)",
    border: "#4D94FF",
    glow: "0 0 16px rgba(0, 102, 255, 0.5)",
    text: "#FFFFFF",
  },
  lime: {
    primary: "#98D800",
    bg: "rgba(152, 216, 0, 0.9)",
    border: "#BFFF24",
    glow: "0 0 16px rgba(152, 216, 0, 0.5)",
    text: "#000000",
  },
  purple: {
    primary: "#7B2CFF",
    bg: "rgba(123, 44, 255, 0.9)",
    border: "#A96EFF",
    glow: "0 0 16px rgba(123, 44, 255, 0.5)",
    text: "#FFFFFF",
  },
};

/**
 * UserCursor — Live collaborator cursor with custom name tag and brand palette.
 * Inspired by live collaborative canvas pointers (Figma / React Bits).
 */
export function UserCursor({
  name = "Explorer",
  role = "Nexus Vyoma",
  color = "orange",
  customColor,
  avatar,
  className = "",
  showRole = true,
}: UserCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isTouchDevice] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia("(pointer: coarse)").matches
    );
  });

  const cursorRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number | null>(null);

  const theme =
    COLOR_MAP[color as CursorColorPreset] || {
      primary: customColor || color,
      bg: customColor || color,
      border: "#FFFFFF",
      glow: "0 0 16px rgba(255, 255, 255, 0.4)",
      text: "#FFFFFF",
    };

  useEffect(() => {
    if (isTouchDevice) return;

    const onMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    // Smooth animation loop using lerp
    const render = () => {
      const lerpFactor = 0.35;
      posRef.current.x +=
        (targetRef.current.x - posRef.current.x) * lerpFactor;
      posRef.current.y +=
        (targetRef.current.y - posRef.current.y) * lerpFactor;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <div
      ref={cursorRef}
      className={`fixed top-0 left-0 pointer-events-none z-50 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{
        willChange: "transform",
        transform: "translate3d(-100px, -100px, 0)",
      }}
      aria-hidden="true"
    >
      {/* Pointer & Name Tag Wrapper */}
      <div
        className={`relative flex items-start transition-transform duration-100 origin-top-left ${
          isClicking ? "scale-90" : "scale-100"
        }`}
      >
        {/* Custom Arrow Pointer SVG */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          <path
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
            fill={theme.primary}
            stroke="#FFFFFF"
            strokeWidth="1.2"
          />
        </svg>

        {/* Live Collaborator Name Tag Pill */}
        <div
          className="ml-2 -mt-1 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide shadow-lg select-none backdrop-blur-md transition-all border"
          style={{
            backgroundColor: theme.bg,
            borderColor: theme.border,
            color: theme.text,
            boxShadow: theme.glow,
          }}
        >
          {avatar && (
            <span className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center bg-white/20 text-[10px]">
              {avatar.startsWith("http") || avatar.startsWith("/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                avatar
              )}
            </span>
          )}

          <span className="font-medium whitespace-nowrap">{name}</span>

          {showRole && role && (
            <span
              className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/20 font-bold opacity-90"
              style={{ color: theme.text }}
            >
              {role}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCursor;
