// probe_logaudit.js — read server.js logAudit + second INSERT + tenant lib files
const { spawnSync } = require('child_process');

const SSH = 'C:\\Users\\ice\\.ssh\\nama_medical_key';
const HOST = 'root@204.168.144.74';
const REMOTE = `bash -c '
echo "=== logAudit definition (420-450) ==="
sed -n "420,450p" /var/www/namaweb/server.js
echo ""
echo "=== second INSERT (3020-3050) ==="
sed -n "3020,3050p" /var/www/namaweb/server.js
echo ""
echo "=== tenant_context.js ==="
if [ -f /var/www/namaweb/lib/tenant_context.js ]; then
  head -50 /var/www/namaweb/lib/tenant_context.js
else
  echo "not found"
  echo "--- search ---"
  find /var/www/namaweb -maxdepth 4 -name "tenant_context*" 2>/dev/null
fi
echo ""
echo "=== tenant_resolve.js ==="
if [ -f /var/www/namaweb/lib/tenant_resolve.js ]; then
  head -30 /var/www/namaweb/lib/tenant_resolve.js
else
  echo "not found"
  echo "--- search ---"
  find /var/www/namaweb -maxdepth 4 -name "tenant_resolve*" 2>/dev/null
fi
'`;

const r = spawnSync('ssh', [
  '-i', SSH,
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  HOST, REMOTE
]);

const out = (r.stdout || r.stderr || '').toString();
console.log(out.slice(0, 6000));
console.log('--- exit:', r.status, '---');
