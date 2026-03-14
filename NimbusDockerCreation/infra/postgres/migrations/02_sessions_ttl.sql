-- Phase 7: Add duration_minutes column to sessions table
-- end_time already exists in init.sql, we just add duration_minutes
-- and update the DEFAULT so end_time is auto-set on insert.

ALTER TABLE sessions
  ADD COLUMN IF NOT EXISTS duration_minutes INT NOT NULL DEFAULT 120;

-- Update end_time default to be NOW() + 2 hours on every new session
ALTER TABLE sessions
  ALTER COLUMN end_time SET DEFAULT NOW() + INTERVAL '2 hours';
