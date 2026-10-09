# Nexus Vyoma — Registration Pages

Registration website for **Nexus Vyoma**, a three-day inter-college fest by ISL Engineering College, Hyderabad (10–12 Nov 2026).

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 and brand tokens (`brand/tokens.css`)
- GSAP and Framer Motion for animation (guides in `skills/`)
- Payment gateway: TBD (secure server-side flow, see rules)

## Project structure

```
AGENTS.md          Project rules (read every prompt). CLAUDE.md points here
brand/             Brand guide, color tokens, brand assets
skills/            GSAP + Framer animation skills (read before animating)
app/               Next.js App Router (Server Components by default)
public/            Static files
.env.example       Env var names (copy to .env.local, never commit secrets)
```

## Working rules (summary — full text in [AGENTS.md](./AGENTS.md))

1. **SSR first**, `"use client"` only for browser APIs and animation, as small components.
2. **Animated, on-brand, responsive**, using the `skills/` guides. No generic AI-slop design.
3. **Plan, get approval, then build.**
4. **Payments are secure:** server-side pricing, signature and webhook verification, secrets only in env.
5. **Update this README's Activity Log after every task.**
6. **Strict Asset / Visual Lock:** Use ONLY user-provided or approved brand assets. Zero stock, AI-generated, or external demo images.

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Activity Log

Newest first.

### 2026-10-09 — Fixed Navbar Logo Docking Alignment & Capsule Visual Consistency

**Done**
- **Hero-to-Navbar Docking Fix (`HeroNavbarTransition.tsx`)**:
  - Replaced bounding container measurements with exact 3:1 image aspect ratio bounding boxes (`heroLogoAnchorRef` and `navLogoSlotRef`), resolving the vertical overflow and coordinate clipping issue where the logo extended beyond the navbar capsule.
  - Aligned transform origin to `'top left'` with exact `deltaX` and `deltaY` translation formulas, guaranteeing subpixel docking precision across mobile and desktop.
  - Linked `backShadowRef` to the master scroll timeline to fade out the ambient dark elevation shadow during initial scroll, preventing black glow clouds from spilling over the navbar border.
  - Replaced white logo drop-shadow layer with pure official full-color logo on scroll completion.
  - Harmonized navbar capsule styling to match approved iPhone mirror-glass design: `max-w-4xl`, `rgba(5, 7, 14, 0.94)` deep translucent background, `blur(36px)`, specular top reflection, and rich elevation shadow.
- **Verification**: Ran `npm run build` with clean 0-error compilation.

### 2026-10-09 — Resolved PR Merge Conflicts with `main`

**Done**
- Resolved merge conflicts in `package.json` and `package-lock.json` while merging `origin/main` into `issue-4`.
- Kept required dependencies from both sides of the merge (including UI dependencies plus `mongoose` and `esmock`) and regenerated lockfile via `npm install --package-lock-only`.
- Finalized merge commit with two parents (`Merge remote-tracking branch 'origin/main' into issue-4`).
- **Verified**:
  - `npm run test` (passes; no test files currently present)
  - `npm run lint` (completes with 1 existing warning in `app/api/event/route.ts` for unused `request` parameter)

### 2026-10-09 — Comprehensive Mobile Responsiveness Audit & Fixes

**Done**
- **Mobile Responsiveness Fixes (Desktop Strictly Locked)**:
  - **DriftWall (`DriftWall.tsx`)**: Added dynamic container-width responsive scaling (Mobile: 4 cols / 130px tiles; Tablet: 5 cols / 165px tiles; Desktop: 7 cols / 200px tiles locked).
  - **Sponsors Section (`SponsorsSection.tsx`)**: Made bottom sponsor CTA wrap smoothly on mobile (`flex-col sm:flex-row`), adjusted carousel height on small screens (`h-[460px] sm:h-[540px] lg:h-[580px]`).
  - **About Section (`AboutSection.tsx`)**: Refined mobile typography to `text-[24px] xs:text-[28px] sm:text-[36px]` preventing awkward line breaks on 320px–360px viewports.
  - **Flagship Arenas (`FlagshipCardItem.tsx`)**: Reduced mobile card padding (`p-5 sm:p-10 lg:p-14`) and scaled title (`text-2xl sm:text-4xl lg:text-6xl`) with proportionate icon sizes.
  - **Register CTA (`RegisterCTASection.tsx`)**: Adjusted card padding (`p-6 sm:p-14 lg:p-16`) and scaled concentric background arcs (`w-[260px] sm:w-[460px] lg:w-[540px]`).
  - **Footer Section (`FooterSection.tsx`)**: Symmetrically centered Venue and Date cards with full-width mobile container wrappers (`w-full max-w-sm sm:w-auto`).
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors; desktop layouts verified identical.

### 2026-10-09 — Solid Pure White Filled Hero Logo Text

**Done**
- **Hero Logo (`HeroNavbarTransition.tsx`)**:
  - Replaced the outline text on the Hero page with the solid pure white wordmark ([`nexus-wordmark-white.png`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/public/brand/nexus-wordmark-white.png)).
  - Retained deep multi-stage back shadows and ambient occlusion so the white text stands out with bold, crisp contrast over the 3D moving image tiles.
  - Maintained interactive cursor color reveal and seamless scroll docking into the fixed navbar.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Elevated Hero Logo with Multi-Layer Back Shadows

**Done**
- **Hero Logo (`HeroNavbarTransition.tsx`)**:
  - Elevated the transparent outline *"NEXUS VYOMA"* logo above the 3D drifting background tiles using multi-stage directional and ambient back shadows (`drop-shadow-[0_4px_10px_rgba(0,0,0,1)] drop-shadow-[0_12px_28px_rgba(0,0,0,0.95)]`).
  - Added an ambient dark occlusion backdrop layer behind the logo letters to provide crisp contrast and 3D separation over the moving image tiles.
- **Verified**: Next.js production build (`npm run build`) compiled successfully with 0 errors.

### 2026-10-09 — Foreground Image Sharpness & Reduced Background Gradient Height

**Done**
- **Hero Background Gradient (`HeroNavbarTransition.tsx`)**:
  - Decreased vertical height significantly (`h-[10vh] max-h-[90px] w-[28vw] max-w-[320px]`) and positioned strictly in the background at `z-0` with a smooth radial edge fade (`blur-[55px] opacity-35`).
- **Foreground Images (`HeroNavbarTransition.tsx`, `DriftWall.tsx`)**:
  - Positioned DriftWall in the foreground at `z-10` with high resting brightness (`dim={0.92}`) and `overlayColor="transparent"`, ensuring images remain sharp, bright, and distinct with zero wash-out.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Enhanced Navbar Density, Backdrop Blur & Multi-Layer Dropshadow

