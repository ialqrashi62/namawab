-- e103_peds_nicu_down.sql
BEGIN;
DROP TABLE IF EXISTS peds_nicu_vector_index CASCADE;
DROP TABLE IF EXISTS peds_nicu_parents CASCADE;
DROP TABLE IF EXISTS peds_nicu_developmental CASCADE;
DROP TABLE IF EXISTS peds_nicu_screenings CASCADE;
DROP TABLE IF EXISTS peds_nicu_procedures CASCADE;
DROP TABLE IF EXISTS peds_nicu_feeds CASCADE;
DROP TABLE IF EXISTS peds_nicu_medications CASCADE;
DROP TABLE IF EXISTS peds_nicu_respiratory CASCADE;
DROP TABLE IF EXISTS peds_nicu_vitals CASCADE;
DROP TABLE IF EXISTS peds_nicu_admissions CASCADE;
COMMIT;
