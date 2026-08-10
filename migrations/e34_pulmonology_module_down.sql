-- Rollback: Drop pulmonology tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS pulmonary_function_tests CASCADE;

COMMIT;
