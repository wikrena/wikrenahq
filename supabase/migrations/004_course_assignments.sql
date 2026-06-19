-- ============================================================
-- Wikrena Academy — Course Assignments Table
-- Allows admins to assign instructors to specific courses.
-- An instructor can also own courses via courses.instructor_id.
-- This table handles the many-to-many relationship.
-- ============================================================

CREATE TABLE IF NOT EXISTS course_assignments (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id     TEXT        NOT NULL REFERENCES courses(id)  ON DELETE CASCADE,
  instructor_id TEXT        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_by   TEXT        REFERENCES profiles(id) ON DELETE SET NULL,
  assigned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(course_id, instructor_id)
);

CREATE INDEX IF NOT EXISTS idx_course_assignments_instructor
ON course_assignments(instructor_id);

CREATE INDEX IF NOT EXISTS idx_course_assignments_course
ON course_assignments(course_id);

ALTER TABLE course_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages assignments" ON course_assignments
  FOR ALL TO service_role USING (true) WITH CHECK (true);

COMMENT ON TABLE course_assignments IS
  'Assigns instructors to courses. Supplements courses.instructor_id
   for cases where multiple instructors work on one course,
   or where an admin assigns an existing course to a new instructor.';
