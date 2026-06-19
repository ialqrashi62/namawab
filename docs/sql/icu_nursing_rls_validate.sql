-- ============================================================================
-- SQL Script: icu_nursing_rls_validate.sql
-- Description: Validation queries for post-RLS enablement on ICU & Nursing tables
-- Environment: Staging Only
-- WARNING: SELECT ONLY. NO ALTER/UPDATE/DELETE.
-- ============================================================================

-- 1. Inspect RLS state for ICU and Nursing tables in pg_class
-- Expected: relrowsecurity = true (t) and relforcerowsecurity = true (t)
SELECT c.relname, c.relrowsecurity, c.relforcerowsecurity
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'icu_monitoring', 'icu_ventilator', 'icu_scores', 'icu_fluid_balance',
    'nursing_vitals', 'nursing_care_plans', 'nursing_assessments',
    'emar_orders', 'emar_administrations'
  )
ORDER BY c.relname;

-- 2. Inspect active policies on these tables
SELECT policyname, tablename, cmd, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'icu_monitoring', 'icu_ventilator', 'icu_scores', 'icu_fluid_balance',
    'nursing_vitals', 'nursing_care_plans', 'nursing_assessments',
    'emar_orders', 'emar_administrations'
  )
ORDER BY tablename;

-- 3. Verify created indexes exist
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname IN (
    'idx_nursing_care_plans_tenant_facility',
    'idx_icu_monitoring_tenant_facility',
    'idx_icu_ventilator_tenant_facility',
    'idx_icu_scores_tenant_facility',
    'idx_icu_fluid_balance_tenant_facility',
    'idx_emar_orders_tenant_facility',
    'idx_emar_administrations_tenant_facility'
  )
ORDER BY tablename;
