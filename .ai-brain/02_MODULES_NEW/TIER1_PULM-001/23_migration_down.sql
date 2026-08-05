-- 23_migration_down.sql
-- Reverse of p1_002 (PULM-001).
-- Non-destructive: drops tables in reverse order, only created objects.

BEGIN;

DROP TABLE IF EXISTS pulmonary_tasks_v2         CASCADE;
DROP TABLE IF EXISTS ai_assessments             CASCADE;
DROP TABLE IF EXISTS lung_biopsy_reports        CASCADE;
DROP TABLE IF EXISTS pulmonary_function_tests   CASCADE;
DROP TABLE IF EXISTS sleep_studies              CASCADE;
DROP TABLE IF EXISTS pulmonary_pathway_steps    CASCADE;
DROP TABLE IF EXISTS pulmonary_care_pathways    CASCADE;
DROP TABLE IF EXISTS pulmonary_results          CASCADE;
DROP TABLE IF EXISTS pulmonary_orders           CASCADE;
DROP TABLE IF EXISTS pulmonary_visits           CASCADE;

DELETE FROM schema_migrations WHERE id = 'p1_002';

COMMIT;
