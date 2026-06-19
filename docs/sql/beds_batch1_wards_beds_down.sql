-- ============================================================================
-- SQL Script: beds_batch1_wards_beds_down.sql
-- Description: Disable RLS and Remove Policies/Indexes for Wards & Beds
-- Environment: Staging
-- ============================================================================

-- 1. Disable RLS on wards and beds
ALTER TABLE beds NO FORCE ROW LEVEL SECURITY;
ALTER TABLE beds DISABLE ROW LEVEL SECURITY;

ALTER TABLE wards NO FORCE ROW LEVEL SECURITY;
ALTER TABLE wards DISABLE ROW LEVEL SECURITY;

-- 2. Drop Policies
DROP POLICY IF EXISTS rls_beds_tenant_isolation ON beds;
DROP POLICY IF EXISTS rls_wards_tenant_isolation ON wards;

-- 3. Remove Indexes
DROP INDEX IF EXISTS idx_beds_tenant_branch;
DROP INDEX IF EXISTS idx_wards_tenant_branch;

-- 4. Clean up test role permissions if exist
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        REVOKE ALL ON beds FROM test_rls_user;
        REVOKE ALL ON wards FROM test_rls_user;
    END IF;
END $$;
