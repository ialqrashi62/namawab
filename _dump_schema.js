const { spawnSync } = require('child_process');

const remote = `
sudo -u postgres psql -d nama_medical_web -t -A -F "|" -c "
SELECT c.relname AS tbl,
  a.attname AS col,
  format_type(a.atttypid, a.atttypmod) AS type,
  NOT a.attnotnull AS nullable,
  COALESCE(pg_get_expr(d.adbin, d.adrelid), '') AS default
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped
LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
WHERE n.nspname = 'public' AND c.relkind = 'r'
ORDER BY c.relname, a.attnum;" > /tmp/namamed_cols.txt 2>&1
wc -l /tmp/namamed_cols.txt
echo "---first 30 lines---"
head -30 /tmp/namamed_cols.txt
echo "---last 10 lines---"
tail -10 /tmp/namamed_cols.txt
echo "---FK dump---"
sudo -u postgres psql -d nama_medical_web -t -A -F "|" -c "
SELECT
  tc.table_name,
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS foreign_table,
  ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public'
ORDER BY tc.table_name;" > /tmp/namamed_fks.txt 2>&1
wc -l /tmp/namamed_fks.txt
echo "---index dump---"
sudo -u postgres psql -d nama_medical_web -t -A -F "|" -c "
SELECT schemaname, tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;" > /tmp/namamed_idx.txt 2>&1
wc -l /tmp/namamed_idx.txt
echo "---merge all to namamed_schema_dump.txt---"
{
  echo "## COLUMNS"
  cat /tmp/namamed_cols.txt
  echo "## FOREIGN_KEYS"
  cat /tmp/namamed_fks.txt
  echo "## INDEXES"
  cat /tmp/namamed_idx.txt
} > /tmp/namamed_schema_dump.txt 2>&1
wc -l /tmp/namamed_schema_dump.txt
echo "---first 20---"
head -20 /tmp/namamed_schema_dump.txt
echo "---last 5---"
tail -5 /tmp/namamed_schema_dump.txt
`;

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  `bash -lc '${remote.replace(/'/g, `'\\''`)}'`
], { encoding: 'utf8', maxBuffer: 50 * 1024 * 1024 });

const out = (r.stdout || r.stderr || '').toString();
console.log(out);
console.error('EXIT:', r.status);
