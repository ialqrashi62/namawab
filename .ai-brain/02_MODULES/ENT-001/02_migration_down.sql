-- e111_ent_module_down.sql
BEGIN;
DROP TABLE IF EXISTS ent_vector_index CASCADE;
DROP TABLE IF EXISTS ent_procedures CASCADE;
DROP TABLE IF EXISTS ent_audiology CASCADE;
DROP TABLE IF EXISTS ent_encounters CASCADE;
COMMIT;
