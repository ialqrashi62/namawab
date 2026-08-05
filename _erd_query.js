const { spawnSync } = require('child_process');
const fs = require('fs');

// Write SQL to local temp file, scp it, then run on remote
const sql = "SELECT c.relname,\n" +
  "  (SELECT count(*) FROM information_schema.columns WHERE table_schema = 'public' AND table_name = c.relname) AS col_count,\n" +
  "  COALESCE(c.relrowsecurity, false) AS rls,\n" +
  "  COALESCE(c.relforcerowsecurity, false) AS force\n" +
  "FROM pg_class c\n" +
  "JOIN pg_namespace n ON n.oid = c.relnamespace\n" +
  "WHERE n.nspname = 'public' AND c.relkind = 'r'\n" +
  "ORDER BY c.relname;\n";

const localSqlPath = process.env.TEMP + '\\_erd.sql';
fs.writeFileSync(localSqlPath, sql);

// scp the SQL file
const scp = spawnSync('scp', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  localSqlPath,
  'root@204.168.144.74:/tmp/_erd.sql'
]);
process.stderr.write('SCP status: ' + scp.status + '\n');
if (scp.status !== 0) {
  process.stderr.write('SCP stderr: ' + (scp.stderr || '').toString() + '\n');
}

// Run psql with the file
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  "bash -lc \"sudo -u postgres psql -d nama_medical_web -t -A -F '|' -f /tmp/_erd.sql 2>&1 | grep -v 'could not change directory'\""
], { stdio: ['ignore', 'pipe', 'pipe'] });

process.stdout.write((r.stdout || r.stderr || '').toString().slice(0, 80000));