**Done**
- **Navbar (`Navbar.tsx`)**:
  - Increased background opacity and density to `rgba(5, 7, 14, 0.94)` with an upgraded `blur(36px) saturate(210%)` backdrop filter for clear readability over any page content.
  - Added multi-layer ambient and directional drop shadows (`0 25px 60px -12px rgba(0,0,0,0.95), 0 10px 25px -5px rgba(0,0,0,0.85)`).
  - Enhanced text contrast and sharpness for nav links (`text-zinc-100 font-semibold`).
  - Refined capsule sizing (`max-w-4xl`) and added `overflow-hidden` to ensure smooth, clean containment with no clipping or extended edges.
- **Verified**: Next.js production build (`npm run build`) passed cleanly with 0 errors.

### 2026-10-09 — Footer Venue & Date Info with Official ISL College Logo

**Done**
- **Footer Section (`FooterSection.tsx`)**:
  - Integrated Venue card featuring the official ISL Engineering College logo mark (`public/brand/isl-college-logo.png`), venue name (*"ISL Engineering College"*), and location (*"Hyderabad, Telangana"*).
  - Integrated Dates card highlighting the festival timeline (*"10, 11, 12 November"* and *"3-Day Inter-College Fest"*).
  - Maintained central `@nexusvyoma` Instagram social pill and the interactive monumental logo reveal (`<FooterLogoReveal />`).
  - Balanced responsive layout: 3-column row on desktop, cleanly stacked and centered on mobile/tablet screens.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Static Button Arrow & Radial Fill Animation

