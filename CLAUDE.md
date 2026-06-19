# Wikrena Academy — CLAUDE.md

## What This Project Is

Wikrena Academy is the learning management platform for **Wikrena Limited**, an AI and data company founded by **Chris Awoke** (started as "Wise Breed Analytics" in 2021, rebranded to Wikrena in 2025). It is a full-stack web application that combines a marketing site (home, about, contact, etc.) with a feature-rich LMS — learning paths, AI tutoring, coding challenges, career development tools, and an Africa-focused data lab.

The platform is built for adult learners pursuing careers in data science, AI, and technology. It is **not** a kids platform — all Junior-related content is being removed.

### Where This App Sits in the Wikrena Ecosystem

Wikrena Limited operates three pillars. This repo is **only** the Academy:

| Pillar | What it is | In this repo? |
|---|---|---|
| **Wikrena OS** | SaaS for African service businesses (clients, scope, payments) at `os.wikrena.com` | No — separate product |
| **Wikrena Academy** | Cohort-based data/AI training for professionals | **Yes — this app** |
| **Wikrena Consulting** ("AnalyticsHQ") | B2B data strategy, analysis, and corporate training | No — but Academy marketing pages link out to it |

Marketing copy on this app's public pages (home, about) should acknowledge all three pillars even though only the Academy is built here.

### Source Content

`wikrena-pages/` contains real copy extracted from the legacy wikrena.com WordPress site (home, about, programs, legal pages, blog posts, etc.). Treat it as the source of truth for marketing copy, founder bio, testimonials, and program details when building out marketing pages — do not invent placeholder content where real copy already exists there. See `context/project-overview.md` for what's been reconciled from it and `context/progress-tracker.md` for open inconsistencies (e.g. program duration conflicts between source pages).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 + TypeScript 5 |
| UI | Tailwind CSS 3 + shadcn/ui + Framer Motion |
| Auth | Supabase Auth (SSR cookie-based) |
| Database | PostgreSQL via Supabase (queries via `@supabase/supabase-js`, schema in `supabase/migrations/`) |
| AI | Anthropic Claude SDK (`@anthropic-ai/sdk`) |
| Video | Mux |
| Code execution | Judge0 API |
| Payments | Paystack |
| Email | Resend |
| Caching / rate-limiting | Upstash Redis |
| Rich text | Tiptap v2 |
| Code editor | Monaco Editor |
| Charts | Recharts |
| State | Zustand |

---

## Folder Structure

```
app/                   Next.js app router — pages and API routes
  (marketing)/         Public marketing pages (home, about, contact, pricing, etc.)
  admin/               Admin panel
  africa-lab/          Africa data lab
  ai-tutor/            Wren AI tutor interface
  career/              Career hub (portfolio, resume, mentors, interviews)
  challenges/          Coding challenges
  community/           Forums and peer review
  courses/             Course catalogue and lesson viewer
  dashboard/           Student dashboard
  instructor/          Instructor dashboard
  learn/               Learning centre (tracks, courses, projects, library)
  leaderboard/         XP leaderboard
  onboarding/          Onboarding flow
  parent/              Parent dashboard (to be reviewed)
  paths/               Learning paths catalogue
  placed/              Job placement tracker
  practice/            Practice and assessments
  profile/             User profile
  school/              School admin
  settings/            Account settings
  workspace/           Code notebook / editor
  api/                 API route handlers

components/            Reusable UI components organised by domain
  ui/                  shadcn/ui foundation components — do not modify directly
  (domain folders)     Feature-specific components

context/               Project documentation (specs, architecture, standards)
hooks/                 Custom React hooks
lib/                   Shared infrastructure (Supabase clients, utilities, data handlers)
scripts/               One-off scripts (e.g. db:seed)
public/                Static assets
styles/                Global CSS (globals.css)
supabase/              Database migrations
types/                 Shared TypeScript interfaces (index.ts)
middleware.ts          Supabase auth + route protection
```

---

