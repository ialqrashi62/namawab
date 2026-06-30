-- Rollback: Drop ophthalmology tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS eye_exams CASCADE;

COMMIT;
