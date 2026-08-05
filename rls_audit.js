const { spawnSync } = require('child_process');
const CMD = [
  "echo '=== total tenant-aware public tables ==='",
  "sudo -u postgres psql -d nama_medical_web -t -c \"SELECT count(*) FROM information_schema.columns WHERE table_schema = 'public' AND column_name = 'tenant_id';\"",
  "echo '=== with RLS FORCE ==='",
  "sudo -u postgres psql -d nama_medical_web -t -c \"SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity = true AND c.relforcerowsecurity = true;\"",
  "echo '=== RLS enabled but not forced ==='",
  "sudo -u postgres psql -d nama_medical_web -t -c \"SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace WHERE n.nspname = 'public' AND c.relkind = 'r' AND c.relrowsecurity = true AND COALESCE(c.relforcerowsecurity, false) = false;\"",
  "echo '=== tenant-aware tables with NO RLS at all (rls_on = false) ==='",
  "sudo -u postgres psql -d nama_medical_web -t -c \"SELECT count(*) FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace JOIN information_schema.columns col ON col.table_name = c.relname AND col.table_schema = 'public' WHERE n.nspname = 'public' AND c.relkind = 'r' AND COALESCE(c.relrowsecurity, false) = false AND col.column_name = 'tenant_id';\"",
  "echo ''",
  "echo '=== first 20 tenant-aware tables without RLS ==='",
  "sudo -u postgres psql -d nama_medical_web -t -c \"SELECT c.relname FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace JOIN information_schema.columns col ON col.table_name = c.relname AND col.table_schema = 'public' WHERE n.nspname = 'public' AND c.relkind = 'r' AND COALESCE(c.relrowsecurity, false) = false AND col.column_name = 'tenant_id' ORDER BY c.relname LIMIT 20;\""
].join("; ");
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'bash',
  '-lc',
  CMD
], { encoding: 'utf8' });
const out = (r.stdout || r.stderr || '').toString();
console.log(out.replace(/^could not change directory.*\n?/gm, '').slice(0, 4000));
