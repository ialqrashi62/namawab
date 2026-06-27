-- ============================================================================
-- SQL Script: rls_blocker_admissions_transfers_truth_validate.sql
-- Description: Read-only truth validation queries for Admissions & Transfers RLS Blocker
-- Environment: Staging
-- WARNING: SELECT ONLY. NO ALTER/UPDATE/DELETE.
-- ============================================================================

-- 1. Inspect RLS state in pg_tables
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('admissions', 'bed_transfers');

-- 2. Inspect exact RLS and FORCE properties in pg_class
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('admissions', 'bed_transfers');

-- 3. Retrieve policies configuration
SELECT policyname, tablename, cmd, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('admissions', 'bed_transfers');

-- 4. Check for presence of tenant_id column
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN ('admissions', 'bed_transfers')
  AND column_name = 'tenant_id';

-- 5. Check if index is created on admissions and bed_transfers
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('admissions', 'bed_transfers');

-- 6. Check for any NULL tenant_id values
SELECT 'admissions' AS table_name, COUNT(*) AS null_tenant_count FROM admissions WHERE tenant_id IS NULL
UNION ALL
SELECT 'bed_transfers' AS table_name, COUNT(*) AS null_tenant_count FROM bed_transfers WHERE tenant_id IS NULL;

-- 7. Check for admissions to patient tenant mismatch
SELECT COUNT(*) AS mismatch_count
FROM admissions a
JOIN patients p ON a.patient_id = p.id
WHERE a.tenant_id <> p.tenant_id;

-- 8. Check for admissions to bed tenant mismatch
SELECT COUNT(*) AS mismatch_count
FROM admissions a
JOIN beds b ON a.bed_id = b.id
WHERE a.tenant_id <> b.tenant_id;

-- 9. Check for bed_transfers to admissions tenant mismatch
SELECT COUNT(*) AS mismatch_count
FROM bed_transfers bt
JOIN admissions a ON bt.admission_id = a.id
WHERE bt.tenant_id <> a.tenant_id;
