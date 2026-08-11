\set ON_ERROR_STOP on
\pset footer off

\echo === TABLE COUNTS ===
SELECT 'public_tables_total' AS metric, count(*) FROM pg_tables WHERE schemaname='public'
UNION ALL SELECT 'public_tables_rls_enabled', count(*) FROM pg_tables WHERE schemaname='public' AND rowsecurity = true
UNION ALL SELECT 'public_tables_with_policies', count(*) FROM pg_tables t JOIN pg_policies p ON p.schemaname='public' AND p.tablename = t.tablename WHERE t.schemaname='public';

\echo
\echo === TABLES WITH RLS BUT NO POLICY ===
SELECT c.relname
FROM pg_class c
WHERE c.relkind='r' AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname='public')
  AND c.rowsecurity
  AND NOT EXISTS (SELECT 1 FROM pg_policies p WHERE p.schemaname='public' AND p.tablename=c.relname)
ORDER BY c.relname LIMIT 20;

\echo
\echo === AUDIT TRAIL HASH CHAIN COLUMNS ===

\echo
\echo === TABLES WITHOUT ANY POLICY (samples, top 10 by likely tenant_id col) ===
SELECT c.relname AS tablename
FROM pg_class c
WHERE c.relkind='r' AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname='public')
  AND NOT EXISTS (SELECT 1 FROM pg_policies p WHERE p.schemaname='public' AND p.tablename=c.relname)
ORDER BY c.relname LIMIT 10;

\echo
\echo === RLS POLICY COUNTS ===
SELECT count(*) AS total_policies FROM pg_policies WHERE schemaname = 'public';

\echo
\echo === AUDIT TRAIL TABLE STATE ===
SELECT
  (SELECT count(*) FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_trail' AND column_name IN ('prev_hash','row_hash','chain_idx')) AS chain_columns,
  (SELECT count(*) FROM audit_trail) AS row_count;

\echo
\echo === ROLE INFO ===
SELECT rolname, rolcanlogin, rolsuper FROM pg_roles WHERE rolname IN ('nama_medical_app', 'nama_pcc_app', 'postgres');
