-- e103_peds_nicu_validate.sql
BEGIN;
DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'peds_nicu_admissions', 'peds_nicu_vitals', 'peds_nicu_respiratory',
    'peds_nicu_medications', 'peds_nicu_feeds', 'peds_nicu_procedures',
    'peds_nicu_screenings', 'peds_nicu_developmental', 'peds_nicu_parents',
    'peds_nicu_vector_index'
  ] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % missing', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'All 10 PEDS-NICU tables exist';
END $$;
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' AND tablename LIKE 'peds_nicu_%';
SELECT relname, relforcerowsecurity FROM pg_class WHERE relname LIKE 'peds_nicu_%' AND relkind = 'r';
COMMIT;
