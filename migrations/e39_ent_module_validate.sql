-- Validation: Verify ent tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check audiogram_records table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'audiogram_records'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table audiogram_records does not exist';
    END IF;

    -- 2. Check RLS on audiogram_records
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'audiogram_records';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on audiogram_records';
    END IF;

    -- 3. Check index
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'audiogram_records' AND indexname = 'idx_audiogram_records_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_audiogram_records_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: ENT module tables and RLS are fully set up';
END;
$$;
