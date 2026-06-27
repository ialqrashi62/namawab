-- Rollback Batch 6 RLS Enablement on Staging
-- ============================================================================
-- Description: Disable RLS and drop policy on lab_samples

-- 1. Disable RLS on lab_samples
ALTER TABLE lab_samples DISABLE ROW LEVEL SECURITY;

-- 2. Drop the policy
DROP POLICY IF EXISTS rls_lab_samples_tenant_isolation ON lab_samples;

-- 3. Clean up test role permissions for lab_samples
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        REVOKE ALL ON lab_samples FROM test_rls_user;
    END IF;
END $$;
