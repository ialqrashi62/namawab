const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== lib/olap/materializedViews.js head ==="
head -40 /var/www/namaweb/lib/olap/materializedViews.js
echo "=== lib/olap/queryRunner.js head ==="
head -40 /var/www/namaweb/lib/olap/queryRunner.js
echo "=== lib/olap/refresh.js head ==="
head -40 /var/www/namaweb/lib/olap/refresh.js
echo "=== routes/olap.js ==="
ls -la /var/www/namaweb/routes/olap* 2>&1
echo "=== olap mention in server.js ==="
grep -nE "olap|OLAP" /var/www/namaweb/server.js | head -10
echo "=== node require ==="
node -e "const m=require(\\\"./routes/olap\\\"); console.log(\\\"type:\\\", typeof m, \\\"| keys:\\\", Object.keys(m||{}).slice(0,10))"
'`]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 5000));
