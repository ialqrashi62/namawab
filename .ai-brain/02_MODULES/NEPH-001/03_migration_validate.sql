-- e108_neph_module_validate.sql
BEGIN;
DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['neph_encounters', 'neph_labs', 'neph_dialysis', 'neph_transplant', 'neph_medications', 'neph_vector_index'] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % missing', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'All 6 NEPH tables exist';
END $$;
COMMIT;
