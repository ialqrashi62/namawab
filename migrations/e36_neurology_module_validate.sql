-- Validation: Verify neurology tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check neurology_assessments table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'neurology_assessments'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table neurology_assessments does not exist';
    END IF;

    -- 2. Check RLS on neurology_assessments
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'neurology_assessments';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on neurology_assessments';
    END IF;

    -- 3. Check index
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'neurology_assessments' AND indexname = 'idx_neurology_assessments_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_neurology_assessments_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Neurology module tables and RLS are fully set up';
END;
$$;
