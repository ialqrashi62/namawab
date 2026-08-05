const { spawnSync } = require('child_process');

// Step 1: write a clean probe script to local fs
const fs = require('fs');
const localScript = `#!/bin/bash
echo "=== p1_01 up ==="
cat /var/www/namaweb/migrations/p1_01_legacy_core_rls_up.sql 2>/dev/null | head -80
echo ""
echo "=== audit_trail RLS check ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public' AND tablename='audit_trail';" 2>&1 | head -5
echo "=== audit_trail policies ==="
sudo -u postgres psql -d nama_medical_web -c "SELECT polname, polcmd, polpermissive FROM pg_policy WHERE polrelid='audit_trail'::regclass;" 2>&1 | head -10
echo "=== audit_trail columns ==="
sudo -u postgres psql -d nama_medical_web -c "\\d audit_trail" 2>&1 | head -25
echo "=== done ==="
`;
const localPath = 'C:\\\\Users\\\\ice\\\\Desktop\\\\NMEDCALVSCODE\\\\probe_remote.sh';
fs.writeFileSync(localPath, localScript, 'utf8');

// Step 2: scp it to server
const scp = spawnSync('scp', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  localPath,
  'root@204.168.144.74:/tmp/probe_remote.sh'
]);
console.log('SCP stdout:', scp.stdout ? scp.stdout.toString() : '');
console.log('SCP stderr:', scp.stderr ? scp.stderr.toString() : '');
console.log('SCP status:', scp.status);

// Step 3: ssh in and execute
const ssh = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'bash /tmp/probe_remote.sh'
]);
console.log('--- SSH output ---');
console.log((ssh.stdout || ssh.stderr || '').toString().slice(0, 8000));
console.log('SSH status:', ssh.status);
