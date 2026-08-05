const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== express-rate-limit installed? ==="
grep -E "rate-limit" /var/www/namaweb/package.json 2>/dev/null
echo "=== rate limit middleware present? ==="
grep -E "rateLimit|rate-limit" /var/www/namaweb/server.js 2>/dev/null | head -5
echo "=== a11y in HTML ==="
grep -cE "aria-label|role=" /var/www/namaweb/public/index.html 2>/dev/null
echo "=== a11y in app.js (first 500 lines) ==="
sed -n "1,500p" /var/www/namaweb/public/js/app.js 2>/dev/null | grep -cE "aria-label|role=|aria-live|aria-hidden"
echo "=== helmet? ==="
grep -c "helmet" /var/www/namaweb/server.js
echo "=== cors? ==="
grep -c "cors(" /var/www/namaweb/server.js
echo "=== engines folder ==="
ls /var/www/namaweb/engines/ 2>/dev/null | head -10
echo "=== pcc-modules ==="
find /var/www/namaweb -name "pcc-modules" -type d 2>/dev/null | head -5'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 4000));
