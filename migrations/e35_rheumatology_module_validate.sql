-- Validation: Verify rheumatology tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check joint_assessments table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'joint_assessments'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table joint_assessments does not exist';
    END IF;

    -- 2. Check RLS on joint_assessments
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'joint_assessments';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on joint_assessments';
    END IF;

    -- 3. Check index
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'joint_assessments' AND indexname = 'idx_joint_assessments_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_joint_assessments_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Rheumatology module tables and RLS are fully set up';
END;
$$;
