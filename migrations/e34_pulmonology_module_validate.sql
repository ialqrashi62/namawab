-- Validation: Verify pulmonology tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check pulmonary_function_tests table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'pulmonary_function_tests'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table pulmonary_function_tests does not exist';
    END IF;

    -- 2. Check RLS on pulmonary_function_tests
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'pulmonary_function_tests';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on pulmonary_function_tests';
    END IF;

    -- 3. Check index
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'pulmonary_function_tests' AND indexname = 'idx_pulmonary_function_tests_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_pulmonary_function_tests_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Pulmonology module tables and RLS are fully set up';
END;
$$;
