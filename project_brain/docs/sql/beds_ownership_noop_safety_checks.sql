-- ============================================================================
-- SQL Script: beds_ownership_noop_safety_checks.sql
-- Description: NO-OP safety checks and mock verification of tenant bed assignments.
-- Purpose: Test and simulate tenant-bed integrity queries within a safe transaction.
-- Environment: Staging
-- ============================================================================

BEGIN;

-- 1. Simulate setting a tenant session context (Tenant 1)
SET LOCAL app.tenant_id = '1';

-- 2. Validate that all active admissions for Tenant 1 match the tenant_id of their assigned beds
-- This checks if there are any cross-tenant leaks in the admissions table referencing beds
SELECT 
    a.id AS admission_id,
    a.patient_id,
    a.tenant_id AS admission_tenant_id,
    b.id AS bed_id,
    b.tenant_id AS bed_tenant_id,
    (a.tenant_id = b.tenant_id) AS is_valid_tenant_match
FROM admissions a
JOIN beds b ON a.bed_id = b.id
WHERE a.status = 'Active';

-- 3. Verify that all wards for the active tenant match the beds associated with them
-- This ensures that wards and beds do not cross tenant borders
SELECT 
    w.id AS ward_id,
    w.ward_name,
    w.tenant_id AS ward_tenant,
    b.id AS bed_id,
    b.bed_number,
    b.tenant_id AS bed_tenant
FROM beds b
JOIN wards w ON b.ward_id = w.id
WHERE w.tenant_id = 1 AND w.tenant_id <> b.tenant_id;
-- Note: Expected output is 0 rows (no mismatch).

-- 4. Check if there are any active admissions where patient tenant_id does not match bed tenant_id
SELECT 
    a.id AS admission_id,
    p.id AS patient_id,
    p.tenant_id AS patient_tenant,
    b.id AS bed_id,
    b.tenant_id AS bed_tenant
FROM admissions a
JOIN patients p ON a.patient_id = p.id
JOIN beds b ON a.bed_id = b.id
WHERE p.tenant_id <> b.tenant_id;
-- Note: Expected output is 0 rows.

-- 5. Rollback the transaction to ensure no database state changes
ROLLBACK;
