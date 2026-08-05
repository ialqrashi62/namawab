-- rehab_103 reverse
BEGIN;
DROP TABLE IF EXISTS rehab_103_results CASCADE;
DROP TABLE IF EXISTS rehab_103_orders  CASCADE;
DROP TABLE IF EXISTS rehab_103_visits  CASCADE;
DELETE FROM schema_migrations WHERE id = 'p3_REHAB_103_up';
COMMIT;
