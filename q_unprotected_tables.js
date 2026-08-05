const { spawnSync } = require('child_process');

// We pass the full SQL via stdin using ssh + heredoc to avoid shell-quoting hell.
const psqlScript = `
echo "=== full list of 60 unprotected tables ===";
sudo -u postgres psql -d nama_medical_web -t -c "SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace JOIN information_schema.columns col ON col.table_name = c.relname AND col.table_schema = 'public' WHERE n.nspname = 'public' AND c.relkind = 'r' AND COALESCE(c.relrowsecurity, false) = false AND col.column_name = 'tenant_id' ORDER BY c.relname;" 2>&1 | grep -v "could not change directory";
echo "";
echo "=== row counts for unprotected (with tenant_id) ===";
sudo -u postgres psql -d nama_medical_web -t <<'SQL' 2>&1 | grep -v "could not change directory"
SELECT 'cardiology_cath_reports' AS t, count(*) AS n FROM cardiology_cath_reports
UNION ALL SELECT 'clinical_incidents', count(*) FROM clinical_incidents
UNION ALL SELECT 'cosmetic_cases', count(*) FROM cosmetic_cases
UNION ALL SELECT 'cosmetic_consents', count(*) FROM cosmetic_consents
UNION ALL SELECT 'cosmetic_followups', count(*) FROM cosmetic_followups
UNION ALL SELECT 'cosmetic_photos', count(*) FROM cosmetic_photos
UNION ALL SELECT 'dental_images', count(*) FROM dental_images
UNION ALL SELECT 'dental_periodontal_exams', count(*) FROM dental_periodontal_exams
UNION ALL SELECT 'doctor_inventory_request_items', count(*) FROM doctor_inventory_request_items
UNION ALL SELECT 'doctor_inventory_requests', count(*) FROM doctor_inventory_requests
UNION ALL SELECT 'emar_administrations', count(*) FROM emar_administrations
UNION ALL SELECT 'emar_orders', count(*) FROM emar_orders;
SQL
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -s`
], { input: psqlScript, encoding: 'utf8' });

console.log((r.stdout || r.stderr || '').toString().slice(0, 10000));
