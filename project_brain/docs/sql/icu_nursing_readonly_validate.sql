-- ============================================================================
-- SQL Script: icu_nursing_readonly_validate.sql
-- Description: Read-only schema and integrity validation queries for ICU & Nursing
-- Environment: Staging
-- WARNING: SELECT ONLY. NO ALTER/UPDATE/DELETE.
-- ============================================================================

-- 1. Inspect RLS state for ICU and Nursing tables in pg_class
SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'icu_monitoring', 'icu_ventilator', 'icu_scores', 'icu_fluid_balance',
    'nursing_vitals', 'nursing_care_plans', 'nursing_assessments',
    'emar_orders', 'emar_administrations'
  );

-- 2. Inspect active policies on these tables
SELECT policyname, tablename, cmd, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'icu_monitoring', 'icu_ventilator', 'icu_scores', 'icu_fluid_balance',
    'nursing_vitals', 'nursing_care_plans', 'nursing_assessments',
    'emar_orders', 'emar_administrations'
  );

-- 3. Check for existence of columns tenant_id, facility_id, patient_id, admission_id
SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'icu_monitoring', 'icu_ventilator', 'icu_scores', 'icu_fluid_balance',
    'nursing_vitals', 'nursing_care_plans', 'nursing_assessments',
    'emar_orders', 'emar_administrations'
  )
  AND column_name IN ('tenant_id', 'facility_id', 'patient_id', 'admission_id')
ORDER BY table_name, column_name;

-- 4. Check for existing indexes on these tables
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'icu_monitoring', 'icu_ventilator', 'icu_scores', 'icu_fluid_balance',
    'nursing_vitals', 'nursing_care_plans', 'nursing_assessments',
    'emar_orders', 'emar_administrations'
  );

-- 5. Count total records and records with NULL tenant_id (except nursing_assessments which doesn't have it yet)
SELECT 'icu_monitoring' AS table_name, COUNT(*) AS total_count, COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) AS null_tenant_count FROM icu_monitoring
UNION ALL
SELECT 'icu_ventilator', COUNT(*), COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) FROM icu_ventilator
UNION ALL
SELECT 'icu_scores', COUNT(*), COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) FROM icu_scores
UNION ALL
SELECT 'icu_fluid_balance', COUNT(*), COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) FROM icu_fluid_balance
UNION ALL
SELECT 'nursing_vitals', COUNT(*), COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) FROM nursing_vitals
UNION ALL
SELECT 'nursing_care_plans', COUNT(*), COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) FROM nursing_care_plans
UNION ALL
SELECT 'emar_orders', COUNT(*), COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) FROM emar_orders
UNION ALL
SELECT 'emar_administrations', COUNT(*), COUNT(CASE WHEN tenant_id IS NULL THEN 1 END) FROM emar_administrations;

-- 6. Check for mismatches between clinical record tenant_id and patient/admission tenant_id
-- (No-op check: since staging currently has 0 rows, these should return 0)
SELECT 'icu_monitoring to patient mismatch' AS check_name, COUNT(*) AS mismatch_count
FROM icu_monitoring m
JOIN patients p ON m.patient_id = p.id
WHERE m.tenant_id <> p.tenant_id
UNION ALL
SELECT 'icu_monitoring to admission mismatch', COUNT(*)
FROM icu_monitoring m
JOIN admissions a ON m.admission_id = a.id
WHERE m.tenant_id <> a.tenant_id
UNION ALL
SELECT 'nursing_vitals to patient mismatch', COUNT(*)
FROM nursing_vitals v
JOIN patients p ON v.patient_id = p.id
WHERE v.tenant_id <> p.tenant_id
UNION ALL
SELECT 'nursing_care_plans to patient mismatch', COUNT(*)
FROM nursing_care_plans cp
JOIN patients p ON cp.patient_id = p.id
WHERE cp.tenant_id <> p.tenant_id;
