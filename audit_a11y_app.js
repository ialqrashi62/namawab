const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== total app.js size ==="
wc -l /var/www/namaweb/public/js/app.js
echo "=== a11y tokens in full app.js ==="
grep -cE "aria-label|aria-labelledby|aria-live|aria-hidden|role=" /var/www/namaweb/public/js/app.js
echo "=== bare buttons (render buttons without aria) ==="
grep -cE "createElement|innerHTML.*button|innerHTML.*<button" /var/www/namaweb/public/js/app.js
echo "=== sample 30 innerHTML button snippets ==="
grep -E "innerHTML.*button" /var/www/namaweb/public/js/app.js | head -10
echo "=== existing aria in app.js (first 30) ==="
grep -nE "aria-label|aria-live|role=" /var/www/namaweb/public/js/app.js | head -30'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
