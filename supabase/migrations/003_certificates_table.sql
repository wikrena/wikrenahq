-- ============================================================
-- Wikrena Academy — Certificates Table
-- ============================================================
--
-- DESIGN DECISIONS:
-- 1. user_id and course_id are TEXT to match profiles.id and courses.id
--    which use Supabase Auth string IDs and cuid() respectively.
--    Foreign key constraints enforce referential integrity properly.
--
-- 2. id uses UUID for the certificate itself — this is intentional.
--    Certificate IDs are publicly visible in verification URLs like
--    /certificates/550e8400-e29b-41d4-a716-446655440000
--    UUIDs are harder to enumerate than sequential integers or cuid strings.
--    This prevents people from guessing certificate IDs.
--
-- 3. Row Level Security:
--    - Anyone can read a certificate (public verification)
--    - Only the service role (backend) can create/update/delete
-- ============================================================

CREATE TABLE IF NOT EXISTS certificates (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      TEXT        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id    TEXT        NOT NULL REFERENCES courses(id)  ON DELETE CASCADE,
  issued_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verify_url   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- A student can only earn one certificate per course
  UNIQUE(user_id, course_id)
);

-- Fast lookup of a student's certificates
CREATE INDEX IF NOT EXISTS idx_certificates_user_id
ON certificates(user_id, issued_at DESC);

-- Fast public verification lookup by certificate ID
CREATE INDEX IF NOT EXISTS idx_certificates_id
ON certificates(id);

-- Enable Row Level Security
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- Public can verify any certificate by ID (no login needed)
-- This is intentional — certificate verification should be public
CREATE POLICY "Public read for certificate verification" ON certificates
  FOR SELECT USING (true);

-- Only the server (service role) can issue, update or revoke certificates
-- Students and parents cannot create certificates themselves
CREATE POLICY "Service role manages certificates" ON certificates
  FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMENT ON TABLE certificates IS
  'Course completion certificates. 
   Publicly verifiable at /certificates/:id
   Issued automatically when a student completes all lessons in a course.
   UUID primary key prevents enumeration of certificate IDs.';

COMMENT ON COLUMN certificates.id IS
  'UUID used as public certificate identifier. Harder to enumerate than sequential IDs.';

COMMENT ON COLUMN certificates.user_id IS
  'References profiles.id (TEXT type — matches Supabase Auth user ID format).';
