-- e110_ortho_module_validate.sql
BEGIN;
SELECT 'ortho tables' AS check_name, count(*) AS table_count FROM information_schema.tables WHERE table_name LIKE 'ortho_%';
COMMIT;
