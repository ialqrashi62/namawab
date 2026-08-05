-- rehab_101 reverse
BEGIN;
DROP TABLE IF EXISTS rehab_101_results CASCADE;
DROP TABLE IF EXISTS rehab_101_orders  CASCADE;
DROP TABLE IF EXISTS rehab_101_visits  CASCADE;
DELETE FROM schema_migrations WHERE id = 'p3_REHAB_101_up';
COMMIT;
