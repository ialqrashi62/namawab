const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
for t in pharmacy_drug_catalog tenant_plan_assignments company_settings dental_records user_tenants; do
  echo "=== $t ==="
  sudo -u postgres psql -d nama_medical_web -t -c "
    SELECT
      (SELECT count(*) FROM $t) AS total,
      (SELECT count(*) FROM $t WHERE tenant_id IS NULL) AS null_tenant,
      (SELECT count(DISTINCT tenant_id) FROM $t) AS distinct_tenants,
      (SELECT min(tenant_id) FROM $t) AS min_t,
      (SELECT max(tenant_id) FROM $t) AS max_t
  ;" 2>&1 | grep -v "could not change directory"
done'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 4000));
