-- e102_obg_module_validate.sql
-- OBG-001 smoke tests

BEGIN;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'obg_pregnancies', 'obg_prenatal_visits', 'obg_deliveries', 'obg_newborns',
    'obg_preeclampsia_screenings', 'obg_gdm_screenings', 'obg_ultrasounds',
    'obg_medications', 'obg_gynecological_visits', 'obg_procedures',
    'obg_postpartum_followup', 'obg_vector_index'
  ] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % missing', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'All 12 OBG tables exist';
END $$;

SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'obg_%' ORDER BY tablename;
SELECT relname, relforcerowsecurity FROM pg_class WHERE relname LIKE 'obg_%' AND relkind = 'r' ORDER BY relname;

COMMIT;
