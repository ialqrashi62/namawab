const { spawnSync } = require('child_process');
const remoteCmd = `bash -c '
echo "=== dev-ctx head ==="
head -30 /var/www/namaweb/lib/dev-ctx.js
echo "=== route-factory tenantScoped handler ==="
grep -nA 30 "tenantScopeMiddleware\\|tenantScoped.*true" /var/www/namaweb/lib/route-factory.js | head -50
echo "=== current deployed discharge.js dev-ctx line ==="
grep -n "dev-ctx" /var/www/namaweb/routes/discharge.js | head -5
'`;
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  remoteCmd
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 6000));
if (r.status !== 0) process.stderr.write(`\n[exit ${r.status}]\n`);
