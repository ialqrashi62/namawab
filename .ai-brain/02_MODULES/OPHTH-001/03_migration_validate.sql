-- e114_ophth_module_validate.sql
BEGIN;
SELECT 'ophth tables' AS check_name, count(*) FROM information_schema.tables WHERE table_name LIKE 'ophth_%';
COMMIT;
