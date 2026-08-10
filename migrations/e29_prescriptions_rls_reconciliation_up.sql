-- Migration: Reconcile prescriptions table columns and RLS with production.
BEGIN;

ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS tenant_id INTEGER;
ALTER TABLE prescriptions ADD COLUMN IF NOT EXISTS facility_id INTEGER;

-- Backfill tenant_id
UPDATE prescriptions SET tenant_id = 1 WHERE tenant_id IS NULL;
ALTER TABLE prescriptions ALTER COLUMN tenant_id SET NOT NULL;

-- Enable RLS
ALTER TABLE prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE prescriptions FORCE ROW LEVEL SECURITY;

-- Create RLS policy
DROP POLICY IF EXISTS rls_prescriptions_tenant_isolation ON prescriptions;
CREATE POLICY rls_prescriptions_tenant_isolation ON prescriptions
    FOR ALL
    USING (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::integer);

-- Create index
CREATE INDEX IF NOT EXISTS idx_prescriptions_tenant_facility ON prescriptions (tenant_id, facility_id, patient_id);

COMMIT;
