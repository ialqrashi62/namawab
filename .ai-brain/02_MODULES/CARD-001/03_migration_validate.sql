-- e105_card_module_validate.sql
BEGIN;
DO $$
DECLARE tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'card_encounters', 'card_ecgs', 'card_troponins', 'card_echocardiograms',
    'card_procedures', 'card_medications', 'card_devices', 'card_vector_index'
  ] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % missing', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'All 8 CARD tables exist';
END $$;
COMMIT;
