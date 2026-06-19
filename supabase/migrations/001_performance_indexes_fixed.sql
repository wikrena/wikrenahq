-- ============================================================
-- Wikrena Academy — Performance Indexes
-- Run this ONCE in Supabase SQL Editor
-- ============================================================
--
-- WHY THESE INDEXES MATTER:
-- Without indexes, PostgreSQL scans every row in a table to find
-- matching records. With indexes, it goes directly to the data.
-- At 50,000 users, these queries go from 500ms → 2ms.
--
-- WHEN TO RUN:
-- Run this now, before going live. Indexes are built in the
-- background and do not lock tables. Safe to run at any time.
-- ============================================================

-- ── LESSON COMPLETIONS ────────────────────────────────────────────────────────
-- Most queried table — every dashboard load, every lesson player load

-- Find all completions for a student (dashboard, progress page)
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user_id
ON lesson_completions(user_id);

-- Find completions for a specific course (lesson player, course progress)
CREATE INDEX IF NOT EXISTS idx_lesson_completions_course_id
ON lesson_completions(course_id);

-- Composite: student + course (most common join — lesson player)
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user_course
ON lesson_completions(user_id, course_id);

-- Recent completions (activity feed, parent reports)
CREATE INDEX IF NOT EXISTS idx_lesson_completions_completed_at
ON lesson_completions(user_id, completed_at DESC);

-- ── COURSE ENROLLMENTS ────────────────────────────────────────────────────────

-- Find all enrollments for a student
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_id
ON course_enrollments(user_id);

-- Active enrollments only (most common filter)
CREATE INDEX IF NOT EXISTS idx_course_enrollments_user_active
ON course_enrollments(user_id, is_active)
WHERE is_active = true;

-- ── COURSES ───────────────────────────────────────────────────────────────────

-- Published courses (course catalog page)
CREATE INDEX IF NOT EXISTS idx_courses_published
ON courses(is_published, "order")
WHERE is_published = true;

-- Junior courses by track (Junior world map — queried on every Junior page load)
CREATE INDEX IF NOT EXISTS idx_courses_junior_track
ON courses(is_junior, junior_track, "order")
WHERE is_junior = true;

-- Course lookup by slug (every course page)
CREATE INDEX IF NOT EXISTS idx_courses_slug
ON courses(slug);

-- ── CHAPTERS & LESSONS ───────────────────────────────────────────────────────

-- Lessons in a chapter (lesson player, CMS editor)
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_id
ON lessons(chapter_id, "order");

-- Published lessons only
CREATE INDEX IF NOT EXISTS idx_lessons_chapter_published
ON lessons(chapter_id, is_published, "order")
WHERE is_published = true;

-- Lesson lookup by slug (lesson player URL routing)
CREATE INDEX IF NOT EXISTS idx_lessons_slug
ON lessons(slug);

-- Chapters in a course (course page)
CREATE INDEX IF NOT EXISTS idx_chapters_course_id
ON chapters(course_id, "order");

-- ── PROFILES ─────────────────────────────────────────────────────────────────

-- Role lookup (admin dashboard, middleware role checks)
CREATE INDEX IF NOT EXISTS idx_profiles_role
ON profiles(role);

-- Children by parent (parent dashboard — every parent page load)
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id
ON profiles(parent_id)
WHERE parent_id IS NOT NULL;

-- Active kids (Junior platform queries)
CREATE INDEX IF NOT EXISTS idx_profiles_kids
ON profiles(parent_id, is_kid)
WHERE is_kid = true;

-- Leaderboard sort (top students by XP)
CREATE INDEX IF NOT EXISTS idx_profiles_xp_leaderboard
ON profiles(total_xp DESC)
WHERE is_active = true;

-- Email lookup (login, invite check)
CREATE INDEX IF NOT EXISTS idx_profiles_email
ON profiles(email);

-- ── XP TRANSACTIONS ──────────────────────────────────────────────────────────

-- User XP history (profile page, admin user detail)
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user_id
ON xp_transactions(user_id, created_at DESC);

-- ── FORUM ────────────────────────────────────────────────────────────────────

-- Posts by category (forum category page)
CREATE INDEX IF NOT EXISTS idx_forum_posts_category_id
ON forum_posts(category_id, created_at DESC);

-- Posts by user (user profile forum activity)
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id
ON forum_posts(user_id);

-- Replies for a post (forum post page)
CREATE INDEX IF NOT EXISTS idx_forum_replies_post_id
ON forum_replies(post_id, created_at ASC);

-- ── JOBS QUEUE ────────────────────────────────────────────────────────────────

-- Pending jobs (job processor — runs every minute)
CREATE INDEX IF NOT EXISTS idx_jobs_pending
ON jobs(status, run_at ASC, priority DESC)
WHERE status = 'pending';

-- ── USER BADGES ───────────────────────────────────────────────────────────────

-- User's earned badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id
ON user_badges(user_id, earned_at DESC);

-- ============================================================
-- VERIFY INDEXES WERE CREATED:
-- Run this to check:
-- SELECT indexname, tablename FROM pg_indexes
-- WHERE schemaname = 'public'
-- ORDER BY tablename, indexname;
-- ============================================================
