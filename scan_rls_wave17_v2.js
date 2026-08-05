const { spawnSync } = require('child_process');

const CANDIDATES = [
  'encounters','orders','lab_orders','lab_results','prescriptions',
  'imaging_studies','radiology_reports','vitals','allergies','problems',
  'progress_notes','discharge_summaries','referrals','immunizations',
  'bed_transfers','admissions','nursing_notes','medication_administrations',
  'lab_results_panel','surgery_records','anesthesia_records'
];

const list = `'{${CANDIDATES.join(',')}}'`;

const SQL = `
\\echo === 1. RLS status for all 21 candidates (rls=f means NO RLS) ===
SELECT c.relname,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname='public' AND c.relkind='r'
  AND c.relname IN (${list})
ORDER BY c.relrowsecurity ASC, c.relforcerowsecurity ASC, c.relname;

\\echo === 2. Tables WITHOUT any RLS at all (the gap list) ===
SELECT c.relname
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname='public' AND c.relkind='r'
  AND c.relname IN (${list})
  AND c.relrowsecurity = false
ORDER BY c.relname;

\\echo === 3. Row counts via to_regclass (no error if missing) ===
SELECT t.tbl AS table_name,
       COALESCE(s.n_live_tup, -1) AS estimated_rows,
       (to_regclass('public.' || t.tbl) IS NOT NULL) AS exists
FROM unnest(ARRAY[${CANDIDATES.map(s => `'${s}'`).join(',')}]) AS t(tbl)
LEFT JOIN pg_stat_user_tables s
  ON s.schemaname='public' AND s.relname = t.tbl
ORDER BY (to_regclass('public.' || t.tbl) IS NULL) DESC, s.n_live_tup DESC NULLS LAST;

\\echo === 4. Does each table carry a tenant_id column? ===
SELECT c.relname AS table_name,
       (EXISTS (
         SELECT 1 FROM pg_attribute a
         WHERE a.attrelid = c.oid AND a.attname = 'tenant_id' AND NOT a.attisdropped
       )) AS has_tenant_id
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname='public' AND c.relkind='r'
  AND c.relname IN (${list})
ORDER BY c.relname;

\\echo === 5. Combined: candidates WITHOUT RLS but WITH tenant_id (the Wave 17 target list) ===
SELECT c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced,
       COALESCE(s.n_live_tup, 0) AS est_rows
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_stat_user_tables s
  ON s.schemaname='public' AND s.relname = c.relname
WHERE n.nspname='public' AND c.relkind='r'
  AND c.relname IN (${list})
  AND c.relrowsecurity = false
  AND EXISTS (
    SELECT 1 FROM pg_attribute a
    WHERE a.attrelid = c.oid AND a.attname = 'tenant_id' AND NOT a.attisdropped
  )
ORDER BY s.n_live_tup DESC NULLS LAST, c.relname;
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `sudo -u postgres psql -d nama_medical_web 2>&1 | grep -v "could not change directory"`
], { input: SQL });

process.stdout.write((r.stdout || r.stderr || '').toString());
