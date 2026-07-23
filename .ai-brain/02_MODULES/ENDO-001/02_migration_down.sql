-- e113_endo_module_down.sql
BEGIN;
DROP TABLE IF EXISTS endo_vector_index CASCADE;
DROP TABLE IF EXISTS endo_thyroid CASCADE;
DROP TABLE IF EXISTS endo_diabetes CASCADE;
DROP TABLE IF EXISTS endo_encounters CASCADE;
COMMIT;
