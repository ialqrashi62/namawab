-- Rollback: Drop nephrology tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS dialysis_sessions CASCADE;

COMMIT;
