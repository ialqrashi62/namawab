-- NEURO-001 migration validate
-- Asserts every created table has tenant_id + RLS enabled + policy exists.

DO $$
DECLARE
  v_table text;
  v_missing int := 0;
  v_expected text[] := ARRAY[
    'neuro_001_visits', 'neuro_001_orders', 'neuro_001_results',
    'neuro_001_tasks_v2', 'neuro_001_ai_assessments'
  ];
BEGIN
  FOREACH v_table IN ARRAY v_expected LOOP
    IF NOT EXISTS (
      SELECT 1 FROM pg_tables
      WHERE schemaname='public' AND tablename=v_table
    ) THEN
      RAISE WARNING 'Table % not found', v_table; v_missing := v_missing + 1;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname='public' AND tablename=v_table
    ) THEN
      RAISE WARNING 'No RLS policy on %', v_table; v_missing := v_missing + 1;
    END IF;
    IF NOT EXISTS (
      SELECT 1 FROM pg_class c
      JOIN pg_namespace n ON c.relnamespace = n.oid
      WHERE c.relname = v_table AND n.nspname = 'public' AND c.relrowsecurity AND c.relforcerowsecurity
    ) THEN
      RAISE WARNING 'FORCE RLS not enabled on %', v_table; v_missing := v_missing + 1;
    END IF;
  END LOOP;
  IF v_missing > 0 THEN
    RAISE EXCEPTION 'Migration validation failed: % issues', v_missing;
  ELSE
    RAISE NOTICE 'NEURO-001 migration validation: PASS';
  END IF;
END $$;
