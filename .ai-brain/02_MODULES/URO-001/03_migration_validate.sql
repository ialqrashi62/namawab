-- e112_uro_module_validate.sql
BEGIN;
SELECT 'uro tables' AS check_name, count(*) FROM information_schema.tables WHERE table_name LIKE 'uro_%';
COMMIT;
