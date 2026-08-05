const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `cd /var/www/namaweb && bash -c '
echo "=== tenant_resolve.js ==="
head -80 ./lib/tenant_resolve.js 2>/dev/null || echo "NOT FOUND"
echo "=== route-guards requireTenant ==="
grep -nA 15 "function requireTenant\\b" ./lib/route-guards.js 2>/dev/null | head -30
echo "=== How does pgx/bi accept headers? ==="
grep -nA 5 "_ctx\\|x-tenant-id" ./routes/bi.js | head -15'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
