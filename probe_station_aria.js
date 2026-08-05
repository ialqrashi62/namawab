const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -lc 'ls /var/www/namaweb/public/js/*station.js 2>/dev/null | wc -l; echo ---list---; ls /var/www/namaweb/public/js/*station.js 2>/dev/null; echo ---a11y tokens total across stations---; cat /var/www/namaweb/public/js/*station.js 2>/dev/null | grep -cE "aria-label|aria-modal|aria-live|role="; echo ---per-file aria tokens---; for f in /var/www/namaweb/public/js/*station.js; do n=$(grep -cE "aria-label|aria-modal|aria-live|role=" "$f" 2>/dev/null); echo "$n $(basename "$f")"; done | sort -nr | head -10'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 5000));
