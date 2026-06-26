# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

Homepage (`app/page.tsx`) is mid-redesign — taking it from a generic/basic layout to a "world-class, premium" visual standard, section by section. The finished homepage is meant to become the **visual template** for `/about-us`, `/contact`, `/services`, and other not-yet-built marketing pages — so the patterns established here (see below) should be reused, not reinvented, when those pages are built.

**IMPORTANT — read before doing anything else:**
1. There are uncommitted local changes sitting in the working tree (some staged, some not — run `git status` immediately to see exactly what). None of this session's homepage redesign work has been pushed since commit `7369f92`. If the product owner gives feedback that seems to contradict what's already in the code (e.g. "the badge still has a pill," "the font isn't mono"), it's very likely they're looking at the deployed production site, which is stale relative to local work — not a sign the fix didn't work. Get explicit confirmation before assuming a fix failed.
2. `npm run build` will fail with `EPERM` on the `.next/trace` file on Windows if a `npm run dev` process is still holding it — stop any running dev server (`tasklist | grep node` then `taskkill //F //PID <pid> //T`) before building.
3. Only commit/push when the user explicitly asks — this has been the working pattern all session (build → screenshot → show user → get sign-off → then commit+push in a batch).

## Current Goal

Finish the homepage premium redesign (see "Homepage Redesign — In Progress" below), get it reviewed and pushed, then use it as the template to build `/about-us`, `/contact`, `/services`, and legal pages with real copy from `wikrena-pages/`.

## Homepage Redesign — Design Decisions Locked In

- **Light/dark mix**: mostly light/white sections; exactly 3 sections stay dark for impact — Hero, Founder, and the closing Dual CTA. Everything else (Ecosystem, Services, Why Wikrena, Testimonials, Featured Program, FAQ) is light.
- **Fonts (homepage only, scoped via `.home-rebrand` class on the root div in `app/page.tsx`)**: Plus Jakarta Sans for headings (site-wide default, no override needed), Work Sans for body copy. The Work Sans override lives in `styles/globals.css` under `.home-rebrand` — it must set `font-family` directly on that selector, not just the `--font-inter` CSS variable, or it silently does nothing (see bug note below).
- **Reusable patterns established — reuse these on every future marketing page, don't invent new ones**:
  - `.eyebrow` class (in `globals.css`) — small mono uppercase teal label above every section heading.
  - `components/marketing/reveal.tsx` — `<Reveal>` wrapper for scroll-triggered fade-up, used on every section.
  - `components/marketing/animated-counter.tsx` — count-up number animation for stats.
  - "Mini mockup" cards — small product-preview visuals (tiny chart/progress/checklist inside a rounded panel with an icon badge overlapping the corner) used in the Ecosystem and Services sections instead of plain icons. Reuse this instead of generic icon-in-a-box cards.
  - Bento-grid treatment (mixed card sizes, 2 featured + N standard) for feature-list sections instead of a stacked/divided list — used in "Why Wikrena."
  - Tabbed split pattern (e.g. "For Professionals" / "For Businesses") for content that serves two audiences — used in the FAQ section and the Featured Program multi-program showcase.
- **Explicit design instruction from the product owner**: avoid "conventional AI-generated UI" look — generic rounded-icon-in-colored-square cards repeated everywhere, generic gradient blobs, predictable glassmorphism, cliché bento grids used without real content reason. Push for distinctive, non-generic detail.
- **Content accuracy**: don't invent placeholder copy/claims. Real source copy lives in `wikrena-pages/`. Example of a thing that was deliberately *not* built: a "trusted by" client-logo strip using African company names (MTN, Flutterwave, etc.) — those companies are referenced only as Africa Data Lab dataset sources, not confirmed paying clients, so using their logos as social proof would misrepresent a relationship that isn't documented anywhere.

## Bugs Found & Fixed This Session

