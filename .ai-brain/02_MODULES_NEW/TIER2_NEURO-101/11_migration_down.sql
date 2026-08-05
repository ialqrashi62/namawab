-- neuro_101 reverse
BEGIN;
DROP TABLE IF EXISTS neuro_101_results CASCADE;
DROP TABLE IF EXISTS neuro_101_orders  CASCADE;
DROP TABLE IF EXISTS neuro_101_visits  CASCADE;
DELETE FROM schema_migrations WHERE id = 'p3_NEURO_101_up';
COMMIT;
