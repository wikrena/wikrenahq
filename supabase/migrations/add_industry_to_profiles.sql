-- Migration: Add industry column to profiles
-- Run this in Supabase SQL Editor

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS industry TEXT;
