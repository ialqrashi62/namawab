const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -c 'APP_PW=$(grep "^DB_PASSWORD=" /var/www/namaweb/.env | cut -d= -f2- | tr -d "\r\n"); PGPASSWORD="$APP_PW" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -v ON_ERROR_STOP=1 <<SQL 2>&1 | grep -v "could not change directory"
SET app.tenant_id = '"'"'1'"'"';
INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address, tenant_id) VALUES (1, '"'"'w21t'"'"', '"'"'LOGIN'"'"', '"'"'Auth'"'"', '"'"'chain test 1'"'"', '"'"'127.0.0.1'"'"', 1);
INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address, tenant_id) VALUES (1, '"'"'w21t'"'"', '"'"'MFA'"'"', '"'"'Auth'"'"', '"'"'chain test 2'"'"', '"'"'127.0.0.1'"'"', 1);
INSERT INTO audit_trail (user_id, username, action, module, new_values, ip_address, tenant_id) VALUES (1, '"'"'w21t'"'"', '"'"'LOGOUT'"'"', '"'"'Auth'"'"', '"'"'chain test 3'"'"', '"'"'127.0.0.1'"'"', 1);
SELECT id, action, chain_idx, substr(row_hash, 1, 16) AS hash16, substr(prev_hash, 1, 16) AS prev16 FROM audit_trail WHERE row_hash <> '"'"''"'"' ORDER BY chain_idx ASC;
SQL'`
]);
console.log((r.stdout || r.stderr || '').toString().slice(0, 3000));
