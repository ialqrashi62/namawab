-- Enable RLS for clinical critical tables on Staging (Batch 3)
-- ============================================================================

-- 1. Enable RLS on selected clinical tables
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_radiology_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_vitals ENABLE ROW LEVEL SECURITY;

-- 2. Create tenant isolation policy for prescriptions
DROP POLICY IF EXISTS rls_prescriptions_tenant_isolation ON prescriptions;
CREATE POLICY rls_prescriptions_tenant_isolation ON prescriptions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 3. Create tenant isolation policy for lab_radiology_orders
DROP POLICY IF EXISTS rls_lab_radiology_orders_tenant_isolation ON lab_radiology_orders;
CREATE POLICY rls_lab_radiology_orders_tenant_isolation ON lab_radiology_orders
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 4. Create tenant isolation policy for emergency_visits
DROP POLICY IF EXISTS rls_emergency_visits_tenant_isolation ON emergency_visits;
CREATE POLICY rls_emergency_visits_tenant_isolation ON emergency_visits
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 5. Create tenant isolation policy for nursing_vitals
DROP POLICY IF EXISTS rls_nursing_vitals_tenant_isolation ON nursing_vitals;
CREATE POLICY rls_nursing_vitals_tenant_isolation ON nursing_vitals
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
