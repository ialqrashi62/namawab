// filepath: c:\Users\ice\Desktop\NMEDCALVSCODE\verify_a11y.js
const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -lc '
total=0
for f in /var/www/namaweb/public/js/*-station.js; do
  n=$(grep -cE "aria-label" "$f" 2>/dev/null)
  total=$((total + n))
done
echo "aria-label total across 30 stations: $total"
echo ""
echo "--- per-file counts ---"
for f in /var/www/namaweb/public/js/*-station.js; do
  n=$(grep -cE "aria-label" "$f" 2>/dev/null)
  echo "$n $(basename $f)"
done | sort -nr
echo ""
echo "=== pm2 status ==="
pm2 list 2>/dev/null | head -10
echo ""
echo "=== HTTP check ==="
for s in doctor nursing icu er cardiology obgyn-peds; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000/js/$s-station.js")
  echo "$s-station.js => $code"
done'`
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 4000));
process.stderr.write((r.stderr || '').toString().slice(0, 4000));
