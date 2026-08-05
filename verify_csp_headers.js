const { spawnSync } = require('child_process');

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== response headers from /api/health ==="
curl -s -D - -o /dev/null -H "x-tenant-id: tnt-demo" -H "x-user-id: dr-test" -H "x-user-role: admin" http://127.0.0.1:3000/api/health | head -25
echo ""
echo "=== response headers from / (login) ==="
curl -s -D - -o /dev/null http://127.0.0.1:3000/ | head -15
echo ""
echo "=== check X-CSP-Nonce header ==="
curl -s -D - -o /dev/null -H "x-tenant-id: tnt-demo" http://127.0.0.1:3000/api/v4/olap/views | grep -iE "x-csp-nonce|content-security-policy"
echo ""
echo "=== pm2 status ==="
pm2 list 2>/dev/null | grep nama-medical-erp'`
]);

process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 3000));
if (r.status !== 0 && r.status !== null) {
  process.stderr.write(`\n[exit ${r.status}]\n`);
}
