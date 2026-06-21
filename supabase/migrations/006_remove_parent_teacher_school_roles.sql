-- Remove PARENT / TEACHER / SCHOOL roles — leftover from the removed Junior platform.
-- The adult Academy platform only has STUDENT, INSTRUCTOR, and ADMIN.

UPDATE profiles SET role = 'STUDENT' WHERE role IN ('PARENT', 'TEACHER', 'SCHOOL');

ALTER TABLE profiles
  DROP COLUMN IF EXISTS parent_id,
  DROP COLUMN IF EXISTS is_kid,
  DROP COLUMN IF EXISTS kid_pin,
  DROP COLUMN IF EXISTS kid_track;
