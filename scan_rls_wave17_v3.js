const { spawnSync } = require('child_process');

const SQL = `
\\echo === A. ALL public tables with tenant_id column, sorted by RLS state ===
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_on,
  c.relforcerowsecurity AS rls_forced,
  COALESCE(s.n_live_tup, 0) AS est_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s
  ON s.schemaname='public' AND s.relname = c.relname
WHERE n.nspname='public' AND c.relkind='r'
  AND EXISTS (
    SELECT 1 FROM pg_attribute a
    WHERE a.attrelid = c.oid AND a.attname='tenant_id' AND NOT a.attisdropped
  )
ORDER BY c.relforcerowsecurity ASC, c.relrowsecurity ASC, s.n_live_tup DESC NULLS LAST, c.relname;

\\echo === B. Counters: total / RLS-on / RLS-forced / no-RLS ===
SELECT
  COUNT(*) AS total_with_tenant_id,
  COUNT(*) FILTER (WHERE c.relrowsecurity) AS rls_enabled,
  COUNT(*) FILTER (WHERE c.relforcerowsecurity) AS rls_forced,
  COUNT(*) FILTER (WHERE NOT c.relrowsecurity) AS no_rls_at_all
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname='public' AND c.relkind='r'
  AND EXISTS (
    SELECT 1 FROM pg_attribute a
    WHERE a.attrelid = c.oid AND a.attname='tenant_id' AND NOT a.attisdropped
  );

\\echo === C. GAPS — tenant_id present, RLS NOT forced (the Wave 17 work list) ===
SELECT
  c.relname AS table_name,
  c.relrowsecurity AS rls_on,
  c.relforcerowsecurity AS rls_forced,
  COALESCE(s.n_live_tup, 0) AS est_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s
  ON s.schemaname='public' AND s.relname = c.relname
WHERE n.nspname='public' AND c.relkind='r'
  AND EXISTS (
    SELECT 1 FROM pg_attribute a
    WHERE a.attrelid = c.oid AND a.attname='tenant_id' AND NOT a.attisdropped
  )
  AND c.relforcerowsecurity = false
ORDER BY c.relrowsecurity ASC, s.n_live_tup DESC NULLS LAST, c.relname;

\\echo === D. Tables with tenant_id but ZERO RLS even enabled (highest risk) ===
SELECT
  c.relname AS table_name,
  COALESCE(s.n_live_tup, 0) AS est_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s
  ON s.schemaname='public' AND s.relname = c.relname
WHERE n.nspname='public' AND c.relkind='r'
  AND EXISTS (
    SELECT 1 FROM pg_attribute a
    WHERE a.attrelid = c.oid AND a.attname='tenant_id' AND NOT a.attisdropped
  )
  AND c.relrowsecurity = false
ORDER BY s.n_live_tup DESC NULLS LAST, c.relname;
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `sudo -u postgres psql -d nama_medical_web 2>&1 | grep -v "could not change directory"`
], { input: SQL });

process.stdout.write((r.stdout || r.stderr || '').toString());