- **Footer logo was invisible**: `components/marketing/footer.tsx` rendered `<WikrenaLogo variant="light-bg">` (navy-colored wordmark) inside a `bg-navy-800` footer — dark logo on dark background. Fixed to `variant="dark-bg"`.
- **`.home-rebrand` font override was inert**: setting `--font-inter: var(--font-worksans)` on `.home-rebrand` did nothing for any element that didn't itself reference `var(--font-inter)`, because CSS custom property overrides don't retroactively change already-inherited computed values further up the tree. Nearly all body text on the homepage has no explicit font class, so it was inheriting Inter from `<body>` (which has `.font-body` applied directly) instead of Work Sans. Fixed by also setting `font-family: var(--font-worksans), system-ui, sans-serif;` directly on `.home-rebrand` itself, so it actually cascades.
- **Missing asset `logo-icon-green.svg`**: referenced by `WikrenaIcon` and `WikrenaLogo`'s `icon-only` variant in `components/app-shell/wikrena-logo.tsx`, but the file doesn't exist in `public/` (pre-existing bug, surfaced when it was used in the footer watermark). Repointed to `public/favicon.png` (new navy hexagon mark, square 3264×3264).
- **Favicon was broken**: `app/layout.tsx` metadata referenced `/favicon.ico` and `/favicon.svg`, neither of which exists in `public/` anymore (deleted outside of any Claude session, presumably by the product owner directly). Repointed `metadata.icons` to `/favicon.png`.

## New Brand Assets Dropped Into `public/` (not all wired up yet)

- `public/chris-awoke.jpg` — founder photo, now used in the Founder section (`app/page.tsx`) as a real `next/image`, replacing the old "CA" initials avatar.
- `public/favicon.png` — new navy hexagon mark, now the site favicon and the source for `WikrenaIcon`/`icon-only` logo variant.
- `public/about-us-section.jpg` — dropped in by the product owner, **not yet used anywhere**. Likely intended for the future `/about-us` page.
- Note: `public/favicon.ico`, `public/favicon.svg`, and `public/logo-icon-green.svg` were deleted from the working tree outside of any Claude session (not a Claude action) — code no longer references them.

## Homepage Section-by-Section Status

