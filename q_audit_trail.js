// q_audit_trail.js — inspect audit_trail schema and hash columns on Hetzner
const { spawnSync } = require('child_process');

const sshArgs = [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes',
  '-o', 'StrictHostKeyChecking=no',
  '-o', 'ConnectTimeout=15',
  'root@204.168.144.74'
];

function run(remoteCmd) {
  const r = spawnSync('ssh', [...sshArgs, `bash -lc ${shellQuote(remoteCmd)}`], { encoding: 'utf8' });
  return r.stdout || r.stderr || '';
}

function shellQuote(s) {
  return "'" + s.replace(/'/g, `'\\''`) + "'";
}

const sql = `
echo "=== audit_trail full schema ===";
sudo -u postgres psql -d nama_medical_web -c "\\\\d audit_trail" 2>&1 | grep -v "could not change directory";
echo "";
echo "=== any hash columns elsewhere? ===";
sudo -u postgres psql -d nama_medical_web -t -c "SELECT table_name || '|' || column_name FROM information_schema.columns WHERE table_schema = 'public' AND column_name ILIKE '%hash%' ORDER BY table_name, column_name;" 2>&1 | grep -v "could not change directory";
echo "";
echo "=== current row count + sample row ===";
sudo -u postgres psql -d nama_medical_web -c "SELECT count(*) FROM audit_trail; SELECT id, user_id, action, module, created_at, tenant_id FROM audit_trail ORDER BY id DESC LIMIT 3;" 2>&1 | grep -v "could not change directory";
echo "";
echo "=== logAudit uses? ===";
grep -nE "INSERT INTO audit_trail|INSERT INTO audit_log|logAudit\\(" /var/www/namaweb/server.js | head -20;
`;

process.stdout.write(run(sql));
