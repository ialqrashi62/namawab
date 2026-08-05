const { spawnSync } = require('child_process');

const SQL = `
\\echo === tenant-aware tables WITHOUT RLS (top 30 by likely-PHI value) ===
SELECT c.relname
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('encounters','orders','lab_orders','lab_results','prescriptions','imaging_studies','radiology_reports','vitals','allergies','problems','progress_notes','discharge_summaries','referrals','immunizations','bed_transfers','admissions','nursing_notes','medication_administrations','lab_results_panel','surgery_records','anesthesia_records')
ORDER BY c.relname;

\\echo === their RLS status ===
SELECT c.relname, c.relrowsecurity AS rls, c.relforcerowsecurity AS force
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN ('encounters','orders','lab_orders','lab_results','prescriptions','imaging_studies','radiology_reports','vitals','allergies','problems','progress_notes','discharge_summaries','referrals','immunizations','bed_transfers','admissions','nursing_notes','medication_administrations','lab_results_panel','surgery_records','anesthesia_records')
ORDER BY c.relname;

\\echo === count of rows in each (to know impact) ===
SELECT 'encounters' AS t, count(*) FROM encounters UNION ALL
SELECT 'orders', count(*) FROM orders UNION ALL
SELECT 'lab_orders', count(*) FROM lab_orders UNION ALL
SELECT 'lab_results', count(*) FROM lab_results UNION ALL
SELECT 'prescriptions', count(*) FROM prescriptions UNION ALL
SELECT 'imaging_studies', count(*) FROM imaging_studies UNION ALL
SELECT 'radiology_reports', count(*) FROM radiology_reports UNION ALL
SELECT 'vitals', count(*) FROM vitals UNION ALL
SELECT 'allergies', count(*) FROM allergies UNION ALL
SELECT 'problems', count(*) FROM problems;
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `sudo -u postgres psql -d nama_medical_web 2>&1 | grep -v "could not change directory"`
], { input: SQL });

const out = (r.stdout || r.stderr || '').toString();
process.stdout.write(out);
