-- obg_001 reverse (non-destructive)

BEGIN;
DROP TABLE IF EXISTS obg_001_ai_assessments CASCADE;
DROP TABLE IF EXISTS obg_001_tasks_v2      CASCADE;
DROP TABLE IF EXISTS obg_001_results       CASCADE;
DROP TABLE IF EXISTS obg_001_orders        CASCADE;
DROP TABLE IF EXISTS obg_001_visits        CASCADE;
DELETE FROM schema_migrations WHERE id = 'p1_OBG_001_up';
COMMIT;
