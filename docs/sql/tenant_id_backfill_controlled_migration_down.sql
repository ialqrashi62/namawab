-- WARNING: Controlled rollback script for Staging only. Do not run on Production.
-- ============================================================================
-- Description: Rollback tenant_id backfill on lab_samples

-- 1. Drop foreign key constraint if exists
ALTER TABLE lab_samples DROP CONSTRAINT IF EXISTS fk_lab_samples_tenant;

-- 2. Drop index if exists
DROP INDEX IF EXISTS idx_lab_samples_tenant;

-- 3. Drop column if exists
ALTER TABLE lab_samples DROP COLUMN IF EXISTS tenant_id;
