const { spawnSync } = require('child_process');

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== pm2 full status ==="
pm2 list 2>&1 | head -40
echo ""
echo "=== pm2 logs (last 80 lines) ==="
pm2 logs nama-medical-erp --lines 80 --nostream --raw 2>&1 | tail -100
echo ""
echo "=== process listening on :3000 ==="
ss -ltnp 2>/dev/null | grep -E ":3000|LISTEN" | head -20
echo ""
echo "=== last 40 lines of error log ==="
ls -la /var/www/namaweb/logs/ 2>/dev/null
tail -40 /var/www/namaweb/logs/error.log 2>/dev/null
echo ""
echo "=== node syntax check on server.js ==="
cd /var/www/namaweb && node --check server.js 2>&1 | head -20'`
]);

process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 6000));
if (r.status !== 0 && r.status !== null) {
  process.stderr.write(`\n[exit ${r.status}]\n`);
}
