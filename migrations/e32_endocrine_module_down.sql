-- Rollback: Drop endocrinology tables and RLS policies.
BEGIN;

DROP TABLE IF EXISTS insulin_regimens CASCADE;
DROP TABLE IF EXISTS diabetes_glucose_logs CASCADE;

COMMIT;
