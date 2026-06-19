-- ============================================================================
-- SQL Script: nursing_assessments_tenant_isolation_up.sql
-- Description: Enable RLS & FORCE RLS and create Tenant Isolation policies on nursing_assessments
-- Environment: Staging Only
-- ============================================================================

-- 1. Add columns tenant_id and facility_id as nullable first
ALTER TABLE nursing_assessments ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE nursing_assessments ADD COLUMN IF NOT EXISTS facility_id INTEGER;

-- 2. Backfill tenant_id and facility_id from patients table
UPDATE nursing_assessments a
SET tenant_id = p.tenant_id,
    facility_id = p.facility_id
FROM patients p
WHERE a.patient_id = p.id;

-- 3. Set tenant_id to NOT NULL to enforce safety
ALTER TABLE nursing_assessments ALTER COLUMN tenant_id SET NOT NULL;

-- 4. Enable and Force RLS
ALTER TABLE nursing_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE nursing_assessments FORCE ROW LEVEL SECURITY;

-- 5. Create RLS Policy for Tenant Isolation
DROP POLICY IF EXISTS rls_nursing_assessments_tenant_isolation ON nursing_assessments;
CREATE POLICY rls_nursing_assessments_tenant_isolation ON nursing_assessments
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- 6. Create composite index for performance
CREATE INDEX IF NOT EXISTS idx_nursing_assessments_tenant_facility ON nursing_assessments (tenant_id, facility_id, patient_id);
