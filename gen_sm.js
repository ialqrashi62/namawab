const fs = require('fs');
const mounts = JSON.parse(fs.readFileSync('mounts.json', 'utf8'));
const waves = ['sdoh', 'forensic', 'genomics', 'integ', 'ops', 'pain', 'pharm', 'rare', 'surg_spec', 'rehab', 'imaging', 'infusion', 'dental', 'addiction_med'];

let total = 0;
let out = ['#!/bin/bash',
           'HOST="http://127.0.0.1:3000"',
           'PASS=0; FAIL=0',
           'run() {',
           '  local url="$1"; local body="$2"; local name="$3"',
           '  local code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$HOST$url" -H \'Content-Type: application/json\' -d "$body")',
           '  if [ "$code" = "200" ]; then echo "OK $name"; PASS=$((PASS+1));',
           '  else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi',
           '}',
           ''];

waves.forEach(w => {
  const re = new RegExp('tier5_' + w + '_ext_(\\d+)_(\\w+)_router');
  const routes = {};
  for (const k of Object.keys(mounts)) {
    const m = k.match(re);
    if (m) {
      if (!routes[m[1]]) routes[m[1]] = [];
      routes[m[1]].push(mounts[k]);
    }
  }
  const keys = Object.keys(routes).sort();
  if (keys.length) {
    out.push('echo "## ' + w.toUpperCase() + '"');
    keys.forEach(n => {
      const prefix = 'tier5_' + w + '_ext_' + n + '_';
      const files = fs.readdirSync('.').filter(f => f.startsWith(prefix) && f.endsWith('_router.js'));
      files.forEach(fname => {
        const txt = fs.readFileSync(fname, 'utf8');
        const routes_ = [];
        const m1 = txt.match(/router\.post\(\s*'([^']+)'/g);
        const m2 = txt.match(/r\.post\(\s*'([^']+)'/g);
        const all = (m1 || []).concat(m2 || []);
        all.forEach(line => {
          const em = line.match(/'([^']+)'/);
          if (em) {
            out.push('run "' + routes[n][0] + em[1] + '" \'{"_probe":true}\' "' + w + '_' + n + '_' + em[1] + '"');
            total++;
          }
        });
      });
    });
    out.push('');
  }
});

out.push('echo ""');
out.push('echo "PASS=$PASS FAIL=$FAIL"');

// Dedupe consecutive run lines
const seen = new Set();
const final = [];
for (const line of out) {
  if (line.startsWith('run ') && seen.has(line)) continue;
  if (line.startsWith('run ')) seen.add(line);
  final.push(line);
}
fs.writeFileSync('sm_tier5_gen.sh', final.join('\n').replace(/\r/g, '') + '\n');
console.log('Total unique endpoints:', final.filter(l => l.startsWith('run ')).length);
