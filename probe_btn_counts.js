const { spawnSync } = require('child_process');
const r = spawnSync('ssh', [
  '-i', 'C:\\Users\\ice\\.ssh\\nama_medical_key',
  '-o', 'BatchMode=yes', '-o', 'StrictHostKeyChecking=no', '-o', 'ConnectTimeout=15',
  'root@204.168.144.74', 'bash -s'
], {
  input: [
    'for f in icu-station er-station doctor-station nursing-station obgyn-peds-station; do',
    '  fpath=/var/www/namaweb/public/js/$f.js',
    '  btns=$(grep -c "<button" $fpath)',
    '  onclick_inline=$(grep -cE "onclick=" $fpath)',
    '  ce=$(grep -cE "createElement" $fpath)',
    '  addevent=$(grep -cE "addEventListener" $fpath)',
    '  echo "$f buttons=$btns inline_onclick=$onclick_inline createElement=$ce addEventListener=$addevent"',
    'done'
  ].join('\n') + '\n',
  encoding: 'utf8'
});
process.stdout.write((r.stdout || '') + (r.stderr ? '\nERR:' + r.stderr : ''));
process.stdout.write('\n[STATUS]=' + r.status + '\n');
