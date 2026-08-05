const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== drResultsPanel sites ==="
grep -nE "drResultsPanel" /var/www/namaweb/public/js/doctor-station.js | head -10
echo ""
echo "=== drE1Panel sites ==="
grep -nE "drE1Panel" /var/www/namaweb/public/js/doctor-station.js | head -10
echo ""
echo "=== drVitalsPanel sites (if any) ==="
grep -nE "drVitalsPanel|vitalsPanel" /var/www/namaweb/public/js/doctor-station.js | head -10'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 4000));