**Done**
- **CTA Button (`RegisterCTASection.tsx`)**:
  - Removed hover translation from the arrow icon inside the *"Join the Experience"* button so it remains completely static on hover while the red-orange `#FF3B2E` radial background expands smoothly.
  - Retained increased readable text size (`text-sm sm:text-base`).
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Updated "Join the Experience" Button (#FF3B2E Fill From Arrow)

**Done**
- **CTA Button (`RegisterCTASection.tsx`)**:
  - Configured hover fill animation to originate from the arrow on the right (`origin-right scale-x-0 group-hover:scale-x-100`) expanding across the pill.
  - Set both the arrow medallion background and hover fill color to solid red-orange `#FF3B2E`.
  - Preserved all other button styling, typography, and card properties without alteration.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Updated "Join the Experience" Button (#7B2CFF Hover Animation)

**Done**
- **CTA Button Update (`RegisterCTASection.tsx`)**:
  - Implemented solid brand purple (`#7B2CFF`) for the arrow medallion and a smooth 350ms left-to-right fill animation on cursor hover (`bg-[#7B2CFF] origin-left scale-x-0 group-hover:scale-x-100`).
  - Set arrow icon to solid white (`#FFFFFF`) with rightward hover movement (`group-hover:translate-x-1`).
  - Removed all orange/red gradients from this button, strictly preserving default dark pill outline and click functionality.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Circular Mask for Nexus CTA Emblem

**Done**
- **CTA Section (`RegisterCTASection.tsx`)**:
  - Configured the emblem container with a 1:1 circular aspect ratio and boundary (`rounded-full overflow-hidden aspect-square`) so the emblem inside the concentric rings presents as a circle.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Centered Nexus Emblem Inside CTA Concentric Circles

**Done**
- **CTA Section (`RegisterCTASection.tsx`)**:
  - Integrated the official circular Nexus emblem directly in the center of the right-side concentric arcs.
  - Sized with responsive scaling (`w-28 h-28` to `w-44 h-44`), `mix-blend-screen`, and warm ambient glow.
  - Aligned concentric arcs symmetrically around the logo medallion matching the reference visual composition.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Updated CTA Card to Subtle Shades of Black

**Done**
- **CTA Card Background (`RegisterCTASection.tsx`)**:
  - Replaced the multi-color gradient with elegant, translucent shades of black and charcoal (`bg-gradient-to-br from-[#121216]/90 via-[#0B0B0E]/90 to-[#050507]/95 backdrop-blur-2xl border border-white/[0.12]`) and subtle monochrome specular highlights.
  - Retained all existing buttons, typography, concentric arcs, and GSAP scroll animations.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Refined CTA Section (Luminous Palette, Modern Sans & Reference Pill Buttons)

**Done**
- **Refined CTA Card (`RegisterCTASection.tsx`)**:
  - Lightened the card surface using a translucent, luminous gradient (`bg-gradient-to-br from-[#240E42]/65 via-[#3B142D]/55 to-[#5C1E0D]/50 backdrop-blur-2xl border border-white/[0.18]`) that blends into the active Aurora background with warm amber, crimson, and violet undertones.
  - Upgraded typography to modern, clean sans styling with natural title casing (*"Ready to be part of Nexus Vyoma?"*) and balanced hierarchy.
  - Redesigned both CTA buttons to sleek black pills (`bg-[#0A0A0C] border border-white/20`) with bold text and circular arrow medallions (`from-[#FF6A00] to-[#FF207D]` for primary, frosted glass for secondary).
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Redesigned CTA to Minimal Wide Card with Concentric Arcs

**Done**
- **Complete CTA Replacement (`RegisterCTASection.tsx`)**:
  - Removed old box and replaced with a wide, architectural rounded card (`max-w-6xl`, `rounded-[28px] sm:rounded-[36px]`, `bg-[#070A14]/85 border border-white/[0.08] backdrop-blur-2xl`).
  - Added subtle right-side concentric circular arcs and soft radial gradient band (crimson, orange, violet) fading smoothly into the card composition.
  - Implemented requested typography: *"Ready to Be Part of Nexus Vyoma?"* and *"Three days. One shared sky. Join us for an unforgettable convergence of technology, creativity, and culture."*.
  - Added dual sleek pill-shaped action buttons: `"Join the Experience"` (linking to `/register`) and `"Explore Events"` (linking to `#events`).
  - Maintained smooth GSAP ScrollTrigger reveal animation without modifying any other sections or components.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Modern iPhone Glassmorphism CTA Section

**Done**
- **CTA Box Redesign (`RegisterCTASection.tsx`)**:
  - Implemented ultra-transparent iPhone liquid glassmorphism (`backgroundColor: 'rgba(255, 255, 255, 0.03)'`, `backdropFilter: 'blur(28px) saturate(200%)'`), translucent micro-border (`border-white/[0.14]`), and top specular mirror highlight sheen allowing background aurora waves to show through cleanly.
  - Upgraded typography and editorial hierarchy: added festival pass eyebrow badge with live indicator, punchy display headline (*"STEP INTO THE NEXUS ARENA"*), and refined description.
  - Added modern high-contrast interactive pill action button and bottom quick meta credentials (`INSTANT QR TICKET · ALL 6 ARENAS INCLUDED · ISL HYDERABAD`).
  - Preserved existing GSAP ScrollTrigger card reveal animation and layout isolation without disturbing other components.
- **Verified**: Next.js production build (`npm run build`) compiled cleanly with 0 errors.

### 2026-10-09 — Fixed Upward Scrolling Stacking Stability in `<ScrollStack />`

**Done**
- **ScrollStack Dynamic Offset Math (`ScrollStack.tsx`)**:
  - Fixed `getElementOffset` to subtract the active `translateY` transform (`rect.top - currentTranslateY + window.scrollY`), preventing `cardTop` inflation during upward scrolling.
  - Cards now stay stacked and pinned when scrolling up, smoothly releasing only when the natural scroll threshold is reached.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Integrated React Bits `<ScrollStack />` for Flagship Arenas

**Done**
- **Installed Dependency**: `lenis` for smooth momentum-based scroll tracking.
- **Created UI Components**:
  - [`ScrollStack.tsx`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/components/ui/ScrollStack.tsx): React Bits ScrollStack component ported to TypeScript & React 19 with Lenis momentum scroll, stacking depth calculation, perspective 3D transformations, and progressive blur.
  - [`ScrollStack.css`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/components/ui/ScrollStack.css): Scroller, card wrapper, and 3D stacking styles.
- **Updated Flagship Arenas (`FlagshipScrollDeck.tsx`)**:
  - Integrated `<ScrollStack>` and `<ScrollStackItem>` wrapping all 6 official arenas with preserved high-fidelity cards, ambient glow themes, vector icons, and typography.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Added Minimal Instagram Link in Footer

**Done**
- **Footer Section (`FooterSection.tsx`)**:
  - Added a minimal, responsive Instagram social handle pill link for `@nexusvyoma` directly beneath the centerpiece logo.
  - Styled with subtle frosted glass pill (`bg-white/[0.04]`, `border-white/10`), clean inline SVG camera glyph, and smooth mono text hover effect linking to `https://www.instagram.com/nexusvyoma?...`.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-09 — Debugged & Stabilized Navbar & Hero Logo Transition

**Done**
- **Hero-to-Navbar Transition (`HeroNavbarTransition.tsx`)**:
  - Eliminated CSS transition collision (`transition-all duration-300`) on the navbar capsule that previously caused GSAP scrub lag, jitter, and desync.
  - Fixed pointer events architecture to prevent phantom clicks across the Hero header area when the navbar is hidden (`pointerEvents: 'none'` toggle on active state).
  - Perfected vertical center alignment (`transformOrigin: 'left center'` with vertical center difference `deltaY = endCenterY - startCenterY`) for exact docking into the navbar logo slot.
  - Decoupled the Hero scrub timeline and Footer exit trigger with clean `overwrite: 'auto'` callbacks to prevent timeline property fighting.
  - Added debounced resize listener (150ms) to ensure smooth recalculation across viewport changes and mobile orientation shifts.
- **Standalone Navbar (`Navbar.tsx`)**:
  - Cleaned up pointer events and font variables to match the synchronized design.
- **Verified**: Next.js production build (`npm run build`) passed cleanly with 0 errors.

### 2026-10-09 — Removed Galaxy Starfield (Pure Aurora Background)

**Done**
- **Removed Galaxy Starfield**:
  - Completely deleted the `Galaxy.tsx` component and all star/particle rendering code (`starSpeed`, `density`, `hueShift`, `glowIntensity`, `saturation`, `mouseRepulsion`, `repulsionStrength`, `twinkleIntensity`, `rotationSpeed`).
  - Updated [`DualBackground.tsx`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/components/ui/DualBackground.tsx) to exclusively render the animated Aurora fluid waves (`colorStops={['#3c0fef', '#f51414', '#ffb127']}`, `amplitude={1}`, `blend={0.5}`, `speed={1}`) over the dark base.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-08 — Cleaned Wordmark Assets (Removed Subtitle Line)

**Done**
- **Brand Wordmark Assets**:
  - Removed the bottom subtitle text *"A THREE-DAY INTER-COLLEGE FEST"* from both the outline and full-color official brand assets:
    - [`public/brand/nexus-wordmark-outline.png`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/public/brand/nexus-wordmark-outline.png)
    - [`public/brand/nexus-wordmark-official.png`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/public/brand/nexus-wordmark-official.png)
    - [`brand/assets/nexus-wordmark-outline.png`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/brand/assets/nexus-wordmark-outline.png)
    - [`brand/assets/nexus-wordmark-official.png`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/brand/assets/nexus-wordmark-official.png)
- **Footer Cleanup**:
  - Cleaned up unused imports in [`FooterSection.tsx`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/components/footer/FooterSection.tsx) and fixed hover class syntax in [`RegisterCTASection.tsx`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/components/cta/RegisterCTASection.tsx).
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-08 — Integrated Official Nexus Emblem into CTA Section

**Done**
- **CTA Section Brand Mark (`RegisterCTASection.tsx`)**:
  - Replaced the SVG `<NexusMark />` with the official user-provided high-resolution Nexus Vyoma symbol asset (`/brand/nexus-mark.png`).
  - Added Next.js `<Image>` component with responsive sizing, `priority` loading, `mix-blend-screen` for seamless dark gradient integration, and luminous ambient drop-shadow (`drop-shadow-[0_0_30px_rgba(255,106,0,0.55)]`).
- **Brand Assets**:
  - Saved official asset to both `public/brand/nexus-mark.png` and `brand/assets/nexus-mark.png`.
- **Verified**: Next.js production build (`npm run build`) passed with 0 errors.

### 2026-10-08 — Reverse Logo Transition & Interactive Cursor-Reveal Footer Complete

**Done**
- **Reverse Logo Transition (`HeroNavbarTransition.tsx`)**:
  - Implemented bidirectional GSAP ScrollTrigger coordinated with `#footer`: as the footer enters the viewport, the floating mirror-glass navbar smoothly lifts and fades away (`opacity: 1 -> 0`, `y: 0 -> -25px`).
  - The `NEXUS VYOMA` logo simultaneously descends out of the navbar towards the footer anchor slot while expanding in scale, closing the experiential visual loop that began at the hero.
- **Monumental Outlined Footer Logo (`FooterLogoReveal.tsx`, `FooterSection.tsx`)**:
  - Rendered huge `NEXUS VYOMA` centerpiece in pure clean outline (`-webkit-text-stroke: 1.5px rgba(255,255,255,0.45)`, zero solid fill, empty transparent interior).
- **Magnetic Cursor-Reveal Color Effect (`FooterLogoReveal.tsx`)**:
  - Implemented GPU-accelerated localized feathered radial mask (`mask-image: radial-gradient(...)`) tracking the cursor on RAF.
  - As the cursor glides across the outline logo, the vibrant official Nexus Vyoma brand gradient (red, orange, gold, and white) with warm luminous glow burns smoothly into existence around the pointer, fading back to pure outline when the cursor leaves.
- **Minimal Cinematic Footer Layout**: Clean institutional credentials for ISL Engineering College, navigation links, and copyright with continuous global WebGL Galaxy + Aurora background continuity.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Continuous Non-Stop 3D Carousel Drift & Enlarged Crisp Cards

**Done**
- **Continuous Uninterrupted Drift (`CircularCarousel.tsx`, `SponsorsSection.tsx`)**:
  - Ensured the RAF animation loop runs permanently without pausing on hover or settling into sleep states (`pauseOnHover={false}`, non-blocking momentum, active RAF loop guarantee).
- **Enlarged High-Precision Cards**:
  - Increased card dimensions from `220px` to **`260px × 260px`** (`cardWidth={260}`) with `aspectRatio={1}`.
  - Enhanced visual clarity: `border-white/20`, specular edge highlight `inset 0 1px 0 rgba(255,255,255,0.2)`, `depthFade={0.42}` for razor-sharp logo visibility throughout the 3D cylinder.
- **Stage Scaling**: Adjusted carousel stage container to `h-[520px] sm:h-[580px]` with generous vertical margins.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — “OUR SPONSORS” 3D Cylindrical Carousel Redesign

**Done**
- **Editorial Hierarchy (`SponsorsSection.tsx`)**:
  - Replaced former heading with **“OUR SPONSORS”** in Space Grotesk, uppercase, bold display typography with clean gold accent eyebrow (`"POWERED BY"`).
- **Master 3D Cylindrical Carousel (`CircularCarousel.tsx`, `SponsorsSection.tsx`)**:
  - Wired exact requested configuration: `preset="cylinder"`, `intro="rise"`, `cardWidth={220}`, `aspectRatio={1}`, `speed={14}`, `captions={false}`, `gap={25}`, `tilt={-5}`, `curve={1}`, `perspective={2500}`, `autoplay="drift"`, `interval={3}`, `direction="left"`, `momentum={0.6}`, `snap`, `pauseOnHover`, `focusOnClick`, `draggable`, `parallax={0.3}`, `stretch={0.5}`, `fadeColor="#000000"`, `depthFade={0.55}`, `innerShade={0.6}`, `cornerRadius={12}`.
  - Refactored carousel cards into 1:1 square translucent glass floating objects (`220px × 220px`) with centered, uncropped `object-contain` sponsor logos.
- **Continuous Cosmic Flow**: Preserved the uninterrupted global hardware-accelerated Galaxy + Aurora background with zero horizontal seams.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — About Manifesto 0.5x Synced Scroll Speed & Smooth Scrub Tuning

**Done**
- **Scroll Synchronization (`ScrollReveal.tsx`, `AboutSection.tsx`)**: Extended the ScrollTrigger tracking range (`start: "top 75%"`, `end: "bottom+=120% 35%"`) and configured `scrub: 1.2` with `baseRotation: 0`.
- **Pacing**: The word-by-word blur and opacity reveal now proceeds at a relaxed, deliberate 0.5x scroll rate perfectly synchronized with the user's natural scroll gesture.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — About Section Manifesto Text & Barlow Condensed Typography Update

**Done**
- **Copy Update (`AboutSection.tsx`)**: Replaced manifesto copy with: *"Three days. One shared sky. Nexus Vyoma brings culture and technology together at ISL Engineering College, Hyderabad."*
- **Typography Integration (`layout.tsx`, `AboutSection.tsx`)**: Added `Barlow_Condensed` (Google Fonts, weights 400–700) with exact styling:
  - Font: Barlow Condensed (`--font-barlow-condensed`)
  - Size: `44px` desktop (`text-[28px] sm:text-[36px] md:text-[44px]`)
  - Weight: `500` (`font-medium`)
  - Line height: `116%` (`leading-[1.16]` / `51.04px`)
  - Color: `#FFFFFF`
  - Style: Normal (`not-italic`)
  - Alignment: `self-stretch w-full`
- **Preserved**: Section layout, Space Grotesk subheading, subtle official watermark, and continuous WebGL background.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Hero Reload Glitch Resolution & Section Pill Badges Cleanup

**Done**
- **Hero Logo Reload Glitch Fix (`HeroNavbarTransition.tsx`)**:
  - Implemented scroll-invariant coordinate calculation (`startLeft = heroRect.left + currentScrollX`, `startTop = heroRect.top + currentScrollY`) to prevent coordinate miscalculation when the page is reloaded with scroll offset.
  - Added font readiness listener (`document.fonts.ready`) to ensure GSAP measures bounding rects only after font and layout geometries stabilize.
  - Eliminated initial render jump and layout flicker on all reload conditions (soft, hard, resized).
- **Global Pill Badges Removal**:
  - Removed pill badges across `FlagshipScrollDeck.tsx`, `SponsorsSection.tsx`, and `RegisterCTASection.tsx` for a clean editorial presentation.
  - Cleaned up unused `Spark` imports across the codebase to maintain 0 ESLint warnings.
- **Verification & Lock**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings. Hero, About, and Flagship sections locked and verified.

### 2026-10-08 — Clean About Section Subheading & Pillar Cards Streamlining

**Done**
- **Modern Subheading (`AboutSection.tsx`)**: Added left-aligned `"ABOUT NEXUS VYOMA"` heading styled in Space Grotesk (`font-sans`), medium weight, uppercase, small size with subtle tracking (`tracking-[0.25em]`), and warm gold/orange gradient accent (`from-[#FF6A00] to-[#FBB03B]`) paired with a brand spark icon.
- **Removed 4 Pillars Grid**: Eliminated the redundant four pillar cards (`IDEAS`, `PEOPLE`, `CULTURE`, `BEYOND`) and intermediate dividers to create a cinematic, unobstructed focus on the manifesto with the official emblem watermark.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Flagship Events 3D Stacking Deck (<FlagshipScrollDeck />) with Emergence from Behind

**Done**
- **Flagship 3D Stack Deck (`FlagshipScrollDeck.tsx`)**: Created a master pinned scroll-deck component integrating the `<ScrollExpand />` choreography:
  - **Sequential Depth Emergence**: Each subsequent card (e.g. *Mega DJ Night* behind *Cosplay Championship*) emerges directly from inside/behind the previous card (`scale: 0.65 -> 1.0`, `z-depth`, `blur: 12px -> 0px`).
  - **Center-to-Left Shift**: Cards expand from center and glide smoothly to the left docked column.
  - **Right Content Reveal**: Synchronously reveals the display Title and Description with smooth opacity and blur clearing.
  - **Minimal Content Lock**: Strictly displays only the Title and Description text.
  - **Mobile & Motion**: Supported across all viewports with `prefers-reduced-motion` compliance.
- **Flagship Section Mounting (`FlagshipEventsSection.tsx`)**: Mounted the master scroll deck in the main page flow.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Flagship Events Scroll-Choreographed Shift & Minimal Title/Description Reveal

**Done**
- **Flagship Card Item Component (`FlagshipCardItem.tsx`)**: Created dedicated scroll-choreographed cards with GSAP ScrollTrigger timeline:
  - **Phase 1 (Center to Left Shift)**: Visual card starts centered in the viewport and smoothly translates to the left docked column as user scrolls down.
  - **Phase 2 (Content Fade & Blur Reveal)**: Simultaneously reveals only the high-contrast display Title and Description on the right side with a smooth opacity and blur clearing transition.
  - **Strict Content Lock**: Removed all pass prices, "Book Pass" / "View Details" buttons, arena directives, and secondary metadata badges per user requirements.
  - **Responsive & Motion**: Adapted for mobile screens with vertical scaling reveals, fully respecting `prefers-reduced-motion`.
- **Sequential Pinned Track (`FlagshipEventsSection.tsx`)**: Wired all 6 official flagship events into sequential sticky-scroll tracks for smooth progression between arenas.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Flagship Split Scroll Cards (<ScrollExpand />) & Cinematic Manifesto (<ScrollReveal />) Integration

**Done**
- **React Bits `<ScrollReveal />` Integration (`components/ui/ScrollReveal.tsx`, `ScrollReveal.css`)**: Built a GSAP ScrollTrigger word-by-word opacity and blur scrubber for the festival manifesto in `AboutSection.tsx`, featuring gentle 3D rotation, wide spacing, and a subtle official emblem watermark (`/brand/nexus-emblem-watermark.png`).
- **React Bits `<ScrollExpand />` Integration (`components/ui/ScrollExpand.tsx`, `ScrollExpand.css`)**: Implemented the frame expansion animation component with window scroll listeners, smoothstep easing, and dynamic card scaling.
- **Flagship Events Split Card Layout (`components/events/FlagshipEventsSection.tsx`)**: Refactored flagship events into sequential sticky-scroll reveal cards with a dedicated split layout:
  - **Left column (5 cols)**: Category vector motif (`<EventIcon />`), dark glass frame, category badge, and arena directives preview.
  - **Right column (7 cols)**: Chrono badge, venue, prize pool, arena title, description, and direct registration CTAs.
- **Cleanup & Seam Elimination**: Removed the redundant `ExperienceHighlights` grid (`app/page.tsx`), ensuring the global fixed WebGL Galaxy + Aurora background flows continuously without interruption.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Seamless Background Continuity, Official Emblem Watermark & Clean Experience Transition

**Done**
- **Removed Experience Highlights Header (`ExperienceHighlights.tsx`)**: Completely removed `"IMMERSIVE HIGHLIGHTS"` pill badge, `"THE EXPERIENCE SPECTRUM"` heading, and the descriptive subtitle for an unobstructed flow into the interactive cards.
- **Eliminated All Horizontal Seams & Overlays (`HeroNavbarTransition.tsx`, `AboutSection.tsx`, `ExperienceHighlights.tsx`, `FlagshipEventsSection.tsx`, `SponsorsSection.tsx`, `FooterSection.tsx`)**: Removed bottom hero corner vignettes, section-specific glow blobs, and opaque footer backgrounds. The single global fixed **Galaxy + Aurora** WebGL background flows continuously and uninterrupted across the entire page.
- **Official Nexus Emblem Logo Watermark (`AboutSection.tsx`)**: Integrated the provided official Nexus Emblem mark (`/brand/nexus-emblem-watermark.png`) as a transparent, low-opacity (~0.08) watermark behind the left-aligned About manifesto with subtle GSAP scroll parallax.
- **Verified**: ESLint and Next.js Turbopack production build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Global DualBackground Exact Mounting & Root Transparency

**Done**
- **Exact DOM Specification (`DualBackground.tsx`)**: Refined the fixed dual-layer background with exact parameters (`position: "fixed"`, `inset: 0`, `width: "100vw"`, `height: "100vh"`, `zIndex: -10`, `pointerEvents: "none"`) layering WebGL Galaxy (`transparent: false`, `hueShift: 205`) at zIndex 1 and WebGL Aurora waves (`mixBlendMode: "screen"`, `opacity: 0.9`, color stops `["#3c0fef", "#f51414", "#ffb127"]`, `amplitude: 1`, `blend: 0.5`, `speed: 1`) at zIndex 2.
- **Root Background Transparency (`layout.tsx`, `globals.css`)**: Removed opaque canvas fills on `<body>` to ensure the live hardware-accelerated WebGL starfield and aurora waves remain 100% visible behind all content across every section and while scrolling.
- **Verified**: ESLint and Next.js Turbopack build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Ultra-Minimal Cinematic Hero Composition

**Done**
- **Stripped All Extra Elements (`HeroNavbarTransition.tsx`)**: Removed all buttons (*EXPLORE*, *DISCOVER MORE*), supporting paragraph descriptions, eyebrow badges (*ENTER THE NEXT DIMENSION*), vertical poster pillars (category colors, manifesto text, dates matrix `10 | 11 | 12 NOV 2026`), bottom arena icon badges (Auto Expo, DJ, Cosplay, Qawwali, Tech Battles), and scroll indicator.
- **Pure Centered NEXUS VYOMA Canvas**: Kept exclusively the official flaming wordmark logo (`/brand/nexus-wordmark-official.png`) perfectly centered horizontally and vertically within the full-screen (100vw × 100vh) viewport.
- **Continuous Navbar Transition Preserved**: The centered hero logo smoothly contracts and docks into the floating iPhone Dark Mirror Glass Navbar upon scrolling down towards the About section.
- **Verified**: ESLint and Next.js Turbopack build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — About Section Left Alignment, Medium Watermark & Badge Removal

**Done**
- **Removed Pill Badge (`AboutSection.tsx`)**: Removed the top `"ABOUT NEXUS VYOMA"` badge container for a cleaner visual entrance.
- **Left-Aligned Typography**: Aligned the manifesto paragraph and the `"IDEAS • PEOPLE • CULTURE • BEYOND"` motto subtitle directly to the left (`items-start text-left`).
- **Medium Watermark Behind Text**: Positioned the official Nexus Vyoma wordmark watermark (`/brand/nexus-wordmark-official.png`) directly behind the manifesto text block at a medium scale (`max-w-2xl`, ~700px width) with low opacity (~0.08) and smooth scroll-triggered parallax drift.
- **Verified**: ESLint and Next.js Turbopack build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Global Animated DualBackground & 7-Section Futuristic Architecture

**Done**
- **Global DualBackground Integration (`DualBackground.tsx`)**: Mounted the layered WebGL `Galaxy` (starfield) and `Aurora` (fluid waves with exact stops `["#3c0fef", "#f51414", "#ffb127"]`, `mixBlendMode: 'screen'`, `opacity: 0.9`) fixed behind all content across the entire application in `app/layout.tsx`.
- **Hero Futuristic Direction (`HeroNavbarTransition.tsx`)**: Refined the full-screen Hero with eyebrow badge *"ENTER THE NEXT DIMENSION"*, official wordmark, supporting statement, *"EXPLORE"* & *"DISCOVER MORE"* CTAs, and subtle scroll indicator.
- **About Section with Cosmic Logo Watermark (`AboutSection.tsx`)**: Embedded a large, centered, low-opacity (~0.065) official Nexus Vyoma watermark behind the approved about paragraph (*"Nexus Vyoma is where technology, creativity and immersive experiences converge..."*).
- **7-Section Architecture**: Assembled all 7 sections seamlessly over the animated cosmic background (`Hero`, `About`, `Experience Highlights`, `Flagship Arenas`, `Partners & Sponsors`, `Register Pass CTA`, `Footer`).
- **Verified**: ESLint and Next.js Turbopack build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Silky Smooth Logo-to-Navbar Motion Curve & Hero Header Removal

**Done**
- **Unified Continuous Logo Motion (`HeroNavbarTransition.tsx`)**: Refactored the floating logo trajectory into a single, continuous mathematical `power2.inOut` interpolation curve across the entire scrub window, eliminating multi-stage trajectory kinks and jerky transitions.
- **Synchronized Mirror-Glass Navbar Lock**: Synchronized the floating iPhone Dark Mirror Glass Navbar materialization (`opacity: 0 → 1`, `y: -20 → 0`, `scale: 0.96 → 1`) to settle into resting state in exact unison with the logo docking.
- **Pure Cinematic Hero Canvas**: Removed the top header bar (`ISL ENGINEERING COLLEGE`, `HYDERABAD`, dates, top border) from the Hero section, unlocking a 100% pure, unhindered cinematic poster space.
- **Verified**: ESLint and Next.js Turbopack build passed cleanly with 0 errors and 0 warnings.

### 2026-10-08 — Full-Screen Hero Viewport Composition & Cinematic Corner Vignette

**Done**
- **Full-Screen Hero Architecture (`HeroNavbarTransition.tsx`)**: Transformed the Hero from an inset card into a true edge-to-edge 100vw × 100vh / 100svh viewport composition:
  - Removed outer card container (`max-w-7xl`, `rounded-3xl`, `border border-white/10`, `bg-[#0A0F1E]/50`, and backdrop blur).
  - Background flows seamlessly to every edge of the viewport.
- **Subtle Cinematic Corner Vignette**: Added a multi-radial CSS edge falloff overlay (`pointer-events-none`) providing soft corner depth without circular blobs, neon rings, or glowing artifacts.
- **Removed Moving Star / Particle Object**: Completely deleted `MotionPathOrb.tsx` and removed its mounting in [`app/page.tsx`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/app/page.tsx), eliminating the decorative moving star animation and unnecessary DOM/GSAP loops.
- **Preserved Core Hero Design**: Retained official logo asset, Anton headings, Space Grotesk UI text, buttons, category lists, dates, and bottom arena row.
- **Verified**: ESLint and Next.js Turbopack build passed with 0 errors and 0 warnings.

### 2026-10-08 — Typography Upgrade (Anton & Space Grotesk) & Clean About Section

**Done**
- **Home Page Typography System**:
  - **Display / Hero Headings**: Configured Google Font `Anton` (`--font-display` / `font-display`).
  - **Body / UI / Navigation**: Configured Google Font `Space Grotesk` (`--font-body` / `font-sans`).
  - Integrated directly via `next/font/google` in [`app/layout.tsx`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/app/layout.tsx) and updated [`brand/tokens.css`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/brand/tokens.css).
- **Clean About Manifesto**: Stripped colored gradient fills from the manifesto paragraph in [`AboutSection.tsx`](file:///Users/syedfahad/Developer/College/Nexus%20Vyoma/registration-pages/components/about/AboutSection.tsx), establishing uniform clean high-contrast white text with scroll-scrubbed opacity reveal.
- **Verified**: ESLint and Next.js Turbopack production build compiled with 0 errors and 0 warnings.

**Done**
- **Design System Cohesion**: Harmonized all sections (`Hero`, `About`, `Flagship Arenas`, `Partners/Sponsors`, `Register CTA`, and `Footer`) to embody the brand's core pillars:
  - **Modern & Bold**: Condensed typography hierarchy, high-contrast dark mirror glassmorphism, crisp white headings, and vibrant energy gradients.
  - **Youthful & Energetic**: Dynamic micro-interactions, responsive hover glow states, and smooth scrubbed GSAP waypoints.
  - **Tech + Cultural**: Fusion of technical arena iconography with Qawwali, DJ, and Cosplay cultural art motifs.
  - **Dark Aesthetic**: Deep obsidian canvas (`#06080F`), chromatic gradient wave ribbon (`#FF6A00` → `#D8182B` → `#FF207D` → `#0066FF`), and subtle hardware-accelerated SVG noise grain.
  - **Clean & Readable**: High-contrast AA typography, clear hierarchy, structured grid cards, and zero AI-slop clutter.
- **Verified**: ESLint and Next.js Turbopack build passed with 0 errors and 0 warnings.

### 2026-10-08 — Poster Visual Elements: Gradient Waves, Light Glows, Grain & Sparks

**Done**
- **Volumetric Gradient Waves & Depth Blooms (`GradientWaveMesh.tsx`)**: Created organic S-curve chromatic wave ribbon flowing through the poster color stops (`#FF6A00` → `#D8182B` → `#FF207D` → `#0066FF`) with screen blend mode and optical depth radial glows.
- **Abstract Dark Grain Background (`DualBackground.tsx`)**: Upgraded background atmosphere with hardware-accelerated SVG noise texture (`feTurbulence` fractal noise grain) over deep obsidian canvas (`#06080F`).
- **Poster-Grade Editorial Layout (`HeroNavbarTransition.tsx`)**: Integrated the official poster's structural framing:
  - Top-left vertical micro-column: `PEOPLE · IDEAS · CULTURE · INNOVATION · BEYOND`.
  - Top-right vertical micro-column: `A HIGHER TOMORROW TOGETHER`.
  - Left vertical axis: 4-point Spark star (`<Spark />`), category color tags (`AUTO EXPO`, `DJ`, `COSPLAY`, `QAWWALI`, `TECHNICAL EVENTS`), and `DIFFERENT WORLDS SAME SKY`.
  - Right vertical axis: `10 | 11 | 12 | NOV | 2026` + `WORLDS MEET HERE`.
  - Bottom 5-arena badge showcase with vector motifs and official captions.
  - Minimal diagonal hairline streaks for subtle atmospheric depth.
- **Section Polish (`AboutSection.tsx`, `FlagshipEventsSection.tsx`)**: Enhanced with optical light blooms and 4-point glowing sparks.
- **Verified**: ESLint and Next.js Turbopack build compiled with 0 errors and 0 warnings.

### 2026-10-08 — Synchronous Logo & Navbar Appearance Timing

**Done**
- **Synchronized Appearance Timing (`HeroNavbarTransition.tsx`)**: Aligned the floating logo docking tween and the iPhone Dark Mirror Glass Navbar materialization tween to execute with identical timestamp (`0.45`), duration (`0.55`), and easing (`power2.out`), so both elements arrive at their resting state in lockstep synchrony.
- **Removed ISL Graphic Logo**: Removed the ISL logo mark from the Hero top banner; retained clean typography banner metadata (`ISL ENGINEERING COLLEGE • HYDERABAD` and `10·11·12 NOV 2026`).
- **Verified**: ESLint and Next.js Turbopack production build compiled with 0 errors and 0 warnings.

### 2026-10-08 — Navbar About Approach Trigger & Clean Hero Image Refactor

**Done**
- **Navbar ScrollTrigger Materialization**: Isolated `Navbar.tsx` with self-contained `ScrollTrigger` that keeps the navbar completely hidden during initial Hero viewport and smoothly glides it in (`opacity: 1, y: 0`) with iPhone Dark Mirror Glass styling as the user scrolls out of Hero and approaches the About section.
- **Pure Hero Logo Asset**: Streamlined the Hero center to use exclusively the official transparent flaming wordmark image (`/brand/nexus-wordmark-official.png`), removing all external text duplications, badges, and decorative colored blur blobs.
- **Architecture Simplification**: Directly composed `Navbar.tsx` and `HeroSection.tsx` in `app/page.tsx` for optimal SSR/CSR separation and robust scroll interaction.
- **Verified**: ESLint and Next.js Turbopack build passed cleanly with 0 errors.

### 2026-10-08 — Navbar Visibility & Pure Hero Official Image Refactor

**Done**
- **Root Coordinate Architecture**: Repositioned the transitioning Nexus Vyoma Logo actor outside transformed hero parent containers to eliminate stacking context containment issues.
- **Pure Hero Logo Asset**: Streamlined the Hero center to use exclusively the official transparent flaming wordmark image (`/brand/nexus-wordmark-official.png`), removing all external text duplications, badges, and decorative colored blur blobs.
- **iPhone Mirror Glass Material**: Polished the floating navbar capsule with specular top reflection sheen, `rgba(10, 15, 30, 0.78)` deep translucent base, `24px` backdrop blur, and layered elevation shadow.
- **Verified**: ESLint and Next.js Turbopack build passed with 0 errors.

### 2026-10-08 — Hero-to-Navbar Scroll Waypoint Transformation & iPhone Mirror Glass

**Done**
- **Official Brand Asset Staging**: Integrated official transparent flaming wordmark (`/brand/nexus-wordmark-official.png`) as the central Hero identity.
- **Scroll Waypoint System (`HeroNavbarTransition.tsx`)**: Built unified GSAP `ScrollTrigger` master timeline across 5 design states:
  - `Waypoint 0 (Hero Rest)`: Navbar completely invisible (opacity: 0); Hero owns 100% of upper visual frame.
  - `Waypoint 1 (Hero Exit)`: Logo begins contracting and initiates upward trajectory.
  - `Waypoint 2 (Transition / Travel)`: Logo moves along smooth waypoint path toward navbar slot; iPhone mirror-glass navbar begins materializing.
  - `Waypoint 3 (Navbar Approach)`: Logo approaches compact size; navbar links and Ticket button fade in.
  - `Waypoint 4 (Navbar Lock)`: Logo locks into navbar left alignment seamlessly; 100% bidirectional scrub reversibility.
- **iPhone Dark Mirror Glass Navigation (`Navbar.tsx`)**: Implemented translucent deep navy/black glass (`rgba(10, 15, 30, 0.72)` + `backdrop-filter: blur(20px)`), specular top reflection sheen, micro-border, and layered floating elevation shadow.
- **Strict Rule Compliance**: Zero duplicate logos, zero layout shifts, full `prefers-reduced-motion` support, and verified with `npm run lint` & `npm run build` (0 errors).

### 2026-10-08 — Master Home Page Implementation & Cinematic Motion System

**Done**
- **01 — Spatial Glass Navigation (`Navbar.tsx`)**: Built iPhone spatial glass floating navigation with responsive mobile menu, backdrop blur, and direct action triggers.
- **02 — Hero Section (`HeroSection.tsx`)**: Implemented 100vh cinematic frame with GSAP ScrollTrigger recession effect (scale 1.0 → 0.85, border-radius morph 0px → 32px), ISL Engineering College identity, and official flaming wordmark.
- **03 — MotionPath Orb (`MotionPathOrb.tsx`)**: Built continuous GSAP MotionPathPlugin waypoint traveller guiding the user through Navbar → Hero → About → Footer.
- **04 — About Manifesto (`AboutSection.tsx`)**: Integrated continuous scroll text scrub reveal with fiery highlighted keywords and 4 interactive core pillar cards (Ideas, People, Culture, Beyond).
- **05 — Flagship Arenas (`FlagshipEventsSection.tsx`)**: Created spatial perspective card arena with category filtering, official vector iconography, guidelines pills, and pass booking triggers.
- **06 — Partners & Sponsors (`SponsorsSection.tsx` & `CircularCarousel.tsx`)**: Integrated 3D React Bits Circular Orbit Carousel with continuous drift, depth fade, and hover pause.
- **07 — Register CTA (`RegisterCTASection.tsx`)**: Built high-impact editorial festival ticket portal call to action with quick meta perks.
- **08 — Cinematic Footer (`FooterSection.tsx`)**: Designed oversized gradient-stroke display text ("NEXUS VYOMA") revealing via layered clip-path mask on scroll.
- **Strict Rule Compliance**: Zero external unapproved photos (Rule 6), SSR-first architecture with leaf client components (Rule 1), and ESLint + Turbopack build validation (0 errors).

### 2026-10-08 — Strict Asset & Visual Lock Policy Enacted

**Done**
- Codified **Rule 6 (Strict Asset / Visual Lock)** in [`AGENTS.md`](./AGENTS.md) and [`README.md`](./README.md).
- Enforced zero unapproved visual assets policy: strictly no stock imagery, no AI-generated images, no external demo visuals from React Bits, and no placeholder URLs.
- Established strict missing asset procedure: maintain UI layout and structure while awaiting official assets, never substituting with external placeholders.

### 2026-10-08 — Collaborative Dual Effect Background (Galaxy + Aurora)

**Done**
- Installed `ogl` WebGL library for shader-based rendering.
- Built [`components/ui/Galaxy.tsx`](./components/ui/Galaxy.tsx): Interactive WebGL particle starfield shader with speed, density, hue-shift, twinkle intensity, and mouse lerp tracking.
- Built [`components/ui/Aurora.tsx`](./components/ui/Aurora.tsx): Fluid WebGL simplex noise aurora waves shader with customizable multi-stop color ramps (`#3c0fef`, `#f51414`, `#ffb127`).
- Built [`components/ui/DualBackground.tsx`](./components/ui/DualBackground.tsx): Dual-layer composite combining Galaxy starfield (Layer 1) and Aurora fluid waves (Layer 2) with `mix-blend-mode: screen` and 90% opacity.
- Updated [`app/page.tsx`](./app/page.tsx) to mount `<DualBackground />` behind the Home page content with responsive full-viewport scaling and WebGL context cleanup.
- Validated with Next.js Turbopack build (`npm run build`, exit code 0).

### 2026-10-07 — User Cursor Component Integration

**Done**
- Built [`components/cursor/UserCursor.tsx`](./components/cursor/UserCursor.tsx): Live collaborator cursor with personalized name tag and brand presets (`orange`, `crimson`, `blue`, `lime`, `purple`).
- Features: Smooth spring/lerp tracking, touch-device auto-detection & disable, window edge fade-out, `mousedown` scale feedback, and zero-dependency Next.js 16 leaf client component architecture.
- Verified with ESLint (0 errors/warnings) and production build (`npm run build`, exit code 0).

### 2026-10-07 — Official Brand Design System & Vector Assets Integration

**Done**
- **Precision Brand Components:**
  - Integrated the official **Nexus Symbol / Mark** ([`NexusMark.tsx`](./components/brand/NexusMark.tsx)) featuring the 3-tier color segments (Crimson Red `#D8182B` → Deep Orange `#FF6A00` → Golden Amber `#FBB03B`), white orbit ring, and 4-point golden star spark.
  - Built the official **Flaming Wordmark** ([`NexusWordmark.tsx`](./components/brand/NexusWordmark.tsx)) with flame gradient text, arched display, and *"A THREE-DAY INTER-COLLEGE FEST"* subtitle.
  - Built the official **ISL Engineering College Logo** ([`ISLLogo.tsx`](./components/brand/ISLLogo.tsx)) with the geometric lime-green crest (`#98D800`) and Indigo Blue typography (`#3B49DF`).
  - Built the **4-Point Star / Spark Element** ([`Spark.tsx`](./components/brand/Spark.tsx)) with golden radial aura.
  - Built the official **Event Category Icons & Badges** ([`EventIcons.tsx`](./components/brand/EventIcons.tsx)) covering Cosplay (*Characters Live On*), DJ (*Feel Every Beat*), Automobile Expo (*Machines Move People*), Qawwali Night (*Let The Soul Sing*), Tech Battles (*Think. Build. Conquer.*), and Food Fest (*Taste The Celebration*).
  - Built **Visual Textures & Cosmic Background** ([`VisualTextures.tsx`](./components/brand/VisualTextures.tsx)) featuring atmospheric nebula glows, 45° laser streaks, and grain.
- **Design Tokens & Event Data:**
  - Updated [`brand/tokens.css`](./brand/tokens.css) & [`brand/tokens.json`](./brand/tokens.json) with exact color codes, glow formulas, and typography variables.
  - Created [`lib/data/events.ts`](./lib/data/events.ts) with complete fest metadata, venue rules, dates, and pricing.
  - Updated [`brand/BRAND_GUIDE.md`](./brand/BRAND_GUIDE.md) and [`app/layout.tsx`](./app/layout.tsx) with Bebas Neue display font, Inter body font, and fest SEO metadata.

### 2026-10-07 — Project setup and rules

**Done**
- Added project rules to [AGENTS.md](./AGENTS.md): SSR/CSR split, animation skills and design quality, plan-before-build, payment security and README logging. The auto-generated Next.js block is preserved.
- Added [CLAUDE.md](./CLAUDE.md), which imports `AGENTS.md`, so the rules load on every prompt.
- Created `brand/` with [BRAND_GUIDE.md](./brand/BRAND_GUIDE.md), `tokens.css`, `tokens.json` and `assets/`. The palette was transcribed from the brand image.
- Added `.env.example` for payment and site config, and updated `.gitignore` so it stays tracked.
- Rewrote this README.

**Follow-ups**
- Drop the original brand images and logos into `brand/assets/`. The chat image can't be saved automatically.
- Confirm the palette hex values and the display font (Anton vs Bebas Neue).
- Choose a payment gateway (Razorpay, Stripe or Cashfree).
- Next prompt: start the website. An implementation plan comes first.
