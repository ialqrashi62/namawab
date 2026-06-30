-- Rollback: Drop neurology tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS neurology_assessments CASCADE;

COMMIT;
