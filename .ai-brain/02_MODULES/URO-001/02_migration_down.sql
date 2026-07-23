-- e112_uro_module_down.sql
BEGIN;
DROP TABLE IF EXISTS uro_vector_index CASCADE;
DROP TABLE IF EXISTS uro_procedures CASCADE;
DROP TABLE IF EXISTS uro_stone CASCADE;
DROP TABLE IF EXISTS uro_encounters CASCADE;
COMMIT;
