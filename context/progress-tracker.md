# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase

Foundation complete — Junior platform removed (including PARENT/TEACHER/SCHOOL roles), documentation aligned. Ready for feature additions.

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
- Rewrite home page copy against `wikrena-pages/home.md` (real hero, three-pillar ecosystem, founder section, FAQ, testimonials) — current implementation should be checked against this for placeholder content.
- Align Academy program copy/pricing with the real programs (Data Analytics Professional Program, AI Automation Specialist Program, SPSS course) — see `project-overview.md` for details and the duration/pricing inconsistency below.
- Review and fine-tune existing LMS features.
- Add new features as directed by the product owner.

## Open Questions

- **Program duration conflict**: `wikrena-pages/academy.md` states the Data Analytics Professional Program is 15 weeks; `wikrena-pages/data-analytics-professional.md` states 12 weeks. Needs confirmation from the product owner before any new copy hardcodes a number.
- **Cohort size conflict**: stated as max 30, 45, and 25 students in different legacy pages (varies by program). Needs confirmation.
- Should this app build out `/about`, `/contact`, and legal pages now, or are those staying on a separate marketing site? (Legacy WordPress content suggests they were on `wikrena.com` directly — need to confirm whether this Next.js app is meant to absorb them.)
- Should marketing pages here link out to Wikrena OS (`os.wikrena.com`) and Wikrena Consulting/AnalyticsHQ, given the three-pillar company structure described in `wikrena-pages/home.md` and `about-us.md`?
- What new features are planned after the cleanup phase?

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
