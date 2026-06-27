-- ============================================================================
-- SQL Script: nursing_assessments_readonly_validate.sql
-- Description: Read-only schema and integrity validation queries for nursing_assessments
-- Environment: Staging
-- WARNING: SELECT ONLY. NO ALTER/UPDATE/DELETE/INSERT.
-- ============================================================================

-- 1. Verify table existence and check columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'nursing_assessments'
ORDER BY ordinal_position;

-- 2. Check RLS and FORCE RLS status for nursing_assessments in pg_class
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class
WHERE relname = 'nursing_assessments';

-- 3. Check for any active policies on nursing_assessments
SELECT policyname, tablename, cmd, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'nursing_assessments';

-- 4. Check existing indexes on the table
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'nursing_assessments';

-- 5. Count total records and check for null patient_id (orphan checks)
SELECT 
  COUNT(*) AS total_assessments,
  COUNT(CASE WHEN patient_id IS NULL THEN 1 END) AS null_patient_count
FROM nursing_assessments;

-- 6. Check if we can derive tenant_id via JOIN with patients table
-- Since there are currently 0 records in nursing_assessments, this is a structure safety validation.
SELECT 
  a.id AS assessment_id, 
  a.patient_id, 
  p.tenant_id AS derived_tenant_id, 
  p.facility_id AS derived_facility_id
FROM nursing_assessments a
LEFT JOIN patients p ON a.patient_id = p.id
LIMIT 10;
