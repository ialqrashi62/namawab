-- neuro_102 reverse
BEGIN;
DROP TABLE IF EXISTS neuro_102_results CASCADE;
DROP TABLE IF EXISTS neuro_102_orders  CASCADE;
DROP TABLE IF EXISTS neuro_102_visits  CASCADE;
DELETE FROM schema_migrations WHERE id = 'p3_NEURO_102_up';
COMMIT;
