-- Rollback: Drop intensive_care tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS icu_assessments CASCADE;

COMMIT;
