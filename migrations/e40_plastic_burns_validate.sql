-- Validation: Verify plastic_burns tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check burn_assessments table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'burn_assessments'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table burn_assessments does not exist';
    END IF;

    -- 2. Check clinical_photos_meta table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'clinical_photos_meta'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table clinical_photos_meta does not exist';
    END IF;

    -- 3. Check RLS on burn_assessments
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'burn_assessments';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on burn_assessments';
    END IF;

    -- 4. Check RLS on clinical_photos_meta
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'clinical_photos_meta';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on clinical_photos_meta';
    END IF;

    -- 5. Check index on burn_assessments
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'burn_assessments' AND indexname = 'idx_burn_assessments_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_burn_assessments_patient does not exist';
    END IF;

    -- 6. Check index on clinical_photos_meta
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'clinical_photos_meta' AND indexname = 'idx_clinical_photos_meta_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_clinical_photos_meta_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Plastic & Burns module tables and RLS are fully set up';
END;
$$;
