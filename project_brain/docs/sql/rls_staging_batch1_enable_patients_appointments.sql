-- Enable RLS for patients and appointments tables on Staging (Batch 1)
-- ============================================================================

-- 1. Enable RLS on target tables (no FORCE to allow app's postgres superuser to bypass while testing non-superuser)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- 2. Create permanent-ish policies for patients table
DROP POLICY IF EXISTS rls_patients_tenant_isolation ON patients;
CREATE POLICY rls_patients_tenant_isolation ON patients
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 3. Create permanent-ish policies for appointments table
DROP POLICY IF EXISTS rls_appointments_tenant_isolation ON appointments;
CREATE POLICY rls_appointments_tenant_isolation ON appointments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
