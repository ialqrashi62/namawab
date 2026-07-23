-- e110_ortho_module_down.sql
BEGIN;
DROP TABLE IF EXISTS ortho_vector_index CASCADE;
DROP TABLE IF EXISTS ortho_prostheses CASCADE;
DROP TABLE IF EXISTS ortho_procedures CASCADE;
DROP TABLE IF EXISTS ortho_fractures CASCADE;
DROP TABLE IF EXISTS ortho_encounters CASCADE;
COMMIT;
