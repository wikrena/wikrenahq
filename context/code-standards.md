# Code Standards

## General

- Keep modules small and single-purpose.
- Fix root causes — do not layer workarounds on top of broken behaviour.
- Do not mix unrelated concerns in one component or route handler.
- Respect the system boundaries defined in `architecture-context.md`.

## TypeScript

- Strict mode is required throughout the project (`tsconfig.json` has `"strict": true`).
- Avoid `any` — use explicit interfaces or narrowly scoped types.
- Validate unknown external input (user submissions, API responses, webhooks) at system boundaries before trusting it.
- Use `interface` for object contracts and `type` for unions and aliases.
- Shared types live in `types/index.ts`.

## Next.js

- Default to **React Server Components** (RSC). Do not add `"use client"` unless the component genuinely needs browser interactivity, event handlers, or React hooks.
- Keep route handlers (`app/api/`) focused on a single responsibility: validate input → check auth → call a lib helper → return a response.
- No long-running work inside request handlers. If a task may take more than a few seconds, handle it asynchronously.
- Data fetching in Server Components should use the Supabase client directly via `lib/supabase/server.ts` (or `lib/supabase/admin.ts`) or a dedicated server-side helper in `lib/`.

## Styling

- Use Tailwind utility classes with the custom tokens defined in `tailwind.config.ts`: colour shades (`navy-800`, `teal-500`, `coral-500`, `neutral-200`), shadows (`shadow-card`, `shadow-teal-glow`), and animations (`animate-fade-up`).
- No hardcoded hex values or raw Tailwind colour classes like `zinc-*` or `slate-*` — use the Wikrena palette.
- Maintain the border radius scale: `rounded-xl` for small elements, `rounded-2xl` for cards and panels, `rounded-3xl` for modals and overlays.
- Use `cn()` from `lib/utils` to merge conditional class names.
- Do not modify `components/ui/` directly. Style at the feature-component level.

## API Routes

- Parse and validate request body/params with Zod before any logic runs.
- Verify auth (get Supabase user) before any mutation or sensitive read.
- Return consistent, predictable response shapes: `{ data }` on success, `{ error }` with an appropriate HTTP status on failure.
- Keep handlers thin — business logic belongs in `lib/` utilities.

## Database

- All queries go through the **Supabase JS client** (`@supabase/supabase-js`) — no ORM, no raw SQL in application code.
- Never trust a user-supplied ID as proof of ownership. Always verify ownership via a database query that joins through the authenticated user.
- Schema changes are made as new SQL files in `supabase/migrations/`.

## Authentication

- Use `createServerClient` from `@supabase/ssr` in Server Components, route handlers, and middleware.
- Use `createBrowserClient` from `@supabase/ssr` in Client Components.
- Never skip the auth check before a protected action just because a route is already behind middleware — middleware is a redirect layer, not a trust boundary for mutations.

## File Organisation

- `lib/` — shared infrastructure: Supabase clients, auth helpers, utility functions, data access helpers.
- `components/` — UI composition only; no business logic.
- `components/ui/` — shadcn/ui foundation components; do not modify.
- `app/api/` — API route handlers.
- `hooks/` — custom React hooks.
- `types/` — shared TypeScript interfaces.
- Name files after the responsibility they contain, not the technology (e.g., `learning-progress.ts` not `db-queries.ts`).

## Comments

Only add a comment when the **why** is non-obvious: a hidden constraint, a subtle invariant, or a workaround for a specific external bug. Do not comment what the code already says through clear naming.
