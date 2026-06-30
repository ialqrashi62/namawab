-- Rollback: Drop CPB logs, pain assessments, and pediatric growth records tables.
BEGIN;

DROP TABLE IF EXISTS cpb_logs CASCADE;
DROP TABLE IF EXISTS pain_assessments CASCADE;
DROP TABLE IF EXISTS pediatric_growth_records CASCADE;

COMMIT;
