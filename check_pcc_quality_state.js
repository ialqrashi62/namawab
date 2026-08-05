const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== PCC catalog count ==="
ls /var/www/namaweb/pcc-modules/ 2>/dev/null | wc -l
echo "=== PCC engines ==="
ls /var/www/namaweb/lib/pcc_engines/ 2>/dev/null | wc -l
echo "=== A11y status ==="
grep -l "aria-label|aria-labelledby|role=" /var/www/namaweb/public/js/*.js 2>/dev/null | wc -l
echo "=== i18n keys count ==="
node -e "const e=require(\"/var/www/namaweb/lib/i18n_en.json\");console.log(Object.keys(e).length);" 2>/dev/null
echo "=== CSP status ==="
grep -E "unsafe-inline|unsafe-eval" /var/www/namaweb/server.js 2>/dev/null | head -5
echo "=== rate-limit present? ==="
grep -c "rateLimit|express-rate-limit" /var/www/namaweb/server.js'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 3000));
