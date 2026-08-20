// filepath: test_tier206_210_engines.js
const fs = require('fs');
const dir = 'C:/Users/ice/Desktop/NMEDCALVSCODE/namaweb';
const files = fs.readdirSync(dir).filter(f => /^tier20[6-9]_\w+_\d+_engine\.js$|^tier210_\w+_\d+_engine\.js$/.test(f));
const engines = files.map(f => f.replace('_engine.js', ''));
let pass = 0, fail = 0;
for (const e of engines) {
  let mod;
  try { mod = require('./' + e + '_engine.js'); }
  catch (err) { console.log('LOAD_FAIL', e, err.message); fail++; continue; }
  const { funcs } = mod;
  const f = funcs();
  for (const fnName of Object.keys(f)) {
    try {
      const out = f[fnName]({
        tenant_id: 't1', patient_id: 'p1', provider: 'p',
        age: 50, type: 'type1', score_1: 75, score_2: 80,
        flag_1: true, flag_2: false, treatment: 'med1', followup_days: 14
      });
      if (out && out.patient_id) { pass++; }
      else { console.log('FAIL', e + '.' + fnName, 'no patient_id'); fail++; }
    } catch (err) {
      console.log('FAIL', e + '.' + fnName + ':', err.message);
      fail++;
    }
  }
}
console.log('TOTALS: pass=' + pass + ' fail=' + fail + ' engines=' + engines.length);