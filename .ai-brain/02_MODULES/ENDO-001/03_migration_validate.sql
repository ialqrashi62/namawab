-- e113_endo_module_validate.sql
BEGIN;
SELECT 'endo tables' AS check_name, count(*) FROM information_schema.tables WHERE table_name LIKE 'endo_%';
COMMIT;
