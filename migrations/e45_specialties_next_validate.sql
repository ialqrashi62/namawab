-- Validation: Verify CPB logs, pain assessments, and pediatric growth records tables, RLS, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check cpb_logs
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cpb_logs') INTO v_table_exists;
    IF NOT v_table_exists THEN RAISE EXCEPTION 'Validation failed: table cpb_logs does not exist'; END IF;

    SELECT relrowsecurity INTO v_rls_enabled FROM pg_class WHERE relname = 'cpb_logs';
    IF NOT v_rls_enabled THEN RAISE EXCEPTION 'Validation failed: RLS is not enabled on cpb_logs'; END IF;

    SELECT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_cpb_logs_patient') INTO v_index_exists;
    IF NOT v_index_exists THEN RAISE EXCEPTION 'Validation failed: index idx_cpb_logs_patient does not exist'; END IF;

    -- 2. Check pain_assessments
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pain_assessments') INTO v_table_exists;
    IF NOT v_table_exists THEN RAISE EXCEPTION 'Validation failed: table pain_assessments does not exist'; END IF;

    SELECT relrowsecurity INTO v_rls_enabled FROM pg_class WHERE relname = 'pain_assessments';
    IF NOT v_rls_enabled THEN RAISE EXCEPTION 'Validation failed: RLS is not enabled on pain_assessments'; END IF;

    SELECT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_pain_assessments_patient') INTO v_index_exists;
    IF NOT v_index_exists THEN RAISE EXCEPTION 'Validation failed: index idx_pain_assessments_patient does not exist'; END IF;

    -- 3. Check pediatric_growth_records
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'pediatric_growth_records') INTO v_table_exists;
    IF NOT v_table_exists THEN RAISE EXCEPTION 'Validation failed: table pediatric_growth_records does not exist'; END IF;

    SELECT relrowsecurity INTO v_rls_enabled FROM pg_class WHERE relname = 'pediatric_growth_records';
    IF NOT v_rls_enabled THEN RAISE EXCEPTION 'Validation failed: RLS is not enabled on pediatric_growth_records'; END IF;

    SELECT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_pediatric_growth_records_patient') INTO v_index_exists;
    IF NOT v_index_exists THEN RAISE EXCEPTION 'Validation failed: index idx_pediatric_growth_records_patient does not exist'; END IF;

    RAISE NOTICE 'Validation passed: G16, G19, and G20 module tables and RLS are fully set up';
END;
$$;
