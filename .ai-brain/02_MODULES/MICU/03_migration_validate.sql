-- e101_micu_module_validate.sql
-- MICU post-deploy smoke tests

BEGIN;

-- 1. Tables exist
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY[
    'icu_admissions', 'icu_vitals', 'icu_scores', 'icu_ventilator',
    'icu_vasoactive_drips', 'icu_medications', 'icu_labs', 'icu_procedures',
    'icu_sepsis_bundle', 'icu_code_status', 'icu_delirium_assessments',
    'icu_daily_rounds', 'icu_isolation_orders', 'icu_lines_drains',
    'icu_vector_index'
  ] LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % missing', tbl;
    END IF;
  END LOOP;
  RAISE NOTICE 'All 15 MICU tables exist';
END $$;

-- 2. RLS enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename LIKE 'icu_%'
ORDER BY tablename;

-- 3. FORCE RLS
SELECT relname, relforcerowsecurity
FROM pg_class
WHERE relname LIKE 'icu_%' AND relkind = 'r'
ORDER BY relname;

-- 4. Indexes exist
SELECT indexname FROM pg_indexes
WHERE schemaname = 'public' AND tablename LIKE 'icu_%'
ORDER BY indexname;

-- 5. Vector index
SELECT indexname, indexdef FROM pg_indexes
WHERE indexname LIKE '%hnsw%' OR indexname LIKE '%vector%';

-- 6. Test insert (rollback)
DO $$
BEGIN
  INSERT INTO icu_admissions (tenant_id, encounter_id, patient_id, admitted_at, primary_diagnosis)
  VALUES ('00000000-0000-0000-0000-000000000000'::uuid, 1, 1, NOW(), 'TEST');
  RAISE NOTICE 'Insert into icu_admissions works';
  ROLLBACK;
END $$;

COMMIT;
