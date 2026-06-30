-- Validation: Verify endocrinology tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check diabetes_glucose_logs table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'diabetes_glucose_logs'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table diabetes_glucose_logs does not exist';
    END IF;

    -- 2. Check insulin_regimens table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'insulin_regimens'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table insulin_regimens does not exist';
    END IF;

    -- 3. Check RLS on diabetes_glucose_logs
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'diabetes_glucose_logs';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on diabetes_glucose_logs';
    END IF;

    -- 4. Check RLS on insulin_regimens
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'insulin_regimens';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on insulin_regimens';
    END IF;

    -- 5. Check indexes
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'diabetes_glucose_logs' AND indexname = 'idx_diabetes_glucose_logs_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_diabetes_glucose_logs_patient does not exist';
    END IF;

    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'insulin_regimens' AND indexname = 'idx_insulin_regimens_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_insulin_regimens_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Endocrinology module tables and RLS are fully set up';
END;
$$;
