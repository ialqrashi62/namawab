SELECT
    c.relname AS table_name,
    c.relrowsecurity AS rls_enabled,
    c.relforcerowsecurity AS force_rls,
    CASE WHEN c.relrowsecurity THEN '✓' ELSE '✗' END AS rls_status,
    CASE WHEN c.relforcerowsecurity THEN '✓' ELSE '✗' END AS force_status
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname NOT LIKE 'pg_%'
ORDER BY c.relname;
