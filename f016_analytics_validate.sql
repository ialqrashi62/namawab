-- f016_analytics_validate.sql — verify table exists, row count, and RLS policy presence
SELECT
  (SELECT count(*) FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'analytics_events') AS table_present,
  (SELECT count(*) FROM analytics_events) AS row_count,
  (SELECT count(*) FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'analytics_events' AND policyname = 'p_ae_tenant') AS policy_present,
  (SELECT relrowsecurity FROM pg_class
    WHERE relname = 'analytics_events') AS rls_enabled;
