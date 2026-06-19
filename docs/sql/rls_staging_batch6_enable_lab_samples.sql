-- Enable RLS for Batch 6 clinical and operational tables on Staging
-- ============================================================================
-- Description: Enable RLS and create tenant isolation policy for lab_samples

-- 1. Enable RLS on lab_samples
ALTER TABLE lab_samples ENABLE ROW LEVEL SECURITY;

-- 2. Create tenant isolation policy for lab_samples
DROP POLICY IF EXISTS rls_lab_samples_tenant_isolation ON lab_samples;
CREATE POLICY rls_lab_samples_tenant_isolation ON lab_samples
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
