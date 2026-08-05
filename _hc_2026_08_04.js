const { spawnSync } = require('child_process');
const remote = "bash <<'HC_EOF'\n"
  + "echo '=== pm2 ==='\n"
  + "command -v pm2 || echo 'pm2-not-found'\n"
  + "( command -v pm2 >/dev/null && pm2 list 2>&1 | grep -E 'nama-medical-erp|name|status' | head -20 ) || true\n"
  + "echo '=== /api/health ==='\n"
  + 'curl -s -D - -o /dev/null -H "x-tenant-id: tnt-demo" http://127.0.0.1:3000/api/health 2>&1 | grep -iE "HTTP/|X-CSP-Nonce"\n'
  + "echo '=== last 5 http_request lines ==='\n"
  + "( command -v pm2 >/dev/null && pm2 logs nama-medical-erp --lines 200 --nostream --raw 2>/dev/null || true ) | grep http_request | tail -n 5\n"
  + "echo '=== audit_trail count ==='\n"
  + "APP_PW=$(grep '^DB_PASSWORD=' /var/www/namaweb/.env | cut -d= -f2- | tr -d '\\r\\n')\n"
  + "echo APP_PW_len=${#APP_PW}\n"
  + "PGPASSWORD=\"$APP_PW\" psql -h 127.0.0.1 -U nama_medical_app -d nama_medical_web -c \"SET app.tenant_id = '1'; SELECT count(*) AS total, count(*) FILTER (WHERE row_hash <> '') AS chained FROM audit_trail;\" 2>&1 | grep -v 'could not change directory'\n"
  + "HC_EOF";

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  remote
], { encoding: 'utf8' });
process.stdout.write((r.stdout || r.stderr || '').slice(0, 6000));
