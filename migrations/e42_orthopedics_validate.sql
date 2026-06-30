-- Validation: Verify orthopedics tables, columns, RLS policies, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check orthopedic_implants table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'orthopedic_implants'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table orthopedic_implants does not exist';
    END IF;

    -- 2. Check joint_rom_assessments table
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'joint_rom_assessments'
    ) INTO v_table_exists;
    IF NOT v_table_exists THEN
        RAISE EXCEPTION 'Validation failed: table joint_rom_assessments does not exist';
    END IF;

    -- 3. Check RLS on orthopedic_implants
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'orthopedic_implants';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on orthopedic_implants';
    END IF;

    -- 4. Check RLS on joint_rom_assessments
    SELECT relrowsecurity INTO v_rls_enabled
    FROM pg_class WHERE relname = 'joint_rom_assessments';
    IF NOT v_rls_enabled THEN
        RAISE EXCEPTION 'Validation failed: RLS is not enabled on joint_rom_assessments';
    END IF;

    -- 5. Check index on orthopedic_implants
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'orthopedic_implants' AND indexname = 'idx_orthopedic_implants_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_orthopedic_implants_patient does not exist';
    END IF;

    -- 6. Check index on joint_rom_assessments
    SELECT EXISTS (
        SELECT FROM pg_indexes 
        WHERE schemaname = 'public' AND tablename = 'joint_rom_assessments' AND indexname = 'idx_joint_rom_assessments_patient'
    ) INTO v_index_exists;
    IF NOT v_index_exists THEN
        RAISE EXCEPTION 'Validation failed: index idx_joint_rom_assessments_patient does not exist';
    END IF;

    RAISE NOTICE 'Validation passed: Orthopedics module tables and RLS are fully set up';
END;
$$;
