const { spawnSync } = require('child_process');

// Check as BOTH the app role (which would be RLS-filtered) and postgres
// to confirm the 0s aren't an artifact of the superuser.
const sql = `
SELECT grantee, table_name, string_agg(privilege_type, ',' ORDER BY privilege_type) AS privs
FROM information_schema.role_table_grants
WHERE table_schema='public'
  AND table_name IN (
    'hr_employee_documents','inventory','vendors','tenant_settings',
    'lab_loinc_codes','maintenance_equipment','quality_kpis'
  )
GROUP BY grantee, table_name
ORDER BY table_name, grantee;
`;

const psqlScript = `echo "=== per-table grants ==="; sudo -u postgres psql -d nama_medical_web -t <<'SQL' 2>&1 | grep -v "could not change directory"
${sql}
SQL
echo "";
echo "=== exact count via APP role (RLS would apply, app_tenant role is non-super) ===";
sudo -u postgres psql -d nama_medical_web -t <<'SQL' 2>&1 | grep -v "could not change directory"
SET ROLE nama_medical_app;
SELECT count(*) AS hr_emp_docs FROM hr_employee_documents;
SELECT count(*) AS inventory FROM inventory;
SELECT count(*) AS vendors FROM vendors;
SELECT count(*) AS tenant_settings FROM tenant_settings;
SELECT count(*) AS lab_loinc FROM lab_loinc_codes;
SELECT count(*) AS maint_equip FROM maintenance_equipment;
RESET ROLE;
SQL
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -s`
], { input: psqlScript, encoding: 'utf8' });

console.log((r.stdout || r.stderr || '').toString().slice(0, 10000));
