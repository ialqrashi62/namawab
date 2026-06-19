-- Rollback Batch 3 RLS Enablement on Staging
-- ============================================================================

-- 1. Disable RLS on the selected clinical tables
ALTER TABLE prescriptions DISABLE ROW LEVEL SECURITY;
ALTER TABLE lab_radiology_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_visits DISABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_vitals DISABLE ROW LEVEL SECURITY;

-- 2. Drop the policies
DROP POLICY IF EXISTS rls_prescriptions_tenant_isolation ON prescriptions;
DROP POLICY IF EXISTS rls_lab_radiology_orders_tenant_isolation ON lab_radiology_orders;
DROP POLICY IF EXISTS rls_emergency_visits_tenant_isolation ON emergency_visits;
DROP POLICY IF EXISTS rls_nursing_vitals_tenant_isolation ON nursing_vitals;

-- 3. Clean up test role permissions for these tables
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        REVOKE ALL ON prescriptions FROM test_rls_user;
        REVOKE ALL ON lab_radiology_orders FROM test_rls_user;
        REVOKE ALL ON emergency_visits FROM test_rls_user;
        REVOKE ALL ON nursing_vitals FROM test_rls_user;
    END IF;
END $$;
