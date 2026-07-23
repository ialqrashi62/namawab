-- e111_ent_module_validate.sql
BEGIN;
SELECT 'ent tables' AS check_name, count(*) FROM information_schema.tables WHERE table_name LIKE 'ent_%';
COMMIT;
