-- route_level_ddl_batch_a_rls_safe_candidate_validate.sql
-- Run AFTER the RLS-safe up.sql. Read-only. PASS = the 6 Batch A tables exist; the 5 PHI/tenant tables
-- are FORCE RLS with a tenant policy + tenant_id DEFAULT; all tables hold 0 rows; app role unchanged.

-- 1) Tables exist
SELECT 'tables_exist' AS check,
  to_regclass('public.obgyn_pregnancies') IS NOT NULL
  AND to_regclass('public.obgyn_deliveries') IS NOT NULL
  AND to_regclass('public.referrals') IS NOT NULL
  AND to_regclass('public.medical_reports') IS NOT NULL
  AND to_regclass('public.visit_lifecycle') IS NOT NULL
  AND to_regclass('public.cash_drawer') IS NOT NULL AS pass;

-- 2) The 5 PHI/tenant tables are ENABLE + FORCE RLS (expect 5 rows, both true)
SELECT relname, relrowsecurity, relforcerowsecurity
FROM pg_class
WHERE relname IN ('obgyn_pregnancies','obgyn_deliveries','referrals','medical_reports','visit_lifecycle')
ORDER BY relname;

-- 3) Each has exactly one tenant-isolation policy (expect 5 rows)
SELECT tablename, policyname, cmd
FROM pg_policies
WHERE tablename IN ('obgyn_pregnancies','obgyn_deliveries','referrals','medical_reports','visit_lifecycle')
ORDER BY tablename;

-- 4) tenant_id DEFAULT applied (expect the app.tenant_id expression on all 5)
SELECT table_name, column_default
FROM information_schema.columns
WHERE column_name='tenant_id'
  AND table_name IN ('obgyn_pregnancies','obgyn_deliveries','referrals','medical_reports','visit_lifecycle')
ORDER BY table_name;

-- 5) No data seeded (expect 0 for all)
SELECT 'obgyn_pregnancies' t, COUNT(*)::int n FROM obgyn_pregnancies
UNION ALL SELECT 'obgyn_deliveries', COUNT(*)::int FROM obgyn_deliveries
UNION ALL SELECT 'referrals', COUNT(*)::int FROM referrals
UNION ALL SELECT 'medical_reports', COUNT(*)::int FROM medical_reports
UNION ALL SELECT 'visit_lifecycle', COUNT(*)::int FROM visit_lifecycle
UNION ALL SELECT 'cash_drawer', COUNT(*)::int FROM cash_drawer;

-- 6) App role still non-superuser / non-bypassrls (no privilege escalation)
SELECT rolname, rolsuper, rolbypassrls FROM pg_roles WHERE rolname='nama_medical_app';
