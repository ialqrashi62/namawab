-- ===========================================================================
-- DDL Validation Script: Verify FORCE ROW LEVEL SECURITY status on 13 Tables
-- NamaMedical — Production Readiness Validation
-- ===========================================================================

SELECT c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN (
    'patients',
    'appointments',
    'invoices',
    'prescriptions',
    'lab_results',
    'lab_samples',
    'lab_radiology_orders',
    'emergency_visits',
    'emergency_beds',
    'insurance_claims',
    'pharmacy_sales',
    'pharmacy_sale_items',
    'pharmacy_prescriptions_queue'
  )
ORDER BY table_name;
