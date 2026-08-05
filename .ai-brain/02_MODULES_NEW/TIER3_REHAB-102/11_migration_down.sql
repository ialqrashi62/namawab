-- rehab_102 reverse
BEGIN;
DROP TABLE IF EXISTS rehab_102_results CASCADE;
DROP TABLE IF EXISTS rehab_102_orders  CASCADE;
DROP TABLE IF EXISTS rehab_102_visits  CASCADE;
DELETE FROM schema_migrations WHERE id = 'p3_REHAB_102_up';
COMMIT;
