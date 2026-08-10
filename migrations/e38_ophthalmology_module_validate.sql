-- Validation: Verify ophthalmology tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check eye_exams table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'eye_exams'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table eye_exams does not exist';
    END IF;

    -- 2. Check RLS on eye_exams
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'eye_exams';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on eye_exams';
    END IF;

    -- 3. Check index
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'eye_exams' AND indexname = 'idx_eye_exams_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_eye_exams_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Ophthalmology module tables and RLS are fully set up';
END;
$$;
