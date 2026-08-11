\pset footer off
SELECT tablename,
       CASE
         WHEN EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=pg_tables.tablename AND column_name='tenant_id') THEN 'has_tenant_id'
         ELSE 'global_reference'
       END AS rls_decision
FROM pg_tables
WHERE schemaname='public'
  AND NOT rowsecurity
ORDER BY tablename;
