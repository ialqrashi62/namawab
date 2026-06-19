-- ============================================================================
-- SQL Script: beds_batch1_wards_beds_noop_safety_checks.sql
-- Description: NO-OP safety checks to verify referential integrity and tenant scopes
-- Environment: Staging
-- ============================================================================

BEGIN;

-- 1. Verify that all beds map to wards belonging to the same tenant
SELECT 
    b.id AS bed_id,
    b.bed_number,
    b.tenant_id AS bed_tenant,
    w.id AS ward_id,
    w.ward_name,
    w.tenant_id AS ward_tenant
FROM beds b
JOIN wards w ON b.ward_id = w.id
WHERE b.tenant_id <> w.tenant_id;
-- Note: Expected output is 0 rows (no mismatch).

-- 2. Detect any orphan beds or beds without valid ward mappings
SELECT id, bed_number, ward_id FROM beds WHERE ward_id IS NULL OR ward_id NOT IN (SELECT id FROM wards);
-- Note: Expected output is 0 rows.

-- 3. Detect any wards/beds without a tenant_id
SELECT 'wards_orphans' as type, COUNT(*) FROM wards WHERE tenant_id IS NULL
UNION ALL
SELECT 'beds_orphans' as type, COUNT(*) FROM beds WHERE tenant_id IS NULL;
-- Note: Expected output is 0 rows.

ROLLBACK;
