-- ============================================================
-- 005_missing_tables.sql
-- Creates all tables referenced in code that don't exist yet.
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New query).
-- Safe to run multiple times — all statements use IF NOT EXISTS.
-- ============================================================

-- ── 1. profiles — add missing columns (table itself exists already) ─────────
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS longest_streak    INTEGER  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_activity_at  TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS industry          TEXT,
  ADD COLUMN IF NOT EXISTS bio               TEXT,
  ADD COLUMN IF NOT EXISTS city              TEXT,
  ADD COLUMN IF NOT EXISTS linkedin_url      TEXT,
  ADD COLUMN IF NOT EXISTS github_url        TEXT,
  ADD COLUMN IF NOT EXISTS portfolio_url     TEXT,
  ADD COLUMN IF NOT EXISTS is_kid            BOOLEAN  DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS kid_pin           TEXT,
  ADD COLUMN IF NOT EXISTS kid_track         TEXT,
  ADD COLUMN IF NOT EXISTS parent_id         UUID     REFERENCES profiles(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS date_of_birth     DATE,
  ADD COLUMN IF NOT EXISTS onboarding_done   BOOLEAN  DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS track             TEXT,
  ADD COLUMN IF NOT EXISTS avatar            TEXT;

-- ── 2. courses — add missing columns ────────────────────────────────────────
ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS is_junior     BOOLEAN  DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS junior_track  TEXT,
  ADD COLUMN IF NOT EXISTS "order"       INTEGER  DEFAULT 0,
  ADD COLUMN IF NOT EXISTS tags          TEXT[]   DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS language      TEXT     DEFAULT 'python',
  ADD COLUMN IF NOT EXISTS is_free       BOOLEAN  DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS price         NUMERIC  DEFAULT 0;

-- ── 3. lessons — add missing columns ────────────────────────────────────────
ALTER TABLE lessons
  ADD COLUMN IF NOT EXISTS is_junior      BOOLEAN  DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS is_free        BOOLEAN  DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS starter_code   TEXT,
  ADD COLUMN IF NOT EXISTS quiz_questions JSONB,
  ADD COLUMN IF NOT EXISTS video_url      TEXT,
  ADD COLUMN IF NOT EXISTS course_id      UUID     REFERENCES courses(id) ON DELETE CASCADE;

-- ── 4. xp_transactions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS xp_transactions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT        NOT NULL,
  amount       INTEGER     NOT NULL DEFAULT 0,
  reason       TEXT,
  reference_id TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_xp_transactions_user
  ON xp_transactions(user_id, created_at DESC);

-- ── 5. badges ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS badges (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT        NOT NULL UNIQUE,
  icon        TEXT        NOT NULL DEFAULT '🏅',
  description TEXT,
  rarity      TEXT        NOT NULL DEFAULT 'common'
                          CHECK (rarity IN ('common','rare','epic','legendary')),
  criteria    JSONB,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. user_badges ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_badges (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT        NOT NULL,
  badge_id   UUID        NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);
CREATE INDEX IF NOT EXISTS idx_user_badges_user
  ON user_badges(user_id, earned_at DESC);

-- ── 7. leaderboard_entries ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leaderboard_entries (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT        NOT NULL UNIQUE,
  score      INTEGER     NOT NULL DEFAULT 0,
  rank       INTEGER,
  period     TEXT        NOT NULL DEFAULT 'all_time',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_leaderboard_score
  ON leaderboard_entries(period, score DESC);

-- ── 8. course_enrollments ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_enrollments (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          TEXT        NOT NULL,
  course_id        UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at     TIMESTAMPTZ,
  progress_percent INTEGER     NOT NULL DEFAULT 0,
  is_active        BOOLEAN     NOT NULL DEFAULT TRUE,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
CREATE INDEX IF NOT EXISTS idx_enrollments_user
  ON course_enrollments(user_id, enrolled_at DESC);
CREATE INDEX IF NOT EXISTS idx_enrollments_course
  ON course_enrollments(course_id);

-- ── 9. notes ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT        NOT NULL,
  lesson_id  UUID        REFERENCES lessons(id) ON DELETE CASCADE,
  content    TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notes_user
  ON notes(user_id);

-- ── 10. bookmarks ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS bookmarks (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT        NOT NULL,
  lesson_id  UUID        REFERENCES lessons(id) ON DELETE CASCADE,
  course_id  UUID        REFERENCES courses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user
  ON bookmarks(user_id);

-- ── 11. workspaces ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workspaces (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT        NOT NULL,
  title      TEXT        NOT NULL DEFAULT 'Untitled',
  content    TEXT        DEFAULT '',
  language   TEXT        NOT NULL DEFAULT 'python',
  is_public  BOOLEAN     NOT NULL DEFAULT FALSE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_workspaces_user
  ON workspaces(user_id, updated_at DESC);

-- ── 12. exercises ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercises (
  id             UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id      UUID  NOT NULL REFERENCES lessons(id) ON DELETE CASCADE UNIQUE,
  instructions   TEXT,
  starter_code   TEXT,
  solution_code  TEXT,
  language       TEXT  NOT NULL DEFAULT 'python',
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 13. quiz_questions ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS quiz_questions (
  id          UUID     PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id   UUID     NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  question    TEXT     NOT NULL,
  options     JSONB    NOT NULL DEFAULT '[]',
  correct     INTEGER  NOT NULL DEFAULT 0,
  explanation TEXT,
  "order"     INTEGER  NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_quiz_lesson
  ON quiz_questions(lesson_id, "order");

-- ── 14. ai_chat_sessions ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    TEXT        NOT NULL,
  title      TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_sessions_user
  ON ai_chat_sessions(user_id, updated_at DESC);

-- ── 15. ai_chat_messages ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID        NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  user_id    TEXT        NOT NULL,
  role       TEXT        NOT NULL CHECK (role IN ('user','assistant','system')),
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ai_messages_session
  ON ai_chat_messages(session_id, created_at ASC);

-- ── 16. forum_categories ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS forum_categories (
  id          UUID   PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT   NOT NULL UNIQUE,
  slug        TEXT   NOT NULL UNIQUE,
  description TEXT,
  "order"     INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
INSERT INTO forum_categories (name, slug, description, "order") VALUES
  ('General Discussion', 'general',       'Talk about anything Wikrena-related',      1),
  ('Python Help',        'python-help',   'Get help with Python code and concepts',    2),
  ('Data & SQL',         'data-sql',      'Questions about data analysis and SQL',     3),
  ('Career Advice',      'career',        'Jobs, interviews, and career paths',        4),
  ('Projects',           'projects',      'Share and discuss your projects',           5),
  ('Study Groups',       'study-groups',  'Find study partners and group sessions',    6)
ON CONFLICT (slug) DO NOTHING;

-- ── 17. forum_posts ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS forum_posts (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT        NOT NULL,
  category_id  UUID        REFERENCES forum_categories(id) ON DELETE SET NULL,
  title        TEXT        NOT NULL,
  content      TEXT        NOT NULL,
  view_count   INTEGER     NOT NULL DEFAULT 0,
  is_pinned    BOOLEAN     NOT NULL DEFAULT FALSE,
  is_locked    BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_forum_posts_category
  ON forum_posts(category_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user
  ON forum_posts(user_id);

-- ── 18. forum_replies ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS forum_replies (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  user_id    TEXT        NOT NULL,
  content    TEXT        NOT NULL,
  is_answer  BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_forum_replies_post
  ON forum_replies(post_id, created_at ASC);

-- ── 19. certificates ─────────────────────────────────────────────────────────
-- Already created in 003_certificates_table.sql — skip if exists
-- (migration 003 handles this)

-- ── 20. course_assignments (instructor ↔ course) ─────────────────────────────
-- Already created in 004_course_assignments.sql — skip if exists

-- ── 21. jobs (background queue) ──────────────────────────────────────────────
-- Already created in 002_jobs_table.sql — skip if exists

-- ── 22. Seed default badges ──────────────────────────────────────────────────
INSERT INTO badges (name, icon, description, rarity) VALUES
  ('First Mission',      '🚀', 'Completed your very first mission',              'common'),
  ('Code Jungle Done',   '🌴', 'Completed all Code Jungle missions',             'rare'),
  ('Data Ocean Done',    '🌊', 'Completed all Data Ocean missions',              'rare'),
  ('Robot Factory Done', '🤖', 'Completed all Robot Factory missions',           'rare'),
  ('Web City Done',      '🏙️', 'Completed all Web City missions',               'rare'),
  ('Mind Palace Done',   '🧠', 'Completed all Mind Palace missions',             'rare'),
  ('Money World Done',   '💰', 'Completed all Money World missions',             'rare'),
  ('Leaders Den Done',   '👑', 'Completed all Leader''s Den missions',           'rare'),
  ('5-Day Streak',       '🔥', 'Maintained a 5-day learning streak',             'common'),
  ('10-Day Streak',      '⚡', 'Maintained a 10-day learning streak',            'rare'),
  ('30-Day Streak',      '💎', 'Maintained a 30-day learning streak',            'epic'),
  ('100 XP',             '⭐', 'Earned 100 XP',                                  'common'),
  ('500 XP',             '🌟', 'Earned 500 XP',                                  'rare'),
  ('1000 XP',            '👑', 'Earned 1,000 XP — you are a champion',          'epic'),
  ('Builder Graduate',   '🎓', 'Completed the entire Builders Track',            'legendary'),
  ('Explorer Graduate',  '🌱', 'Completed the entire Explorers Track',           'legendary'),
  ('Pioneer Graduate',   '🚀', 'Completed the entire Pioneers Track',            'legendary')
ON CONFLICT (name) DO NOTHING;

-- ── 23. Additional indexes for performance ───────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_profiles_parent_id
  ON profiles(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_is_kid
  ON profiles(is_kid) WHERE is_kid = TRUE;
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_user
  ON lesson_completions(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_lesson_completions_course
  ON lesson_completions(course_id, user_id);
CREATE INDEX IF NOT EXISTS idx_courses_junior
  ON courses(is_junior, junior_track) WHERE is_junior = TRUE;
CREATE INDEX IF NOT EXISTS idx_courses_published
  ON courses(is_published, "order") WHERE is_published = TRUE;

