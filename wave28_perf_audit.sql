-- Wave 28 Audit: Performance + Observability baseline
\pset footer off

\echo === TOP 20 SLOW QUERIES (pg_stat_statements) ===
SELECT substring(query for 120) AS query,
       calls,
       round(total_exec_time::numeric, 0) AS total_ms,
       round(mean_exec_time::numeric, 2) AS mean_ms,
       rows
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat%' AND query NOT LIKE '%SCHEMA%'
ORDER BY mean_exec_time DESC LIMIT 20;

\echo
\echo === MOST CALLED QUERIES (cache hot) ===
SELECT substring(query for 80) AS query, calls,
       round(total_exec_time::numeric, 0) AS total_ms,
       round(mean_exec_time::numeric, 2) AS mean_ms
FROM pg_stat_statements
WHERE query NOT LIKE '%pg_stat%'
ORDER BY calls DESC LIMIT 10;

\echo
\echo === HEAVIEST WRITE QUERIES (by rows modified) ===
SELECT substring(query for 80) AS query,
       calls,
       rows,
       round(total_exec_time::numeric, 0) AS total_ms
FROM pg_stat_statements
WHERE rows > 0 AND query NOT LIKE '%pg_stat%'
ORDER BY rows DESC LIMIT 10;

\echo
\echo === INDEX USAGE BY TABLE ===
SELECT relname AS tablename,
       seq_scan, seq_tup_read,
       idx_scan, idx_tup_fetch,
       round(100.0 * idx_scan / GREATEST(seq_scan + idx_scan, 1), 1) AS idx_scan_pct
FROM pg_stat_user_tables
WHERE schemaname='public'
ORDER BY seq_tup_read DESC LIMIT 15;

\echo
\echo === UNUSED INDEXES (candidates for removal) ===
SELECT s.schememaname, s.relname AS tablename, s.indexrelname AS indexname,
       s.idx_scan AS scans,
       pg_size_pretty(pg_relation_size(s.indexrelid)) AS size
FROM pg_stat_user_indexes s
WHERE s.schemaname='public' AND s.idx_scan = 0
ORDER BY pg_relation_size(s.indexrelid) DESC LIMIT 10;

\echo
\echo === TABLE BLOAT (top 10) ===
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
       n_live_tup, n_dead_tup,
       round(100.0 * n_dead_tup / GREATEST(n_live_tup + n_dead_tup, 1), 1) AS dead_pct
FROM pg_stat_user_tables
WHERE schemaname='public' AND n_live_tup > 100
ORDER BY n_dead_tup DESC LIMIT 10;

\echo
\echo === CONNECTION POOL STATS ===
SELECT datname, numbackends, xact_commit, xact_rollback, blks_read, blks_hit,
       round(100.0 * blks_hit / GREATEST(blks_hit + blks_read, 1), 1) AS cache_hit_pct
FROM pg_stat_database WHERE datname='nama_medical_web';

\echo
\echo === LONG RUNNING QUERIES (>5s active) ===
SELECT pid, now() - query_start AS duration, state, wait_event_type,
       substring(query for 120) AS query
FROM pg_stat_activity
WHERE state = 'active' AND now() - query_start > interval '5 seconds'
  AND datname='nama_medical_web';

\echo
\echo === TABLE COUNT SUMMARY ===
SELECT count(*) AS total_tables FROM pg_tables WHERE schemaname='public';
SELECT count(*) AS total_indexes FROM pg_indexes WHERE schemaname='public';
SELECT count(*) AS total_policies FROM pg_policies WHERE schemaname='public';
