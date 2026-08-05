-- p1_003 reverse migration (non-destructive reverse)

BEGIN;

DROP TABLE IF EXISTS gi_ai_assessments      CASCADE;
DROP TABLE IF EXISTS gi_tasks_v2           CASCADE;
DROP TABLE IF EXISTS gi_orders             CASCADE;
DROP TABLE IF EXISTS ibd_assessments       CASCADE;
DROP TABLE IF EXISTS gi_labs               CASCADE;
DROP TABLE IF EXISTS gi_pathology_results  CASCADE;
DROP TABLE IF EXISTS gi_biopsy_results     CASCADE;
DROP TABLE IF EXISTS gi_procedures         CASCADE;
DROP TABLE IF EXISTS gi_visits             CASCADE;

DELETE FROM schema_migrations WHERE id = 'p1_003';

COMMIT;
