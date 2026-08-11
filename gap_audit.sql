-- Comprehensive Gap Audit — 2026-08-05

\echo === TIER 1: DB SCHEMA ===
SELECT 'tables_total' AS m, count(*) FROM pg_tables WHERE schemaname='public'
UNION ALL
SELECT 'tables_rls', count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity
UNION ALL
SELECT 'tables_with_policy', count(*) FROM pg_tables t
  JOIN pg_policies p ON p.schemaname='public' AND p.tablename=t.tablename
  WHERE t.schemaname='public';

\echo
\echo === TIER 2: TENANT-ISOLATED TABLES WITHOUT RLS (REAL GAP) ===
SELECT c.relname
FROM pg_class c
JOIN pg_attribute a ON a.attrelid=c.oid
WHERE c.relkind='r' AND c.relnamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')
  AND NOT c.relrowsecurity AND a.attname='tenant_id'
ORDER BY c.relname;

\echo
\echo === TIER 3: MIGRATION TRACKING ===
SELECT 'has_schema_migrations' AS m,
  EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='schema_migrations')::int;

\echo
\echo === TIER 4: ROLES ===
SELECT 'role_app' AS m, EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_medical_app' AND rolcanlogin)::int
UNION ALL
SELECT 'role_pcc', EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_pcc_app' AND rolcanlogin)::int
UNION ALL
SELECT 'role_audit_app', EXISTS (SELECT 1 FROM pg_roles WHERE rolname='nama_audit_app' AND rolcanlogin)::int;

\echo
\echo === TIER 5: AUDIT TRAIL CHAIN ===
SELECT column_name FROM information_schema.columns
WHERE table_schema='public' AND table_name='audit_trail'
  AND column_name IN ('prev_hash','row_hash','chain_idx');

SELECT count(*) AS audit_rows FROM audit_trail;

\echo
\echo === TIER 6: PHI/ENCRYPTION CHECK ===
SELECT 'phi_envelope_used' AS m,
  EXISTS (SELECT 1 FROM information_schema.routines
    WHERE routine_schema='public' AND routine_name ILIKE '%crypto_envelope%')::int;

\echo
\echo === TIER 7: CSP HEADERS / SECURITY POSTURE ===
SELECT 'csp_in_use' AS m,
  EXISTS (SELECT 1 FROM information_schema.routines
    WHERE routine_schema='public' AND routine_name ILIKE '%csp_nonce%')::int;

\echo
\echo === TIER 8: FHIR/NPHIES ADAPTER ===
SELECT 'fhir_routes' AS m,
  count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'fhir%';

SELECT 'hl7_routes' AS m,
  count(*) FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'hl7%';

\echo
\echo === TIER 9: AI/EMBEDDINGS ===
SELECT table_name FROM information_schema.tables
WHERE table_schema='public' AND (table_name LIKE '%vector%' OR table_name LIKE '%embed%' OR table_name LIKE '%rag%')
ORDER BY table_name;

\echo
\echo === TIER 10: BILLING/INSURANCE ===
SELECT tablename FROM pg_tables WHERE schemaname='public'
  AND (tablename LIKE '%billing%' OR tablename LIKE '%insurance%' OR tablename LIKE '%claim%')
ORDER BY tablename;

\echo
\echo === SUMMARY (capacity/utilization) ===
SELECT
  (SELECT count(*) FROM pg_tables WHERE schemaname='public') AS tables,
  (SELECT count(*) FROM information_schema.columns WHERE table_schema='public') AS columns,
  (SELECT count(*) FROM pg_indexes WHERE schemaname='public') AS indexes,
  (SELECT count(*) FROM pg_policies WHERE schemaname='public') AS policies,
  (SELECT count(*) FROM pg_proc WHERE pronamespace=(SELECT oid FROM pg_namespace WHERE nspname='public')) AS funcs;
