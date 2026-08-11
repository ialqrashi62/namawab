SELECT
    COUNT(*) AS total,
    COUNT(*) FILTER (WHERE c.relrowsecurity) AS rls_on,
    COUNT(*) FILTER (WHERE c.relforcerowsecurity) AS force_rls_on
FROM pg_class c
JOIN pg_namespace n ON c.relnamespace = n.oid
WHERE n.nspname = 'public' AND c.relkind = 'r';
