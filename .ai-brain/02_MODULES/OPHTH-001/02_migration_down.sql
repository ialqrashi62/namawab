-- e114_ophth_module_down.sql
BEGIN;
DROP TABLE IF EXISTS ophth_vector_index CASCADE;
DROP TABLE IF EXISTS ophth_exam CASCADE;
DROP TABLE IF EXISTS ophth_encounters CASCADE;
COMMIT;
