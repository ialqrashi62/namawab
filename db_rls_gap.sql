\pset footer off

\echo === TABLES WITHOUT RLS ===
SELECT c.relname AS tablename
FROM pg_class c
WHERE c.relkind='r' AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname='public')
  AND NOT c.relrowsecurity
  AND c.relname NOT LIKE 'pg_%'
ORDER BY c.relname;

\echo
\echo === TABLES WITHOUT RLS + has tenant_id column ===
SELECT c.relname AS tablename, count(a.attname) AS n_cols
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
JOIN pg_attribute a ON a.attrelid = c.oid
WHERE c.relkind='r' AND n.nspname='public'
  AND NOT c.relrowsecurity
  AND a.attname='tenant_id'
GROUP BY c.relname
ORDER BY c.relname;
