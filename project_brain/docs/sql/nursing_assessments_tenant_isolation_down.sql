-- ============================================================================
-- SQL Script: nursing_assessments_tenant_isolation_down.sql
-- Description: Rollback RLS and drop Tenant Isolation policies/columns on nursing_assessments
-- Environment: Staging Only
-- ============================================================================

-- 1. Drop Policy
DROP POLICY IF EXISTS rls_nursing_assessments_tenant_isolation ON nursing_assessments;

-- 2. Disable RLS
ALTER TABLE nursing_assessments DISABLE ROW LEVEL SECURITY;

-- 3. Drop Indexes
DROP INDEX IF EXISTS idx_nursing_assessments_tenant_facility;

-- 4. Drop columns
ALTER TABLE nursing_assessments DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE nursing_assessments DROP COLUMN IF EXISTS facility_id;
