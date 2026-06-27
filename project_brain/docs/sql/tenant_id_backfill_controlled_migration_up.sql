-- WARNING: Controlled migration script for Staging only. Do not run on Production.
-- ============================================================================
-- Description: Add tenant_id column to lab_samples and perform backfill

-- 1. Add tenant_id column as nullable initially
ALTER TABLE lab_samples ADD COLUMN IF NOT EXISTS tenant_id integer;

-- 2. Perform backfill update from referenced lab_radiology_orders table
UPDATE lab_samples ls
SET tenant_id = lro.tenant_id
FROM lab_radiology_orders lro
WHERE ls.order_id = lro.id;

-- 3. Set default or handle any orphan rows if needed (in staging it's 0 rows)
-- (No action needed since rows count is 0)

-- 4. Add NOT NULL constraint
ALTER TABLE lab_samples ALTER COLUMN tenant_id SET NOT NULL;

-- 5. Add foreign key constraint
ALTER TABLE lab_samples
    ADD CONSTRAINT fk_lab_samples_tenant 
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

-- 6. Create index for fast scoping
CREATE INDEX IF NOT EXISTS idx_lab_samples_tenant ON lab_samples(tenant_id);