## Development Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run typecheck    # TypeScript check (tsc --noEmit)
npm run lint         # ESLint
npm run db:seed      # Seed the database (scripts/seed.ts)
```

---

## Authentication

Auth is handled by **Supabase SSR** via cookie-based sessions. The `middleware.ts` file protects routes server-side.

**Protected routes** (require Supabase session):
`/dashboard`, `/paths`, `/learn`, `/challenges`, `/leaderboard`, `/community`, `/africa-lab`, `/workspace`, `/career`, `/profile`, `/settings`, `/ai-tutor`, `/admin`, `/parent`, `/school`, `/onboarding`, `/placed`

**Public routes:** `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/pricing`, marketing pages

Authenticated users visiting auth pages (`/login`, `/register`, `/forgot-password`) are redirected to `/dashboard`.

Use `createServerClient` from `@supabase/ssr` in Server Components and API routes. Use `createBrowserClient` in Client Components.

---

## Database

All queries go through the Supabase JS client (`@supabase/supabase-js`) — `getAdminClient()` from `lib/supabase/admin.ts` on the server, `createClient()` from `lib/supabase/client.ts` in the browser. There is no ORM. Schema changes are tracked as raw SQL migrations in `supabase/migrations/`.

User roles: `STUDENT`, `PARENT`, `TEACHER`, `INSTRUCTOR`, `ADMIN`, `SCHOOL`

---

## Design System

**Colour palette** (defined in `tailwind.config.ts`):
- **Navy** — primary brand dark (base: `#0a192f`)
- **Teal** — primary accent (base: `#2ec4b6`)
- **Coral** — secondary accent / CTA (base: `#ff6b3d`)
- **Neutral** — greys and text (base: `#f5f7fa`)

Use the Tailwind colour utilities (`navy-800`, `teal-500`, `coral-500`, etc.). Do not use hardcoded hex values in components.

**Typography:**
- Display headings: `font-display` → Plus Jakarta Sans (`--font-jakarta`)
- Body / UI text: `font-body` / `font-sans` → Inter (`--font-inter`)
- Code: `font-mono` / `font-code` → monospace (`--font-mono`)

**Border radius scale:**
- Small elements / inputs: `rounded-xl`
- Cards / panels: `rounded-2xl`
- Modals / overlays: `rounded-3xl`

**Shadows:** `shadow-surface`, `shadow-lift`, `shadow-float`, `shadow-card`, `shadow-card-hover`, `shadow-teal-glow`, `shadow-coral-glow`

**Animations:** `animate-fade-up`, `animate-fade-in`, `animate-slide-right`, `animate-slide-down`, `animate-float`, `animate-shimmer`

**Icons:** Lucide React — stroke-based only, no filled variants. Sizes: `h-4 w-4` inline, `h-5 w-5` buttons, `h-8 w-8` feature icons.

---

## Key Patterns

### Server vs Client Components
Default to React Server Components. Add `"use client"` only when the component needs browser interactivity, event handlers, hooks, or real-time state.

### API Routes
- Validate and parse input before any logic
- Enforce auth at every mutation boundary
- Keep handlers thin — push complexity into `lib/` utilities
- Return consistent response shapes

### AI (Wren Tutor)
Uses `@anthropic-ai/sdk` with Claude. Rate-limiting via Upstash Redis. AI routes live in `app/api/ai-tutor/`.

### Styling
Use Tailwind utilities with the custom colour/shadow/animation tokens defined in `tailwind.config.ts`. Use `cn()` from `lib/utils` to merge class names. Do not modify components in `components/ui/` directly — extend at the feature level.

---

## What Is Being Cleaned Up

- **Wikrena Junior** (`app/junior/`, `app/admin/junior/`, and all related middleware and components) — being removed entirely
- **Misaligned context documentation** — all context files have been rewritten to reflect the actual Wikrena platform
- **Placeholder / mock data** — to be replaced with real content as features are finalised

---

## Environment Variables

See `.env.example` for the full list. Key variables:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `JUDGE0_API_KEY`, `JUDGE0_API_URL`
- `PAYSTACK_SECRET_KEY`, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`
- `RESEND_API_KEY`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `CRON_SECRET`
