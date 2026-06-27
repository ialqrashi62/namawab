-- ============================================================================
-- SQL Script: beds_batch1_wards_beds_up.sql
-- Description: Enable RLS and Create Isolation Policies for Wards & Beds
-- Environment: Staging
-- ============================================================================

-- 1. Create Performance Indexes for Tenant Isolation
CREATE INDEX IF NOT EXISTS idx_wards_tenant_branch ON wards (tenant_id, branch_id);
CREATE INDEX IF NOT EXISTS idx_beds_tenant_branch ON beds (tenant_id, branch_id);

-- 2. Enable and Force RLS on wards Table
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards FORCE ROW LEVEL SECURITY;

-- 3. Create Tenant Isolation Policy for wards
DROP POLICY IF EXISTS rls_wards_tenant_isolation ON wards;
CREATE POLICY rls_wards_tenant_isolation ON wards
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 4. Enable and Force RLS on beds Table
ALTER TABLE beds ENABLE ROW LEVEL SECURITY;
ALTER TABLE beds FORCE ROW LEVEL SECURITY;

-- 5. Create Tenant Isolation Policy for beds
DROP POLICY IF EXISTS rls_beds_tenant_isolation ON beds;
CREATE POLICY rls_beds_tenant_isolation ON beds
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);
