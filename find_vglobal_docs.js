const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== docs dir listing ==="
ls -la /var/www/namaweb/docs/ 2>&1 | head -200
echo "=== files mentioning VGlobal / V-GLOBAL / vglobal / VGLOBAL ==="
find /var/www/namaweb -maxdepth 4 -type f -iname "*vglobal*" 2>/dev/null
echo "=== files mentioning F-3x in docs/ ==="
grep -rEl "F-3[0-9]|F-4[0-9]" /var/www/namaweb/docs/ 2>/dev/null | head -20'`
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 10000));
