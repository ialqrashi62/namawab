-- ============================================================================
-- SQL Script: nursing_assessments_tenant_isolation_validate.sql
-- Description: Validation queries to verify tenant isolation and RLS state on nursing_assessments
-- Environment: Staging Only
-- WARNING: SELECT ONLY. NO ALTER/UPDATE/DELETE/INSERT.
-- ============================================================================

-- 1. Check if columns tenant_id and facility_id exist and are structured correctly
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'nursing_assessments'
  AND column_name IN ('tenant_id', 'facility_id')
ORDER BY column_name;

-- 2. Verify no records have NULL tenant_id
SELECT COUNT(*) AS null_tenant_count
FROM nursing_assessments
WHERE tenant_id IS NULL;

-- 3. Verify RLS and FORCE RLS are enabled in pg_class
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class
WHERE relname = 'nursing_assessments';

-- 4. Verify RLS isolation policy exists and is defined correctly
SELECT policyname, tablename, cmd, permissive, roles, qual, with_check
FROM pg_policies
WHERE tablename = 'nursing_assessments'
  AND policyname = 'rls_nursing_assessments_tenant_isolation';

-- 5. Verify the required index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'nursing_assessments'
  AND indexname = 'idx_nursing_assessments_tenant_facility';
