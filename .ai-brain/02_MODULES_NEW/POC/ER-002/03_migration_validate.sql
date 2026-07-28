<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
-- ER-002 Migration Validation
SELECT tablename, rowsecurity
FROM pg_tables t JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname='public' AND tablename LIKE 'trauma%'
ORDER BY tablename;
-- Expected: 14 tables with rls=TRUE