\set ON_ERROR_STOP off
\pset footer off

\echo === TABLE COUNTS ===
SELECT 'public_tables_total' AS metric, count(*) FROM pg_tables WHERE schemaname='public'
UNION ALL SELECT 'public_tables_rls_enabled', count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity = true
UNION ALL SELECT 'public_tables_with_policies', count(*) FROM pg_tables t JOIN pg_policies p ON p.schemaname='public' AND p.tablename = t.tablename WHERE t.schemaname='public';

\echo
\echo === TABLES WITH RLS BUT NO POLICY (top 20) ===
SELECT c.relname
FROM pg_class c
WHERE c.relkind='r' AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname='public')
  AND c.rowsecurity
  AND NOT EXISTS (SELECT 1 FROM pg_policies p WHERE p.schemaname='public' AND p.tablename=c.relname)
ORDER BY c.relname LIMIT 20;

\echo
\echo === AUDIT TRAIL HASH CHAIN COLUMNS ===
SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_trail' AND column_name IN ('prev_hash','row_hash','chain_idx');

\echo
\echo === AUDIT TRAIL ROW COUNT ===
SELECT count(*) FROM audit_trail;

\echo
\echo === RLS POLICY TOTAL ===
SELECT count(*) AS total FROM pg_policies WHERE schemaname='public';

\echo
\echo === ROLES ===
SELECT rolname, rolcanlogin FROM pg_roles WHERE rolname IN ('nama_medical_app', 'nama_pcc_app');

\echo
\echo === FUNCTIONS COUNT ===
SELECT count(*) AS func_total FROM pg_proc WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname='public');
