const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== audit_middleware.js ==="
ls -la /var/www/namaweb/audit_middleware.js 2>/dev/null
test -f /var/www/namaweb/audit_middleware.js && wc -l /var/www/namaweb/audit_middleware.js
echo "=== logAudit usages ==="
grep -rn "logAudit" /var/www/namaweb/lib/ /var/www/namaweb/routes/ 2>/dev/null | grep -v "node_modules" | head -20
echo "=== audit_trail table ==="
grep -rn "CREATE TABLE.*audit" /var/www/namaweb/migrations/ 2>/dev/null | head -10
echo "=== tenant_id in audit_middleware ==="
grep -n "tenant_id" /var/www/namaweb/audit_middleware.js 2>/dev/null | head -20'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
