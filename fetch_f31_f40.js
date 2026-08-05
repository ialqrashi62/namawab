const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c '
echo "=== ALL F-IDs across PLAN + FINAL ==="
grep -oE "F-[0-9]+" /var/www/namaweb/PLAN_VGLOBAL_UPGRADE_AR.md /var/www/namaweb/PHASE_VGLOBAL_FINAL_CLOSEOUT_AR.md 2>/dev/null | awk -F: "{print $2}" | sort -u
echo "=== F-31..F-40 raw from PLAN_VGLOBAL_UPGRADE_AR.md ==="
grep -nE "F-3[1-9]|F-40" /var/www/namaweb/PLAN_VGLOBAL_UPGRADE_AR.md 2>/dev/null | head -60
echo "=== F-31..F-40 raw from PHASE_VGLOBAL_FINAL_CLOSEOUT_AR.md ==="
grep -nE "F-3[1-9]|F-40" /var/www/namaweb/PHASE_VGLOBAL_FINAL_CLOSEOUT_AR.md 2>/dev/null | head -60'`
]);
process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 9000));
