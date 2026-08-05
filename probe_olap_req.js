const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'cd /var/www/namaweb && node -e "const m=require(\'./routes/olap\'); console.log(\'type:\', typeof m, \'| keys:\', Object.keys(m||{}).slice(0,10))"'
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 5000));
