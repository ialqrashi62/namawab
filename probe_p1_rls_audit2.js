const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c "cd /var/www/namaweb && cat > /tmp/probe_audit_rls.sh <<'EOSH'
#!/bin/bash
echo '=== p1_01 up ==='
cat /var/www/namaweb/migrations/p1_01_legacy_core_rls_up.sql 2>/dev/null | head -80
echo ''
echo '=== audit_trail RLS check ==='
sudo -u postgres psql -d nama_medical_web -c \"SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname='public' AND tablename='audit_trail';\" 2>&1 | head -5
echo '=== audit_trail policies ==='
sudo -u postgres psql -d nama_medical_web -c \"SELECT polname, polcmd, polpermissive FROM pg_policy WHERE polrelid='audit_trail'::regclass;\" 2>&1 | head -10
EOSH
chmod +x /tmp/probe_audit_rls.sh
bash /tmp/probe_audit_rls.sh"`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 6000));
