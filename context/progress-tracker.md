# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

Foundation complete — Junior platform removed, documentation aligned. Ready for feature additions.

## Current Goal

Review and improve existing LMS features, then begin adding new features as directed by the product owner.

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

## Next Up

- Review and improve marketing pages (home, about, contact, pricing) with correct Wikrena Limited content.
- Review and fine-tune existing LMS features.
- Add new features as directed by the product owner.

## Open Questions

- Which marketing pages beyond home, about, contact, and pricing should exist?
- What new features are planned after the cleanup phase?
- Should the parent dashboard be rebuilt with adult-platform monitoring features?

## Architecture Decisions

- Auth: Supabase Auth (SSR cookie-based) — not Clerk.
- Database: PostgreSQL via Supabase. No ORM — raw SQL migrations in `supabase/migrations/`, queries via `@supabase/supabase-js`. Prisma was removed (was declared as a dependency but never actually used by any app code; the seed script was rewritten to `scripts/seed.ts` using the Supabase client).
- No real-time collaborative canvas — that was from a different project (Ghost AI).
- No Liveblocks, Trigger.dev, or Vercel Blob — not used in this project.
- Background jobs: PostgreSQL-as-queue via `lib/queue.ts` (Vercel Cron + `/api/jobs/process`).

## Session Notes

- Context files were previously populated with docs from an unrelated project ("Ghost AI") — all have now been rewritten.
- The Junior platform has been fully excised. The PARENT role still exists in the system for future adult-platform monitoring features.
- All "Junior Data Analyst" references in `components/academy/career.tsx` and `career-hub.tsx` are correct professional job titles, not Junior platform artifacts.
