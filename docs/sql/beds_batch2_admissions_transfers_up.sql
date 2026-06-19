-- ============================================================================
-- SQL Script: beds_batch2_admissions_transfers_up.sql
-- Description: Enable RLS and Create Isolation Policies for Admissions & Bed Transfers
-- Environment: Staging
-- ============================================================================

-- 1. Create Performance Index for Bed Transfers Tenant Isolation
CREATE INDEX IF NOT EXISTS idx_bed_transfers_tenant_branch ON bed_transfers (tenant_id, branch_id);

-- 2. Enable and Force RLS on admissions Table
ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admissions FORCE ROW LEVEL SECURITY;

-- 3. Create Tenant Isolation Policy for admissions
-- Enforces:
-- - Read/Update isolated by tenant_id
-- - Cannot link admission to patient or bed of another tenant (context alignment)
DROP POLICY IF EXISTS rls_admissions_tenant_isolation ON admissions;
CREATE POLICY rls_admissions_tenant_isolation ON admissions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer
        AND (patient_id IS NULL OR (SELECT tenant_id FROM patients WHERE id = patient_id) = tenant_id)
        AND (bed_id IS NULL OR (SELECT tenant_id FROM beds WHERE id = bed_id) = tenant_id)
    );

-- 4. Enable and Force RLS on bed_transfers Table
ALTER TABLE bed_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bed_transfers FORCE ROW LEVEL SECURITY;

-- 5. Create Tenant Isolation Policy for bed_transfers
-- Enforces:
-- - Read/Update isolated by tenant_id
-- - Cannot transfer to a bed or patient belonging to another tenant
DROP POLICY IF EXISTS rls_bed_transfers_tenant_isolation ON bed_transfers;
CREATE POLICY rls_bed_transfers_tenant_isolation ON bed_transfers
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (
        tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer
        AND (patient_id IS NULL OR (SELECT tenant_id FROM patients WHERE id = patient_id) = tenant_id)
        AND (to_bed IS NULL OR (SELECT tenant_id FROM beds WHERE id = to_bed) = tenant_id)
    );
