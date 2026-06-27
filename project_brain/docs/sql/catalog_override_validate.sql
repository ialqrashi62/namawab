-- ============================================================================
-- SQL Script: catalog_override_validate.sql
-- Description: Validation queries to verify schema and RLS configuration.
-- Environment: Staging
-- ============================================================================

-- 1. Check table existence and row security (RLS) status
SELECT 
    tablename, 
    rowsecurity AS rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('tenant_lab_test_overrides', 'tenant_radiology_overrides', 'tenant_service_overrides')
ORDER BY tablename;

-- 2. Verify table columns and constraints
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('tenant_lab_test_overrides', 'tenant_radiology_overrides', 'tenant_service_overrides')
ORDER BY table_name, ordinal_position;

-- 3. Verify RLS policies
SELECT 
    policyname, 
    tablename, 
    cmd, 
    qual, 
    with_check
FROM pg_policies
WHERE tablename IN ('tenant_lab_test_overrides', 'tenant_radiology_overrides', 'tenant_service_overrides')
ORDER BY tablename, policyname;
