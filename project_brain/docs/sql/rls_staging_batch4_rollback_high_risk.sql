-- Rollback Batch 4 RLS Enablement on Staging
-- ============================================================================

-- 1. Disable RLS on the selected clinical/operational tables
ALTER TABLE lab_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims DISABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_prescriptions_queue DISABLE ROW LEVEL SECURITY;

-- 2. Drop the policies
DROP POLICY IF EXISTS rls_lab_results_tenant_isolation ON lab_results;
DROP POLICY IF EXISTS rls_insurance_claims_tenant_isolation ON insurance_claims;
DROP POLICY IF EXISTS rls_pharmacy_prescriptions_queue_tenant_isolation ON pharmacy_prescriptions_queue;

-- 3. Clean up test role permissions for these tables
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        REVOKE ALL ON lab_results FROM test_rls_user;
        REVOKE ALL ON insurance_claims FROM test_rls_user;
        REVOKE ALL ON pharmacy_prescriptions_queue FROM test_rls_user;
    END IF;
END $$;