| Section | Status |
|---|---|
| Hero | Rebuilt: dark navy, cursor-tracking spotlight, 3 floating "system" mockup cards (live trend chart / flowing ecosystem network / circular career-readiness ring) with float + scroll-parallax motion, animated stat counters. Badge is icon+mono-text (no pill). Nav is transparent/dark-glass over this section, crossfades to solid white on scroll (`transparentOnHero` prop on `MarketingNav`, opt-in per page). |
| Who We Are | Rebuilt: eyebrow label, dark image placeholder panel (textured, glowing) with a floating credibility stat card overlapping the corner instead of a flat gray box. |
| Ecosystem (3 pillars) | Rebuilt: each card has a mini product-preview mockup (checklist / XP bar / bar chart) instead of a plain icon, connected by arrow connectors between cards on desktop. |
| Services | Rebuilt: each service card has a small "deliverable preview" mockup (chart / numbered steps / avatar-checklist) instead of a plain icon + bullet list. |
| Founder | Rebuilt: real photo (`chris-awoke.jpg`) in a large `aspect-[4/5]` card with gradient name/title overlay, replacing the "CA" initials circle. |
| Why Wikrena | Rebuilt as a bento grid (2 featured wide tiles + 4 standard tiles) — was previously a long divided vertical list, which was the product owner's specific complaint. |
| Testimonials | Rebuilt: one large featured dark testimonial card (with star rating + quote watermark) beside two smaller stacked cards, instead of three equal-weight cards. |
| Featured Program | Rebuilt as `components/marketing/program-showcase.tsx` — a tabbed switcher across all 3 real programs (Data Analytics Professional, AI Automation Specialist, SPSS), replacing a hardcoded single-program card. Copy now correctly says "three programs," not "two." |
| Dual CTA | Rebuilt as one full dark navy section with two glass panels, replacing a mismatched navy-box-next-to-light-box layout. |
| FAQ | Rebuilt as `components/marketing/faq-tabs.tsx` — split into "For Professionals" / "For Businesses" tabs (the product owner's specific request) with a sticky contact card, using real FAQ copy sourced from `wikrena-pages/academy.md` and `wikrena-pages/services.md` (not invented). |
| Nav (`components/marketing/nav.tsx`) | Mid-redesign: added `transparentOnHero` prop, Login/Get Started CTA for logged-out visitors (previously nav showed nothing for logged-out users), bigger logo, full max-width stretch, hover-pill link treatment. **Not yet fully verified visually after the latest round of tweaks — check it renders correctly before trusting it's done.** |

## Immediate Next Steps For The Next Session

1. Run `git status` and `git diff` first to see the exact current uncommitted state — don't trust this doc's snapshot blindly, the working tree may have moved since this was written.
2. Verify the nav redesign actually renders correctly (screenshot both the transparent-over-hero state and the scrolled/solid state) — it was mid-tweak when this session ended.
3. Verify the hero floating cards read as a tight, cohesive "floating" cluster (product owner felt they were too spread out and not visibly floating — float animation + closer positioning was added but not yet re-screenshotted).
4. Run `npx tsc --noEmit -p .` and `npm run build` clean, then ask the product owner if it's OK to commit + push everything.
5. Once homepage is signed off, start `/about-us` using `wikrena-pages/about-us.md` as source copy and `public/about-us-section.jpg`, reusing the established patterns (eyebrow labels, `<Reveal>`, mini-mockup cards, bento grids for feature lists, light/dark-only-for-impact-sections rule).

## Completed

- CLAUDE.md created with accurate project documentation.
- All context files rewritten to reflect Wikrena Academy (removed all Ghost AI / Liveblocks / Clerk / Trigger.dev / Vercel Blob references).
- Wikrena Junior platform fully removed:
  - `app/junior/` (all routes deleted)
  - `app/admin/junior/` page deleted
  - `app/api/junior/` routes deleted
  - `app/parent/add-child/` and `app/parent/children/` deleted
  - `app/api/parent/add-child/` and `app/api/parent/update-child/` deleted
  - `components/junior/` (all components deleted)
  - `components/parent/` (add-child-form, parent-dashboard, parent-child-detail deleted)
  - `components/shared/junior-error-boundary.tsx` deleted
  - `components/admin/admin-junior.tsx` deleted
  - `lib/data/junior.ts` deleted
  - `app/api/admin/seed-content/builders-track-data.ts` deleted
  - Junior middleware logic removed from `middleware.ts`
  - Junior fields removed from `types/index.ts` (Profile, Course, ChildProfile, JuniorChild, JuniorActivity)
  - Junior cache keys removed from `lib/cache.ts`
  - Junior job types removed from `lib/queue.ts` (junior_mission_complete, weekly_parent_report handlers)
  - Junior email templates removed from `lib/email/templates.ts` (childPinEmail, weeklyProgressEmail)
  - Junior import removed from `lib/email/index.ts`
  - Junior fields removed from all admin pages, course APIs, and data functions
  - `is_junior`/`junior_track` removed from CourseManager, CourseEditor, LessonEditorV2
  - All `is_kid`/`kid_track` references removed from users, school, and auth routes
  - All parent redirects updated from `/parent/add-child` to `/dashboard`
  - Junior reference removed from `README.md`, nav, footer, sidebar, topbars
  - `app/parent/dashboard/page.tsx` replaced with redirect to `/dashboard`
- PARENT, TEACHER, and SCHOOL roles fully removed (they only ever existed to serve the Junior platform's bulk/parental enrolment — not a real adult-platform feature, despite earlier docs describing "School Administration" as in-scope):
  - `UserRole` collapsed to `STUDENT | INSTRUCTOR | ADMIN` in `types/index.ts`
  - Migration `006_remove_parent_teacher_school_roles.sql` remaps any existing PARENT/TEACHER/SCHOOL profiles to STUDENT and drops `parent_id`, `is_kid`, `kid_pin`, `kid_track` columns
  - Signup role picker removed from `register-form.tsx` — registration is student-only now
  - Role-mapping/redirect branches removed from the auth callback, register, role, confirm, onboarding, and dashboard routes; `middleware.ts` no longer protects `/parent` or `/school`
  - `app/parent/`, `app/school/`, `app/api/school/` (cohorts + students), `app/admin/schools/`, and `components/admin/admin-schools.tsx` deleted entirely
  - Admin UI (`admin-users`, `admin-dashboard`, `admin-shell`, `admin-settings`, `instructor-manager`) no longer offers PARENT/SCHOOL/TEACHER as assignable roles
  - `withAdmin()` in `lib/api.ts` tightened to ADMIN-only — TEACHER previously had admin-route access, which was an unintended privilege escalation
  - Email verification simplified to a single student template; `verificationParentEmail`, `verificationSchoolEmail`, `schoolInvitationEmail` deleted from `lib/email/templates.ts`
  - `project-overview.md` and `architecture-context.md` corrected to remove "School Administration" / "Parent Dashboard" as in-scope features

## Next Up

- Build out missing marketing pages using real copy from `wikrena-pages/`: `/about`, `/contact`, `/privacy-policy`, `/terms-of-use`, `/cookie-policy`. None of these exist in `app/` yet — only `app/page.tsx` (home) and `app/pricing/` exist.
- Finish and ship the homepage premium redesign (see "Homepage Redesign" sections above — this is the active work).
- Then build `/about-us`, `/contact`, `/services`, `/privacy-policy`, `/terms-of-use`, `/cookie-policy` using real copy from `wikrena-pages/` and the visual patterns established on the homepage. None of these routes exist in `app/` yet — only `app/page.tsx` (home), `app/pricing/`, and `app/academy/` exist. Note the homepage already links to `/about-us`, `/contact`, and `/services` — those links currently 404.
- Review and fine-tune existing LMS features.
- Add new features as directed by the product owner.

## Open Questions

- **Program duration conflict**: `wikrena-pages/academy.md` states the Data Analytics Professional Program is 15 weeks; `wikrena-pages/data-analytics-professional.md` states 12 weeks. Partially sidestepped in the new homepage `program-showcase.tsx` by stating "12–15 weeks" rather than picking one — still needs a real answer from the product owner for anywhere that needs a single number.
- **Cohort size conflict**: stated as max 30, 45, and 25 students in different legacy pages (varies by program). Needs confirmation. The homepage FAQ currently says "capped class size" (deliberately vague) rather than hardcoding "45."
- Should this app build out `/about`, `/contact`, and legal pages now, or are those staying on a separate marketing site? Leaning toward yes — the homepage now links to `/about-us`, `/contact`, `/services` as local routes (not external `wikrena.com` links), so building them locally seems to be the implied direction, but this hasn't been explicitly confirmed by the product owner.
- Should marketing pages here link out to Wikrena OS (`os.wikrena.com`) and Wikrena Consulting/AnalyticsHQ, given the three-pillar company structure described in `wikrena-pages/home.md` and `about-us.md`? Resolved for the homepage — yes, it already does this (Ecosystem section links to `os.wikrena.com` externally, `/academy` and `/services` locally). Apply the same pattern on future pages.
- What new features are planned after the homepage/marketing-page work?

## Architecture Decisions

- Auth: Supabase Auth (SSR cookie-based) — not Clerk.
- Database: PostgreSQL via Supabase. No ORM — raw SQL migrations in `supabase/migrations/`, queries via `@supabase/supabase-js`. Prisma was removed (was declared as a dependency but never actually used by any app code; the seed script was rewritten to `scripts/seed.ts` using the Supabase client).
- No real-time collaborative canvas — that was from a different project (Ghost AI).
- No Liveblocks, Trigger.dev, or Vercel Blob — not used in this project.
- Background jobs: PostgreSQL-as-queue via `lib/queue.ts` (Vercel Cron + `/api/jobs/process`).

## Session Notes

- Context files were previously populated with docs from an unrelated project ("Ghost AI") — all have now been rewritten.
- The Junior platform has been fully excised, including the PARENT, TEACHER, and SCHOOL roles that only existed to serve it. The platform now has exactly three roles: STUDENT, INSTRUCTOR, ADMIN.
- All "Junior Data Analyst" references in `components/academy/career.tsx` and `career-hub.tsx` are correct professional job titles, not Junior platform artifacts.
