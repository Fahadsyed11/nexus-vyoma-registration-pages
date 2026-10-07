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

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Activity Log

Newest first.

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
