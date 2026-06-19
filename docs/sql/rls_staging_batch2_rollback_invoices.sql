-- Rollback Batch 2 RLS Enablement on Staging
-- ============================================================================

-- 1. Disable RLS on invoices table
ALTER TABLE invoices DISABLE ROW LEVEL SECURITY;

-- 2. Drop the policy
DROP POLICY IF EXISTS rls_invoices_tenant_isolation ON invoices;

-- 3. Clean up test role permissions for invoices
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        REVOKE ALL ON invoices FROM test_rls_user;
    END IF;
END $$;
