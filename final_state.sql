SELECT 'audit_rows' AS m, count(*)::text AS v FROM audit_trail
UNION ALL SELECT 'chain_hashes_set', count(*) FILTER (WHERE row_hash IS NOT NULL)::text FROM audit_trail
UNION ALL SELECT 'migrations_baseline', count(*)::text FROM schema_migrations
UNION ALL SELECT 'tables_total', count(*)::text FROM pg_tables WHERE schemaname='public'
UNION ALL SELECT 'tables_with_rls', count(*)::text FROM pg_tables WHERE schemaname='public' AND rowsecurity
UNION ALL SELECT 'rls_policies', count(*)::text FROM pg_policies WHERE schemaname='public'
UNION ALL SELECT 'pg_roles_app', count(*)::text FROM pg_roles WHERE rolname='nama_medical_app'
UNION ALL SELECT 'pg_roles_pcc', count(*)::text FROM pg_roles WHERE rolname='nama_pcc_app'
ORDER BY m;
