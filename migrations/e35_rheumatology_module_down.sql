-- Rollback: Drop rheumatology tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS joint_assessments CASCADE;

COMMIT;
