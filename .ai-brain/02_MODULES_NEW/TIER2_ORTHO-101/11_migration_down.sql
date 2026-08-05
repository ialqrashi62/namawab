-- ortho_101 reverse
BEGIN;
DROP TABLE IF EXISTS ortho_101_results CASCADE;
DROP TABLE IF EXISTS ortho_101_orders  CASCADE;
DROP TABLE IF EXISTS ortho_101_visits  CASCADE;
DELETE FROM schema_migrations WHERE id = 'p3_ORTHO_101_up';
COMMIT;
