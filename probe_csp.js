const { spawnSync } = require('child_process');
const cmd = `bash -c '
echo "=== CSP middleware / helmet config ==="
grep -nE "helmet|contentSecurityPolicy|cspReportOnly|cspNonce|CSP_ENFORCE" /var/www/namaweb/server.js | head -30
echo ""
echo "=== inline script tags ==="
grep -nE "<script" /var/www/namaweb/public/index.html | head -10
echo ""
echo "=== current CSP policy (raw block) ==="
grep -n -A 18 "contentSecurityPolicy" /var/www/namaweb/server.js | head -60
echo ""
echo "=== CSP_ENFORCE usage ==="
grep -n "CSP_ENFORCE" /var/www/namaweb/server.js
echo ""
echo "=== nonce usage ==="
grep -nE "nonce" /var/www/namaweb/server.js | head -10
echo ""
echo "=== reportOnly usage ==="
grep -nE "reportOnly|report-only" /var/www/namaweb/server.js | head -10
'`;
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  cmd
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 6000));
