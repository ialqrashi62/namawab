// Find streaming panel render sites in /var/www/namaweb/public/js/app.js
// (lab results, vitals, exam findings)
const { spawnSync } = require('child_process');

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'bash -s -- /var/www/namaweb/public/js/app.js',
], {
  input: `
set -e
F="$1"
echo "=== getElementById(<word>Panel) ==="
grep -nE "getElementById\\('?[A-Za-z]+Panel" "$F" | head -15 || true
echo ""
echo "=== innerHTML .* [Rr]esult ==="
grep -nE "innerHTML.*[Rr]esult" "$F" | head -10 || true
echo ""
echo "=== innerHTML .* [Vv]ital ==="
grep -nE "innerHTML.*[Vv]ital" "$F" | head -10 || true
echo ""
echo "=== streaming panel IDs in public/js/*.js ==="
grep -nE "drResultsPanel|drE1Panel|vitalsPanel|labsPanel|examPanel" /var/www/namaweb/public/js/*.js | head -15 || true
echo ""
echo "=== querySelectorAll .* [Pp]anel ==="
grep -nE "querySelectorAll\\('?\\.[A-Za-z]+Panel" "$F" | head -10 || true
`
});

process.stdout.write((r.stdout || '').toString());
process.stderr.write((r.stderr || '').toString());
process.exit(r.status || 0);
