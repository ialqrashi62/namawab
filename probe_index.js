const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== app.js script tag ==="
grep -nE "app.js|<script" /var/www/namaweb/public/index.html | head -20
echo "=== sr-only already in CSS? ==="
grep -c "sr-only" /var/www/namaweb/public/css/*.css 2>/dev/null
grep -c "sr-only" /var/www/namaweb/public/index.html 2>/dev/null
echo "=== style block ==="
grep -n "<style" /var/www/namaweb/public/index.html | head -5
echo "=== button count ==="
grep -c "<button" /var/www/namaweb/public/index.html
echo "=== h3 count ==="
grep -c "<h3" /var/www/namaweb/public/index.html
'`
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 3000));
