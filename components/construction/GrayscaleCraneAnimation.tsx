'use client';

import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

/**
 * GrayscaleCraneAnimation
 * A minimal, compact white-outline vector animation of a crane constructing a website UI.
 * Pure wireframe aesthetic: thin white and light-gray outlines, transparent interiors.
 * Fixed geometric coordinate system and synchronized GSAP timeline.
 */
export default function GrayscaleCraneAnimation({
  className = '',
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trolleyRef = useRef<SVGGElement>(null);
  const cableRef = useRef<SVGLineElement>(null);
  const hookGroupRef = useRef<SVGGElement>(null);
  const movingPanelRef = useRef<SVGGElement>(null);
  const placedPanelRef = useRef<SVGRectElement>(null);

  useGSAP(
    () => {
      const isReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Coordinate targets:
      // Pickup position: trolley X = 163, hook Y = 82 (panel top at 158)
      // Transit position: trolley X moves between 163 and 263, hook Y = 40 (panel floating above browser)
      // Dropoff position: trolley X = 263, hook Y = 138 (panel seated at 222, 214)

      if (isReducedMotion) {
        // Static resting state for users preferring reduced motion
        gsap.set(trolleyRef.current, { x: 213 });
        gsap.set(hookGroupRef.current, { y: 40 });
        gsap.set(cableRef.current, { attr: { y2: 40 } });
        gsap.set(placedPanelRef.current, { opacity: 0.85 });
        gsap.set(movingPanelRef.current, { opacity: 0 });
        return;
      }

      // Initial positions: start at pickup
      gsap.set(trolleyRef.current, { x: 163 });
      gsap.set(hookGroupRef.current, { y: 82 });
      gsap.set(cableRef.current, { attr: { y2: 82 } });
      gsap.set(movingPanelRef.current, { opacity: 1 });
      gsap.set(placedPanelRef.current, { opacity: 0 });

      const tl = gsap.timeline({
        repeat: -1,
        defaults: { ease: 'power2.inOut' },
      });

      // Synchronized cable and hook helper (guarantees zero cable detachment)
      const moveHook = (targetY: number, duration: number, ease = 'power2.inOut') => {
        return [
          gsap.to(hookGroupRef.current, { y: targetY, duration, ease }),
          gsap.to(cableRef.current, { attr: { y2: targetY }, duration, ease }),
        ];
      };

      tl
        // Phase 1: Pause at pickup position (x = 163, y = 82)
        .to({}, { duration: 0.6 })

        // Phase 2: Hoist cable and hook up to transit height (y = 40)
        .add(moveHook(40, 1.2))

        // Phase 3: Trolley glides smoothly along crane jib from x = 163 to x = 263
        .to(trolleyRef.current, { x: 263, duration: 1.8 })

        // Phase 4: Cable lowers panel into the browser target slot (y = 138)
        .add(moveHook(138, 1.3))

        // Phase 5: Panel seats firmly in target slot; hook releases and ascends to y = 40
        .set(placedPanelRef.current, { opacity: 1 })
        .to(movingPanelRef.current, { opacity: 0, duration: 0.25 })
        .add(moveHook(40, 1.1))

        // Phase 6: Trolley glides back along the jib to pickup position (x = 163)
        .to(trolleyRef.current, { x: 163, duration: 1.6 })

        // Smooth reset for next seamless loop
        .to(placedPanelRef.current, { opacity: 0, duration: 0.5 }, '-=0.4')
        .add(moveHook(82, 0.9), '-=0.5')
        .to(movingPanelRef.current, { opacity: 1, duration: 0.3 }, '-=0.2');
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`relative w-full max-w-[480px] sm:max-w-[560px] aspect-[500/320] mx-auto select-none pointer-events-none ${className}`}
      aria-label="Minimal white-outline website construction animation"
      role="img"
    >
      {/* Smooth feathered ambient blur & translucent aura (Zero hard box edges) */}
      <div
        className="absolute -inset-8 sm:-inset-12 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.2) 45%, transparent 75%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          WebkitMaskImage:
            'radial-gradient(ellipse at center, black 35%, rgba(0, 0, 0, 0.45) 55%, transparent 75%)',
          maskImage:
            'radial-gradient(ellipse at center, black 35%, rgba(0, 0, 0, 0.45) 55%, transparent 75%)',
        }}
        aria-hidden="true"
      />

      <svg
        viewBox="0 0 500 320"
        className="relative z-10 w-full h-full block overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* =========================================================================
            01 — BACKGROUND SILHOUETTE BUILDINGS (Faint Wireframe Outlines)
            ========================================================================= */}
        <g opacity="0.22">
          <rect x="75" y="160" width="55" height="135" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="135" y="100" width="70" height="195" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="235" y="120" width="65" height="175" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3 3" />
          <rect x="330" y="150" width="60" height="145" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" strokeDasharray="3 3" />
        </g>

        {/* =========================================================================
            02 — GROUND BASELINE
            ========================================================================= */}
        <line x1="20" y1="295" x2="480" y2="295" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1.2" strokeLinecap="round" />

        {/* =========================================================================
            03 — BROWSER WINDOW STRUCTURE (Minimal White Outlines)
            ========================================================================= */}
        <g id="browser-structure">
          {/* Main browser frame chassis */}
          <rect
            x="105"
            y="125"
            width="225"
            height="170"
            rx="6"
            fill="rgba(255, 255, 255, 0.02)"
            stroke="rgba(255, 255, 255, 0.85)"
            strokeWidth="1.4"
          />

          {/* Browser header titlebar */}
          <line x1="105" y1="147" x2="330" y2="147" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

          {/* Window control dots (3 thin circles) */}
          <circle cx="118" cy="136" r="2.5" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          <circle cx="127" cy="136" r="2.5" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          <circle cx="136" cy="136" r="2.5" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />

          {/* URL search pill outline */}
          <rect x="150" y="131" width="105" height="10" rx="5" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
          <rect x="268" y="132.5" width="50" height="7" rx="3.5" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="0.8" />

          {/* Left Column: UI Card 1 (x=122, y=158, w=82, h=46) */}
          <rect x="122" y="158" width="82" height="46" rx="3" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.2" />
          <line x1="129" y1="167" x2="165" y2="167" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="129" y1="175" x2="194" y2="175" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" strokeLinecap="round" />
          <line x1="129" y1="182" x2="182" y2="182" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" strokeLinecap="round" />

          {/* Left Column: UI Card 2 (x=122, y=214, w=82, h=46) */}
          <rect x="122" y="214" width="82" height="46" rx="3" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.2" />
          <line x1="129" y1="223" x2="170" y2="223" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="129" y1="231" x2="194" y2="231" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" strokeLinecap="round" />
          <line x1="129" y1="238" x2="178" y2="238" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1" strokeLinecap="round" />

          {/* Bottom wireframe text lines */}
          <line x1="124" y1="272" x2="195" y2="272" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="124" y1="279" x2="180" y2="279" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" strokeLinecap="round" />

          {/* Right Column: Empty Target Slot Outline (x=222, y=214, w=82, h=46) */}
          <rect
            x="222"
            y="214"
            width="82"
            height="46"
            rx="3"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />

          {/* Placed Panel (Fades in when hook seats it into the target slot) */}
          <g>
            <rect
              ref={placedPanelRef}
              x="222"
              y="214"
              width="82"
              height="46"
              rx="3"
              fill="rgba(255, 255, 255, 0.04)"
              stroke="rgba(255, 255, 255, 0.85)"
              strokeWidth="1.3"
            />
          </g>

          {/* Right Column bottom wireframe lines */}
          <line x1="224" y1="272" x2="295" y2="272" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" strokeLinecap="round" />
          <line x1="224" y1="279" x2="275" y2="279" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.2" strokeLinecap="round" />
        </g>

        {/* =========================================================================
            04 — TOWER CRANE (Minimal White-Outline Truss & Lattice)
            ========================================================================= */}
        <g id="tower-crane">
          {/* Base foundation platform */}
          <rect x="352" y="283" width="44" height="12" rx="1.5" stroke="rgba(255, 255, 255, 0.55)" strokeWidth="1.2" />

          {/* Vertical Lattice Mast columns */}
          <line x1="364" y1="85" x2="364" y2="283" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.3" />
          <line x1="384" y1="85" x2="384" y2="283" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.3" />

          {/* Mast Diagonal X-bracing */}
          <path
            d="
              M364 283 L384 257 M384 283 L364 257
              M364 257 L384 231 M384 257 L364 231
              M364 231 L384 205 M384 231 L364 205
              M364 205 L384 179 M384 205 L364 179
              M364 179 L384 153 M384 179 L364 153
              M364 153 L384 127 M384 153 L364 127
              M364 127 L384 101 M384 127 L364 101
              M364 101 L384 85 M384 101 L364 85
            "
            stroke="rgba(255, 255, 255, 0.4)"
            strokeWidth="1"
          />

          {/* Operator Cabin (Minimal Outline) */}
          <rect x="350" y="58" width="34" height="27" rx="2" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.2" />
          <rect x="353" y="62" width="14" height="11" rx="1" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

          {/* Counterweight Block outline */}
          <rect x="404" y="60" width="36" height="20" rx="1.5" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.2" />

          {/* Tower Apex A-frame */}
          <polygon points="380,24 374,58 386,58" stroke="rgba(255, 255, 255, 0.75)" strokeWidth="1.3" />
          <line x1="380" y1="24" x2="380" y2="58" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />

          {/* Pendant Cable Tie Lines */}
          <line x1="380" y1="24" x2="114" y2="58" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.2" />
          <line x1="380" y1="24" x2="250" y2="58" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" />
          <line x1="380" y1="24" x2="440" y2="58" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1.2" />

          {/* Horizontal Jib Truss Rails */}
          <line x1="112" y1="58" x2="440" y2="58" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.4" />
          <line x1="116" y1="46" x2="374" y2="46" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.2" />
          <line x1="386" y1="46" x2="440" y2="46" stroke="rgba(255, 255, 255, 0.65)" strokeWidth="1.2" />

          {/* Jib Webbing */}
          <path
            d="
              M116 58 L126 46 M126 58 L136 46 M136 58 L146 46 M146 58 L156 46
              M156 58 L166 46 M166 58 L176 46 M176 58 L186 46 M186 58 L196 46
              M196 58 L206 46 M206 58 L216 46 M216 58 L226 46 M226 58 L236 46
              M236 58 L246 46 M246 58 L256 46 M256 58 L266 46 M266 58 L276 46
              M276 58 L286 46 M286 58 L296 46 M296 58 L306 46 M306 58 L316 46
              M316 58 L326 46 M326 58 L336 46 M336 58 L346 46 M346 58 L356 46
              M356 58 L366 46 M366 58 L374 46
              M386 58 L398 46 M406 58 L418 46 M426 58 L438 46
            "
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth="1"
          />
        </g>

        {/* =========================================================================
            05 — TROLLEY, HOIST CABLE & SUSPENDED PANEL (Fixed baseline Y = 58)
            ========================================================================= */}
        {/* Parent anchor group sets fixed rail level at y = 58 */}
        <g id="crane-boom-rail" transform="translate(0, 58)">
          {/* Trolley carriage: GSAP animates ONLY X along the jib (163 to 263) */}
          <g ref={trolleyRef}>
            {/* Trolley wheels and carriage box */}
            <rect x="-8" y="-3" width="16" height="5" rx="1" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1" />
            <circle cx="-4" cy="-3" r="2" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="0.8" />
            <circle cx="4" cy="-3" r="2" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="0.8" />

            {/* Vertical Hoist Cable (x1=0, y1=2 to x2=0, y2=hookY) */}
            <line
              ref={cableRef}
              x1="0"
              y1="2"
              x2="0"
              y2="82"
              stroke="rgba(255, 255, 255, 0.8)"
              strokeWidth="1.2"
            />

            {/* Hook Assembly + Suspended Panel (Translates strictly along Y inside trolley) */}
            <g ref={hookGroupRef}>
              {/* Hook loop & curl */}
              <circle cx="0" cy="0" r="2.5" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1" />
              <path
                d="M0 2.5 C0 5.5 2 7 2 8.5 C2 10 1 11 0 11 C-1 11 -1.8 10 -1.8 8.8"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="1.3"
                strokeLinecap="round"
              />

              {/* Suspended Panel Assembly (Locked to hook) */}
              <g ref={movingPanelRef}>
                {/* Slings from hook down to panel top corners */}
                <line x1="0" y1="8" x2="-28" y2="18" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.9" />
                <line x1="0" y1="8" x2="28" y2="18" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="0.9" />

                {/* Panel Card Outline (w=82, h=46, centered at x=0) */}
                <rect
                  x="-41"
                  y="18"
                  width="82"
                  height="46"
                  rx="3"
                  fill="rgba(255, 255, 255, 0.04)"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="1.3"
                />

                {/* Panel wireframe details */}
                <line x1="-34" y1="27" x2="2" y2="27" stroke="rgba(255, 255, 255, 0.85)" strokeWidth="1.2" strokeLinecap="round" />
                <line x1="-34" y1="35" x2="31" y2="35" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeLinecap="round" />
                <line x1="-34" y1="42" x2="22" y2="42" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="1" strokeLinecap="round" />
                <line x1="-34" y1="49" x2="8" y2="49" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" strokeLinecap="round" />
              </g>
            </g>
          </g>
        </g>

        {/* =========================================================================
            06 — FOREGROUND DETAILS (CONSTRUCTION BARRIERS & TRAFFIC CONES)
            ========================================================================= */}
        {/* Left Construction Barrier */}
        <g id="left-barrier" transform="translate(25, 240)">
          <line x1="6" y1="30" x2="6" y2="55" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" />
          <line x1="44" y1="30" x2="44" y2="55" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" />
          <line x1="0" y1="55" x2="12" y2="55" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="38" y1="55" x2="50" y2="55" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="0" y="16" width="50" height="14" rx="1.5" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          <line x1="8" y1="16" x2="18" y2="30" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="20" y1="16" x2="30" y2="30" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="32" y1="16" x2="42" y2="30" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
        </g>

        {/* Right Construction Barrier */}
        <g id="right-barrier" transform="translate(425, 240)">
          <line x1="6" y1="30" x2="6" y2="55" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" />
          <line x1="44" y1="30" x2="44" y2="55" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" />
          <line x1="0" y1="55" x2="12" y2="55" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" strokeLinecap="round" />
          <line x1="38" y1="55" x2="50" y2="55" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1.4" strokeLinecap="round" />
          <rect x="0" y="16" width="50" height="14" rx="1.5" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          <line x1="8" y1="16" x2="18" y2="30" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="20" y1="16" x2="30" y2="30" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
          <line x1="32" y1="16" x2="42" y2="30" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
        </g>

        {/* Traffic Cone 1 (Left foreground) */}
        <g id="cone-1" transform="translate(85, 271)">
          <polygon points="10,0 2,22 18,22" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          <line x1="5" y1="14" x2="15" y2="14" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <line x1="7" y1="8" x2="13" y2="8" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <rect x="0" y="22" width="20" height="2" rx="0.5" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
        </g>

        {/* Traffic Cone 2 (Center foreground) */}
        <g id="cone-2" transform="translate(135, 293)">
          <polygon points="10,0 2,22 18,22" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          <line x1="5" y1="14" x2="15" y2="14" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <line x1="7" y1="8" x2="13" y2="8" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <rect x="0" y="22" width="20" height="2" rx="0.5" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
        </g>

        {/* Traffic Cone 3 (Right foreground under crane) */}
        <g id="cone-3" transform="translate(375, 293)">
          <polygon points="10,0 2,22 18,22" stroke="rgba(255, 255, 255, 0.7)" strokeWidth="1" />
          <line x1="5" y1="14" x2="15" y2="14" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <line x1="7" y1="8" x2="13" y2="8" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
          <rect x="0" y="22" width="20" height="2" rx="0.5" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}
