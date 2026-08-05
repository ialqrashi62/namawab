const { spawnSync } = require('child_process');

// Exact count(*) for the 12 most-likely-populated tables among the 60.
// Using to_regclass so missing tables return NULL instead of erroring.
const sql = `
ANALYZE;
SELECT 'hr_employee_documents'  AS t, count(*) FROM hr_employee_documents
UNION ALL SELECT 'hr_employee_custody',  count(*) FROM hr_employee_custody
UNION ALL SELECT 'hr_attendance',        count(*) FROM hr_attendance
UNION ALL SELECT 'hr_credentialing',     count(*) FROM hr_credentialing
UNION ALL SELECT 'hr_leaves',            count(*) FROM hr_leaves
UNION ALL SELECT 'hr_advances',          count(*) FROM hr_advances
UNION ALL SELECT 'hr_nitaqat_records',   count(*) FROM hr_nitaqat_records
UNION ALL SELECT 'inventory',            count(*) FROM inventory
UNION ALL SELECT 'vendors',              count(*) FROM vendors
UNION ALL SELECT 'pharmacy_suppliers',   count(*) FROM pharmacy_suppliers
UNION ALL SELECT 'tenant_settings',      count(*) FROM tenant_settings
UNION ALL SELECT 'lab_loinc_codes',      count(*) FROM lab_loinc_codes
UNION ALL SELECT 'lab_microbiology',     count(*) FROM lab_microbiology
UNION ALL SELECT 'maintenance_equipment',count(*) FROM maintenance_equipment
UNION ALL SELECT 'incident_reports',     count(*) FROM incident_reports
UNION ALL SELECT 'quality_incidents',    count(*) FROM quality_incidents
UNION ALL SELECT 'quality_kpis',         count(*) FROM quality_kpis
UNION ALL SELECT 'medical_certificates', count(*) FROM medical_certificates
UNION ALL SELECT 'transport_requests',   count(*) FROM transport_requests
UNION ALL SELECT 'mortuary_cases',       count(*) FROM mortuary_cases
UNION ALL SELECT 'social_work_cases',    count(*) FROM social_work_cases
ORDER BY 2 DESC, 1;
`;

const psqlScript = `sudo -u postgres psql -d nama_medical_web -t <<'SQL' 2>&1 | grep -v "could not change directory"
${sql}
SQL
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -s`
], { input: psqlScript, encoding: 'utf8' });

console.log("=== EXACT count(*) for the 20 most-likely-populated unprotected tables ===");
console.log((r.stdout || r.stderr || '').toString().slice(0, 10000));
