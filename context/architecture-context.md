# Architecture Context

## Stack

| Layer | Technology | Role |
|---|---|---|
| Framework | Next.js 14 + TypeScript 5 | Full-stack app with server/client boundaries |
| UI | Tailwind CSS 3 + shadcn/ui + Framer Motion | Component composition, styling, and animation |
| Auth | Supabase Auth (SSR) | Cookie-based session management and route protection |
| Database | PostgreSQL via Supabase (`@supabase/supabase-js`, no ORM) | All relational data: users, courses, progress, etc. |
| AI | Anthropic Claude SDK | Wren AI Tutor — explain, hint, debug, quiz, career modes |
| Video | Mux | Video lesson delivery and streaming |
| Code execution | Judge0 API | Running learner code for challenges and workspace |
| Payments | Paystack | Subscription plans and payment processing |
| Email | Resend | Transactional emails (registration, reports, notifications) |
| Caching / rate-limiting | Upstash Redis | AI tutor rate limiting, session caching |
| Rich text | Tiptap v2 | Note-taking and lesson content editing |
| Code editor | Monaco Editor | In-browser code editor (workspace, challenges) |
| Charts | Recharts | Analytics dashboards |
| State | Zustand | Client-side global state where needed |

## System Boundaries

- This repo is the **Wikrena Academy** product only. Wikrena Limited also operates **Wikrena OS** (`os.wikrena.com`, a separate SaaS for African service businesses) and **Wikrena Consulting** / "AnalyticsHQ" (B2B data services) — neither has code in this repo. Marketing pages here may link out to them, but no shared codebase, database, or auth session should be assumed between this app and those products.
- `app/` — Next.js pages (RSC by default) and API route handlers (`app/api/`). Route handlers handle input validation, auth checks, and persistence. No long-running work inside route handlers.
- `lib/` — Shared infrastructure: Supabase clients (`lib/supabase/`), utility functions, data access helpers.
- `components/` — UI composition only. No business logic in components.
- `components/ui/` — shadcn/ui foundation components. Do not modify directly; extend at the feature level.
- `hooks/` — Custom React hooks for shared client-side behaviour.
- `supabase/migrations/` — Raw SQL migrations. Source of truth for the data model.
- `context/` — Project documentation. Keep in sync with the actual implementation.
- `middleware.ts` — Supabase SSR auth and route protection. Runs on every non-static request.

## Authentication Model

- Auth provider: **Supabase Auth** with cookie-based SSR sessions.
- `middleware.ts` reads the Supabase session on every request and redirects unauthenticated users away from protected routes.
- In Server Components and API routes: use `createServerClient` from `@supabase/ssr`.
- In Client Components: use `createBrowserClient` from `@supabase/ssr`.
- User identity is verified server-side before any mutation or protected data fetch.

**Protected routes** (require active Supabase session):
`/dashboard`, `/paths`, `/learn`, `/challenges`, `/leaderboard`, `/community`, `/africa-lab`, `/workspace`, `/career`, `/profile`, `/settings`, `/ai-tutor`, `/admin`, `/parent`, `/school`, `/onboarding`, `/placed`

**Public routes:** `/`, `/login`, `/register`, `/forgot-password`, `/reset-password`, `/pricing`, and all marketing pages.

## Data Model

All relational data lives in **PostgreSQL**, managed via Supabase migrations (`supabase/migrations/`) and queried through the Supabase JS client — no ORM. Key entities:

- **User** — identity, role, XP, streak, social links.
- **LearningPath / SkillModule / Lesson** — course content hierarchy.
- **Enrolment / Progress** — learner progress through paths and lessons.
- **Challenge / Submission** — coding challenges and learner submissions.
- **XPTransaction** — full audit log of XP earned and spent.
- **Badge / UserBadge** — achievements.
- **ForumPost / ForumReply** — community discussions.
- **Job / Application** — career hub listings and applications.
- **PortfolioProject** — learner portfolio items.
- **Certificate** — issued on path completion.
- **PricingPlan / Subscription** — Paystack-linked payment records.
- **School / SchoolEnrolment** — bulk school management.

## AI Architecture (Wren Tutor)

- Model: Anthropic Claude (via `@anthropic-ai/sdk`).
- Request flow: Client → API route (`app/api/ai-tutor/`) → Claude API → streamed response back to client.
- Rate limiting: Upstash Redis limits requests per user per time window.
- Context: Each session maintains conversation history. Africa-specific examples are injected via system prompt.
- Modes available: Explain, Hint, Debug, Quiz, Career.

## Code Execution (Challenges & Workspace)

- Judge0 API handles code compilation and execution.
- Supported languages: Python, JavaScript, SQL, and others per Judge0 configuration.
- Results (stdout, stderr, exit code) are returned to the client after execution completes.

## Video Delivery

- Mux handles video upload, processing, and streaming.
- Video lesson components use Mux Player.
- Mux asset IDs and playback IDs are stored in the database.

## Payments

- Paystack handles all payment transactions.
- Plan tiers: Free, Monthly, Annual, with diaspora pricing variants.
- Webhook endpoint receives Paystack events and updates subscription records in the database.

## Storage Model

| Data type | Where it lives |
|---|---|
| All relational data | PostgreSQL via Supabase |
| User-uploaded files, avatars | Supabase Storage |
| Video content | Mux |
| Static assets | `public/` directory |

## Invariants

1. Auth and ownership are enforced at every mutation boundary — never trust client-supplied user IDs.
2. Route handlers are thin: validate input, check auth, delegate to `lib/` helpers, return a response.
3. No long-running work in request handlers — if a task takes more than a few seconds it needs an async strategy.
4. Client components are used only when browser interactivity, hooks, or real-time state require it. Default to Server Components.
5. All database mutations go through the Supabase JS client — no raw SQL queries in application code (raw SQL is fine in `supabase/migrations/`).
6. `components/ui/` is not modified — feature styling is applied at the feature-component level.
