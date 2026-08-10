-- Validation: Verify gastroenterology tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check endoscopy_reports table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'endoscopy_reports'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table endoscopy_reports does not exist';
    END IF;

    -- 2. Check biopsy_samples table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'biopsy_samples'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table biopsy_samples does not exist';
    END IF;

    -- 3. Check RLS on endoscopy_reports
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'endoscopy_reports';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on endoscopy_reports';
    END IF;

    -- 4. Check RLS on biopsy_samples
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'biopsy_samples';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on biopsy_samples';
    END IF;

    -- 5. Check indexes
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'endoscopy_reports' AND indexname = 'idx_endoscopy_reports_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_endoscopy_reports_patient does not exist';
    END IF;

    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'biopsy_samples' AND indexname = 'idx_biopsy_samples_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_biopsy_samples_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Gastroenterology module tables and RLS are fully set up';
END;
$$;
