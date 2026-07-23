-- e107_gi_module_validate.sql
BEGIN;
DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'gi_encounters', 'gi_endoscopies', 'gi_medications',
    'gi_liver', 'gi_bleed_assessments', 'gi_vector_index'
  ] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % missing', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'All 6 GI tables exist';
END $$;
COMMIT;
