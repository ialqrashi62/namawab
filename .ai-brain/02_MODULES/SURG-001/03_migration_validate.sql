-- e104_surg_general_validate.sql
BEGIN;
DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'surg_procedures', 'surg_intraop', 'surg_postop', 'surg_complications',
    'surg_drains', 'surg_wound_care', 'surg_vector_index'
  ] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % missing', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'All 7 SURG tables exist';
END $$;
COMMIT;
