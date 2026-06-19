-- Enable RLS for high-risk clinical and operational tables on Staging (Batch 4)
-- ============================================================================

-- 1. Enable RLS on selected clinical tables
ALTER TABLE lab_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE insurance_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE pharmacy_prescriptions_queue ENABLE ROW LEVEL SECURITY;

-- 2. Create tenant isolation policy for lab_results
DROP POLICY IF EXISTS rls_lab_results_tenant_isolation ON lab_results;
CREATE POLICY rls_lab_results_tenant_isolation ON lab_results
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 3. Create tenant isolation policy for insurance_claims
DROP POLICY IF EXISTS rls_insurance_claims_tenant_isolation ON insurance_claims;
CREATE POLICY rls_insurance_claims_tenant_isolation ON insurance_claims
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 4. Create tenant isolation policy for pharmacy_prescriptions_queue
DROP POLICY IF EXISTS rls_pharmacy_prescriptions_queue_tenant_isolation ON pharmacy_prescriptions_queue;
CREATE POLICY rls_pharmacy_prescriptions_queue_tenant_isolation ON pharmacy_prescriptions_queue
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
