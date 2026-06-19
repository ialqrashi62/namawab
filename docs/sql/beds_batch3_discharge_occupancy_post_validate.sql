-- ============================================================================
-- SQL Script: beds_batch3_discharge_occupancy_post_validate.sql
-- Description: Post-implementation read-only validation queries for Discharge & Occupancy
-- Environment: Staging
-- WARNING: SELECT ONLY. NO ALTER/UPDATE/DELETE.
-- ============================================================================

-- 1. Verify that no new tables were created in the public schema
SELECT tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('discharge', 'discharges', 'occupancy', 'census', 'bed_occupancy');

-- 2. Inspect RLS policy active status on core tables
SELECT tablename, rowsecurity, forcesecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('admissions', 'beds', 'patients', 'wards', 'bed_transfers');

-- 3. Confirm tenant_id index configuration on admissions and beds
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('admissions', 'beds');

-- 4. Count current total capacity, occupied beds, and available beds by tenant
SELECT tenant_id,
       COUNT(*) AS total_beds,
       SUM(CASE WHEN status = 'Occupied' THEN 1 ELSE 0 END) AS occupied_beds,
       SUM(CASE WHEN status = 'Available' THEN 1 ELSE 0 END) AS available_beds
FROM beds
GROUP BY tenant_id;

-- 5. Count admissions status by tenant to verify no nulls or leakage
SELECT tenant_id, status, COUNT(*) AS admission_count
FROM admissions
GROUP BY tenant_id, status;
