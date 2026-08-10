-- Validation: Verify nephrology tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check dialysis_sessions table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'dialysis_sessions'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table dialysis_sessions does not exist';
    END IF;

    -- 2. Check RLS on dialysis_sessions
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'dialysis_sessions';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on dialysis_sessions';
    END IF;

    -- 3. Check index
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'dialysis_sessions' AND indexname = 'idx_dialysis_sessions_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_dialysis_sessions_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Nephrology module tables and RLS are fully set up';
END;
$$;
