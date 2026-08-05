-- rehab_105 reverse
BEGIN;
DROP TABLE IF EXISTS rehab_105_results CASCADE;
DROP TABLE IF EXISTS rehab_105_orders  CASCADE;
DROP TABLE IF EXISTS rehab_105_visits  CASCADE;
DELETE FROM schema_migrations WHERE id = 'p3_REHAB_105_up';
COMMIT;
