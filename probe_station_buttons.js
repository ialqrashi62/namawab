const { spawnSync } = require('child_process');

const remoteScript = [
  'for f in icu-station er-station doctor-station nursing-station obgyn-peds-station; do',
  '  echo "=== $f ==="',
  '  fpath=/var/www/namaweb/public/js/$f.js',
  '  echo "--- size ---"',
  '  wc -l $fpath',
  '  echo "--- first 40 lines ---"',
  '  head -40 $fpath',
  '  echo "--- innerHTML button patterns ---"',
  "  grep -nE 'innerHTML.*button' $fpath | head -5",
  '  echo "--- createElement button patterns ---"',
  "  grep -nE 'createElement.*button' $fpath | head -5",
  '  echo ""',
  'done',
  ''
].join('\n');

const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74',
  'bash -s'
], { input: remoteScript, encoding: 'utf8' });

const out = (r.stdout || '') + (r.stderr ? '\n[STDERR]: ' + r.stderr : '');
console.log(out.slice(0, 10000));
console.log('\n[STATUS]:', r.status);
