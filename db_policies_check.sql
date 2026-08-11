SELECT tablename, rowsecurity
FROM pg_tables t
WHERE schemaname='public'
  AND tablename IN (SELECT DISTINCT tablename FROM pg_policies WHERE schemaname='public')
ORDER BY tablename
LIMIT 30;
