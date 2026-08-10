-- Rollback Migration: Remove RLS and custom columns from prescriptions.
BEGIN;

DROP INDEX IF EXISTS idx_prescriptions_tenant_facility;
DROP POLICY IF EXISTS rls_prescriptions_tenant_isolation ON prescriptions;
ALTER TABLE prescriptions DISABLE ROW LEVEL SECURITY;

ALTER TABLE prescriptions DROP COLUMN IF EXISTS tenant_id;
ALTER TABLE prescriptions DROP COLUMN IF EXISTS facility_id;

COMMIT;
