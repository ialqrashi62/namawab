const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== logging libs in package.json ==="
grep -E "morgan|pino|winston|bunyan|debug|log4js|npmlog" /var/www/namaweb/package.json
echo ""
echo "=== app.use for logging ==="
grep -nE "app\\.use.*logger|morgan|pino\\.http|requestLogger" /var/www/namaweb/server.js | head -10
echo ""
echo "=== structured logging middleware (count) ==="
grep -cE "console\\.log|console\\.error" /var/www/namaweb/server.js
echo ""
echo "=== recent log lines (last 30) ==="
ls -la /var/log/namaweb/ 2>/dev/null
ls -la /var/www/namaweb/logs/ 2>/dev/null
pm2 logs --lines 30 --nostream 2>/dev/null | tail -40'`
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 5000));
