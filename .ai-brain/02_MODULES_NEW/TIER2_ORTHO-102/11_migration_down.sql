-- ortho_102 reverse
BEGIN;
DROP TABLE IF EXISTS ortho_102_results CASCADE;
DROP TABLE IF EXISTS ortho_102_orders  CASCADE;
DROP TABLE IF EXISTS ortho_102_visits  CASCADE;
DELETE FROM schema_migrations WHERE id = 'p3_ORTHO_102_up';
COMMIT;
