# Nexus Vyoma — Official Brand Style Guide & Design System

Source: Official Nexus Vyoma Brand Style Guide & Poster Specifications.  
Tokens: [`tokens.css`](./tokens.css), [`tokens.json`](./tokens.json)  
Components: [`components/brand/`](../components/brand/)

---

## 1. Event Identity

| Property | Value |
|---|---|
| **Event Name** | **NEXUS VYOMA** |
| **Tagline / Main Line** | **A THREE-DAY INTER-COLLEGE FEST** |
| **Organized by** | **ISL Engineering College, Hyderabad** |
| **Dates** | **10 · 11 · 12 NOV 2026** |
| **Motto / Core Idea** | **Ideas • People • Culture • Beyond** |
| **Location** | Bandlaguda, Chandrayangutta, Hyderabad, Telangana 500005 |

---

## 2. Brand Components & Vector Assets

### 2.1 Symbol / Mark (`NexusMark.tsx`)
- **Structure:** 3-tier horizontal sliced diagonal **X** crossed by a white orbital ellipse loop with a 4-point golden star spark.
- **Top Segment:** Crimson Red gradient (`#D8182B` → `#9C0B1B`) with smooth curved top-left shoulder.
- **Middle Segment:** Vivid Deep Orange (`#FF6A00` → `#E54E00`).
- **Bottom Segment:** Golden Amber (`#FBB03B` → `#D98A00`) with clean 45-degree sheared base.
- **Orbit Ring:** High-contrast crisp White (`#FFFFFF`) swooping across the mid-section.
- **Star Spark:** 4-point golden star with warm halo.

### 2.2 Event Logo / Flaming Wordmark (`NexusWordmark.tsx`)
- High-impact condensed bold uppercase with curved bottom arch.
- Fire/flame gradient core fill (`#FFFFFF` → `#FFE0B2` → `#FF6A00` → `#B80F1F`) with ambient fiery glow.
- Flanked by four-point white/gold sparks.
- Subtitle: `A THREE-DAY INTER-COLLEGE FEST` with wide letter-spacing (`tracking-[0.35em]`).

### 2.3 College Logo (`ISLLogo.tsx`)
- Geometric Lime Green crest (`#98D800` / `#A3E635`): Apex circle + dual vertical chevron wings.
- Royal / Indigo Blue institutional typography (`#3B49DF`): `ISL` over `ENGINEERING` and `COLLEGE`.

### 2.4 Star / Spark Element (`Spark.tsx`)
- Minimalist 4-point flare element with center core highlight and golden/white glow aura.

---

## 3. Color Palette

### Primary / Base Colors
| Swatch | Name | Hex | Description |
|---|---|---|---|
| ⬛ | Deep Black | `#000000` | Core backdrop & void space |
| 🌌 | Navy Blue | `#0A0F1E` | Deep atmospheric layers & card backings |
| 🔴 | Crimson Red | `#D8182B` | Upper mark segment & ember highlights |
| 🏮 | Crimson Dark | `#B80F1F` | Deep shadow embers & border gradients |
| 🟠 | Deep Orange | `#FF6A00` | Core energy, mark mid-tier & primary CTA |
| 🟡 | Golden Amber | `#FBB03B` | Mark bottom segment & spark accents |

### Accent Colors (Gradients & Glows)
| Swatch | Name | Hex | Description |
|---|---|---|---|
| 🔵 | Electric Blue | `#0066FF` | Cosmic nebula highlights & lasers |
| 💖 | Magenta / Pink | `#FF207D` | Secondary cosmic rim lighting |
| 🔴 | Red Orange | `#FF3B2E` | Intermediate flame transitions |
| 🟣 | Subtle Purple | `#7B2CFF` | Cosmic nebula depth transitions |

### Neutral Colors
| Swatch | Name | Hex | Description |
|---|---|---|---|
| ⚪ | White | `#FFFFFF` | Primary headings, orbit rings & key text |
| 🔘 | Light Grey | `#E5E5E5` | Secondary text, captions & subheadings |
| ⬛ | Dark Grey | `#1A1A1A` | Surface backgrounds & container cards |

---

## 4. Typography

- **Headings & Poster Titles:** `Bebas Neue` (Display) / `Anton` — Bold condensed, uppercase, high tracking.
- **Subheadings & Badges:** `Inter` / `Manrope` — Medium weight, wide tracking (`0.3em` to `0.45em`).
- **Body & Rules Text:** `Inter` — Clean, legible, high-contrast sans-serif.

---

## 5. Official Category Icons & Captions (`EventIcons.tsx`)

| Category | Official Caption | Icon Motif |
|---|---|---|
| **Cosplay** | `CHARACTERS LIVE ON` | Drama mask with dual shadow split |
| **DJ** | `FEEL EVERY BEAT` | Studio headphones with acoustic cups |
| **Automobile Expo** | `MACHINES MOVE PEOPLE` | Aerodynamic sports car with speed streaks |
| **Qawwali Night** | `LET THE SOUL SING` | Traditional Mughal dome arch silhouette |
| **Tech Battles** | `THINK. BUILD. CONQUER.` | Laptop terminal with connected node graph |
| **Food Fest** | `TASTE THE CELEBRATION` | Cloche serving platter with dome lid |

---

## 6. Design Tone & Rules
- **Modern · Bold · Youthful · Energetic · Tech + Cultural · Dark Aesthetic**
- **No generic AI slop:** Always use official color tokens, high-contrast dark space backgrounds, clean typography, and precise geometry.
- **Responsive & Accessible:** Minimum touch targets of 44px, AA contrast compliance, and support for `prefers-reduced-motion`.
