-- ============================================================================
-- SQL Script: beds_batch3_discharge_occupancy_readonly_validate.sql
-- Description: Read-only validation queries to inspect schemas and data alignment for discharge and occupancy
-- Environment: Staging
-- WARNING: SELECT ONLY. NO ALTER/UPDATE/DELETE.
-- ============================================================================

-- 1. Check for the existence of any separate discharge or occupancy tables in pg_tables
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('discharge', 'discharges', 'occupancy', 'census', 'bed_occupancy');

-- 2. Inspect the columns of admissions table related to discharge workflow
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'admissions'
  AND column_name IN ('status', 'discharge_date', 'discharge_type', 'discharge_summary', 'discharge_instructions', 'discharge_medications', 'followup_date', 'followup_doctor', 'tenant_id', 'facility_id');

-- 3. Inspect the columns of beds table related to occupancy workflow
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'beds'
  AND column_name IN ('status', 'current_patient_id', 'current_admission_id', 'tenant_id');

-- 4. Count total admissions grouped by status and tenant_id
SELECT tenant_id, status, COUNT(*) AS row_count
FROM admissions
GROUP BY tenant_id, status
ORDER BY tenant_id, status;

-- 5. Count total beds grouped by status and tenant_id
SELECT tenant_id, status, COUNT(*) AS row_count
FROM beds
GROUP BY tenant_id, status
ORDER BY tenant_id, status;

-- 6. Check for active admissions referencing beds belonging to a different tenant (tenant mismatch)
SELECT a.id AS admission_id, a.tenant_id AS admission_tenant, b.id AS bed_id, b.tenant_id AS bed_tenant
FROM admissions a
JOIN beds b ON a.bed_id = b.id
WHERE a.status = 'Active' AND a.tenant_id != b.tenant_id;

-- 7. Check for active admissions referencing patients belonging to a different tenant (tenant mismatch)
SELECT a.id AS admission_id, a.tenant_id AS admission_tenant, p.id AS patient_id, p.tenant_id AS patient_tenant
FROM admissions a
JOIN patients p ON a.patient_id = p.id
WHERE a.status = 'Active' AND a.tenant_id != p.tenant_id;

-- 8. Verify the existing RLS policies on admissions, bed_transfers, beds, and wards
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename IN ('admissions', 'bed_transfers', 'beds', 'wards', 'patients')
ORDER BY tablename, policyname;
