<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Nexus Vyoma — Project Rules

> **MANDATORY: Read this whole file at the start of EVERY prompt, even if the user does not mention it.**
> `CLAUDE.md` points here, so this is the single source of truth. Edit rules here only.

**Project:** Nexus Vyoma registration site, a three-day inter-college fest by ISL Engineering College, Hyderabad (10–12 Nov 2026).

## Rule 1 — Next.js rendering: SSR first, CSR only when needed

- Default to **Server Components** (SSR). Pages, layouts, data fetching and static content stay on the server.
- Add `"use client"` **only** for components that need browser APIs or interactivity: `window`, `document`, `localStorage`, GSAP/Framer Motion, event handlers, `useState`/`useEffect`, form interactivity, the payment checkout widget.
- Keep client components **small and leaf-level**, in `components/`. A server page composes them. Never mark a whole page as client just for one animation.
- Pass data from server to client through props. Don't fetch in `useEffect` when a server component can do it.
- Use Server Actions or Route Handlers (`app/api/**`) for mutations. Validate on the server.
- Before using any Next.js API, check `node_modules/next/dist/docs/` (see the block above).

## Rule 2 — Design, animation and responsiveness

- **Brand source of truth:** [`brand/`](./brand/BRAND_GUIDE.md) (colors, fonts, tone, tokens). Don't invent colors outside it. Use the tokens in `brand/tokens.css`.
- **Animation skills are required.** Before writing animation code, read the relevant `SKILL.md` files:
  - `skills/gsap/` (`gsap-core`, `gsap-react`, `gsap-scrolltrigger`, `gsap-timeline`, `gsap-performance`, …)
  - `skills/framer/SKILL.md` and `skills/framer-code-components/`
  - Use the React-specific guidance (`gsap-react`: `useGSAP`, cleanup/`gsap.context`) in client components.
- The site must feel **alive and animated**: scroll-triggered reveals, staggered text, parallax gradient waves, glowing sparks and magnetic or hover micro-interactions.
- It must **not look like AI slop.** Avoid:
  - generic purple-on-white gradients, stock "card grid + emoji" layouts and centered-everything templates;
  - placeholder lorem ipsum and unrelated stock icons;
  - identical rounded cards repeated with no hierarchy.
  Aim for bold, poster-like composition that matches the brand: condensed display type, dark textured backgrounds, diagonal streaks, star/spark accents and intentional asymmetry.
- **Responsive is mandatory:** mobile-first, tested at 360 / 768 / 1024 / 1440 px. No horizontal scroll and touch targets of at least 44px.
- Honor `prefers-reduced-motion`: disable or simplify animations.
- Accessibility: semantic HTML, one `<h1>` per page, labelled form fields, visible focus states, AA contrast.
- Performance: use `next/image` and `next/font`, animate only `transform` and `opacity`, and lazy-load heavy client components.

## Rule 3 — Plan first, build after approval

- For **every task**, write an **implementation plan first** and wait for explicit user approval. Don't write project code before approval.
- The plan should state: goal, files to create or change, SSR/CSR split, animation approach, security impact and open questions.
- Exception: tiny edits the user explicitly asks to "just do" (typos, one-line fixes).
- After approval, implement, verify (lint/build/browser check) and report.

## Rule 4 — Payments must be secure

The payment gateway is not chosen yet (likely Razorpay/Stripe/Cashfree). Apply these rules to whichever one is used:

- **Secrets stay server-side.** API secrets and webhook secrets live in `.env.local` only. Never use `NEXT_PUBLIC_` for secrets (only the public/publishable key). `.env*` is git-ignored. Maintain `.env.example` with names only.
- **The server decides the amount.** Compute the price on the server from the event/ticket ID. Never trust an amount, currency or discount sent by the client.
- **Create orders server-side** (Route Handler/Server Action). The client only receives the order ID.
- **Verify payments server-side:** check the gateway signature (HMAC) with a timing-safe compare, and confirm via the gateway API or a **verified webhook**. The client "success" callback alone never marks a registration as paid.
- **Webhooks:** verify the signature on the raw body, make handlers **idempotent** (dedupe by payment/event ID) and respond quickly.
- **Never store card/UPI data.** Use the gateway's hosted checkout or SDK, and keep our servers out of PCI scope.
- **Validate all input** on the server with a schema (e.g. zod): types, lengths, email/phone formats. Sanitize output.
- **Abuse protection:** rate-limit payment and registration endpoints, add CSRF/origin checks for mutations and use bot protection (e.g. Turnstile) on forms.
- **Transport & headers:** HTTPS only, plus security headers in `next.config.ts` (CSP allowing only the gateway domains, `X-Content-Type-Options`, `Referrer-Policy`, `frame-ancestors`).
- **Privacy:** collect minimal PII, never log secrets or full payment payloads, and return generic error messages to clients.
- Any payment-related plan must include a **Security section** and get approval like any other plan.

## Rule 5 — Keep README.md updated with logs

- After **every task**, update [`README.md`](./README.md): add a dated entry at the **top** of the **Activity Log** section (newest first) listing what was done, which files changed and any follow-ups.
- Keep the README's "Project overview", "Tech stack", "Structure" and "Rules" sections current when they change.

## Rule 6 — Strict Asset / Visual Lock (MANDATORY)

- **Use ONLY explicitly provided / approved assets:** Logos, images, graphics, videos, and icons provided by the user or defined in `brand/BRAND_GUIDE.md` / `brand/assets/`.
- **Zero unapproved visual assets:**
  - DO NOT search the internet for images.
  - DO NOT use stock photography (Unsplash, Pexels, Pixabay, etc.).
  - DO NOT use placeholder URLs, AI-generated images, or random icon packs.
  - DO NOT copy demo images/media from React Bits or external UI libraries. React Bits components are approved **ONLY** for interaction/animation behaviors, not their demo content.
- **CSS / Generated visuals:** Allowed ONLY when they are part of the approved brand design system (brand gradients, glows, noise/grain, streaks, borders, text effects).
- **Missing assets rule:** If a component/card requires an image that has not been supplied, keep the approved structure and leave the image slot awaiting the official asset. Never substitute with unapproved imagery.

## Order of work for every prompt

1. Read this file (`AGENTS.md`) plus the Next.js docs and relevant skills.
2. Write the implementation plan, then **wait for approval**.
3. Build, following Rules 1, 2, 4, and 6.
4. Verify (lint, build, responsive and motion check, asset audit).
5. Update `README.md` Activity Log (Rule 5).

