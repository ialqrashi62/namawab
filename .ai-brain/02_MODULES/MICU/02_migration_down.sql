-- e101_micu_module_down.sql
-- MICU module rollback

BEGIN;

DROP TABLE IF EXISTS icu_vector_index CASCADE;
DROP TABLE IF EXISTS icu_lines_drains CASCADE;
DROP TABLE IF EXISTS icu_isolation_orders CASCADE;
DROP TABLE IF EXISTS icu_daily_rounds CASCADE;
DROP TABLE IF EXISTS icu_delirium_assessments CASCADE;
DROP TABLE IF EXISTS icu_code_status CASCADE;
DROP TABLE IF EXISTS icu_sepsis_bundle CASCADE;
DROP TABLE IF EXISTS icu_procedures CASCADE;
DROP TABLE IF EXISTS icu_labs CASCADE;
DROP TABLE IF EXISTS icu_medications CASCADE;
DROP TABLE IF EXISTS icu_vasoactive_drips CASCADE;
DROP TABLE IF EXISTS icu_ventilator CASCADE;
DROP TABLE IF EXISTS icu_scores CASCADE;
DROP TABLE IF EXISTS icu_vitals CASCADE;
DROP TABLE IF EXISTS icu_admissions CASCADE;

COMMIT;
