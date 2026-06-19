-- ============================================================
-- Wikrena Academy — Background Jobs Table
-- Run this ONCE in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type        TEXT NOT NULL,
  payload     JSONB NOT NULL DEFAULT '{}',
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending', 'processing', 'complete', 'failed')),
  priority    INTEGER NOT NULL DEFAULT 0,
  attempts    INTEGER NOT NULL DEFAULT 0,
  max_retries INTEGER NOT NULL DEFAULT 3,
  run_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_error  TEXT,
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for the job processor
CREATE INDEX IF NOT EXISTS idx_jobs_pending
ON jobs(status, run_at ASC, priority DESC)
WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_jobs_type
ON jobs(type, created_at DESC);

-- Auto-clean old completed jobs (keeps table lean)
-- Completed jobs older than 7 days are removed by the weekly cron
-- This comment serves as documentation

-- Row Level Security — jobs table is server-only (no RLS needed)
-- The service role key is the only thing that touches this table
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Only the service role (backend) can access jobs
CREATE POLICY "Service role only" ON jobs
  USING (false)  -- blocks all client access
  WITH CHECK (false);

COMMENT ON TABLE jobs IS
  'Background job queue. Processed by /api/jobs/process every minute via Vercel Cron.
   Jobs are created by API routes and processed asynchronously.
   Failed jobs retry up to max_retries times with exponential backoff.';
