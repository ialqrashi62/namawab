-- Rollback: Drop ent tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS audiogram_records CASCADE;

COMMIT;
