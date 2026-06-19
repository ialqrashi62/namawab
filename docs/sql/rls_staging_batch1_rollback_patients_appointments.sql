-- Rollback Batch 1 RLS Enablement on Staging
-- ============================================================================

-- 1. Disable RLS on target tables
ALTER TABLE patients DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;

-- 2. Drop the permanent-ish policies
DROP POLICY IF EXISTS rls_patients_tenant_isolation ON patients;
DROP POLICY IF EXISTS rls_appointments_tenant_isolation ON appointments;

-- 3. Clean up testing role
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_roles WHERE rolname = 'test_rls_user') THEN
        REVOKE ALL ON patients, appointments FROM test_rls_user;
        REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM test_rls_user;
        DROP ROLE test_rls_user;
    END IF;
END $$;
