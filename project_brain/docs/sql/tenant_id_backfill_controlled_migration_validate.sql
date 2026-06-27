-- Validation queries for tenant_id backfill on lab_samples
-- ============================================================================

-- 1. Count total rows in lab_samples
SELECT 'Total lab_samples rows' as label, COUNT(*) FROM lab_samples;

-- 2. Count rows where tenant_id is NULL (should be 0)
SELECT 'lab_samples with NULL tenant_id' as label, COUNT(*) FROM lab_samples WHERE tenant_id IS NULL;

-- 3. Group by tenant_id to see data distribution
SELECT tenant_id, COUNT(*) FROM lab_samples GROUP BY tenant_id;

-- 4. Verify constraint exists in catalogs
SELECT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'fk_lab_samples_tenant' AND table_name = 'lab_samples'
) as constraint_verified;
