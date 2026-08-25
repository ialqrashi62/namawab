-- f018_apm_validate.sql — verify table exists, row counts by kind, and RLS policy presence
SELECT
  (SELECT count(*) FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'apm_metrics') AS table_present,
  (SELECT count(*) FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'apm_metrics' AND policyname = 'p_apm_tenant') AS policy_present,
  (SELECT relrowsecurity FROM pg_class
    WHERE relname = 'apm_metrics') AS rls_enabled;
SELECT kind, count(*)::int AS c, round(avg(value_num)::numeric, 1) AS avg_v
FROM apm_metrics
GROUP BY kind
ORDER BY kind;
