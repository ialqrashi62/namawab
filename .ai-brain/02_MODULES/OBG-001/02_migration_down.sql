-- e102_obg_module_down.sql
-- OBG-001 rollback

BEGIN;

DROP TABLE IF EXISTS obg_vector_index CASCADE;
DROP TABLE IF EXISTS obg_postpartum_followup CASCADE;
DROP TABLE IF EXISTS obg_procedures CASCADE;
DROP TABLE IF EXISTS obg_gynecological_visits CASCADE;
DROP TABLE IF EXISTS obg_medications CASCADE;
DROP TABLE IF EXISTS obg_ultrasounds CASCADE;
DROP TABLE IF EXISTS obg_gdm_screenings CASCADE;
DROP TABLE IF EXISTS obg_preeclampsia_screenings CASCADE;
DROP TABLE IF EXISTS obg_newborns CASCADE;
DROP TABLE IF EXISTS obg_deliveries CASCADE;
DROP TABLE IF EXISTS obg_prenatal_visits CASCADE;
DROP TABLE IF EXISTS obg_pregnancies CASCADE;

COMMIT;
