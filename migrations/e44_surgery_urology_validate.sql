-- Validation: Verify surgical checklists, time logs, and urodynamic studies tables, RLS, and indexes.
DO $$
DECLARE
    v_table_exists BOOLEAN;
    v_rls_enabled BOOLEAN;
    v_index_exists BOOLEAN;
BEGIN
    -- 1. Check surgical_checklists
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'surgical_checklists') INTO v_table_exists;
    IF NOT v_table_exists THEN RAISE EXCEPTION 'Validation failed: table surgical_checklists does not exist'; END IF;

    SELECT relrowsecurity INTO v_rls_enabled FROM pg_class WHERE relname = 'surgical_checklists';
    IF NOT v_rls_enabled THEN RAISE EXCEPTION 'Validation failed: RLS is not enabled on surgical_checklists'; END IF;

    SELECT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_surgical_checklists_patient') INTO v_index_exists;
    IF NOT v_index_exists THEN RAISE EXCEPTION 'Validation failed: index idx_surgical_checklists_patient does not exist'; END IF;

    -- 2. Check surgical_time_logs
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'surgical_time_logs') INTO v_table_exists;
    IF NOT v_table_exists THEN RAISE EXCEPTION 'Validation failed: table surgical_time_logs does not exist'; END IF;

    SELECT relrowsecurity INTO v_rls_enabled FROM pg_class WHERE relname = 'surgical_time_logs';
    IF NOT v_rls_enabled THEN RAISE EXCEPTION 'Validation failed: RLS is not enabled on surgical_time_logs'; END IF;

    SELECT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_surgical_time_logs_patient') INTO v_index_exists;
    IF NOT v_index_exists THEN RAISE EXCEPTION 'Validation failed: index idx_surgical_time_logs_patient does not exist'; END IF;

    -- 3. Check urodynamic_studies
    SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'urodynamic_studies') INTO v_table_exists;
    IF NOT v_table_exists THEN RAISE EXCEPTION 'Validation failed: table urodynamic_studies does not exist'; END IF;

    SELECT relrowsecurity INTO v_rls_enabled FROM pg_class WHERE relname = 'urodynamic_studies';
    IF NOT v_rls_enabled THEN RAISE EXCEPTION 'Validation failed: RLS is not enabled on urodynamic_studies'; END IF;

    SELECT EXISTS (SELECT FROM pg_indexes WHERE indexname = 'idx_urodynamic_studies_patient') INTO v_index_exists;
    IF NOT v_index_exists THEN RAISE EXCEPTION 'Validation failed: index idx_urodynamic_studies_patient does not exist'; END IF;

    RAISE NOTICE 'Validation passed: General Surgery and Urology module tables and RLS are fully set up';
END;
$$;
