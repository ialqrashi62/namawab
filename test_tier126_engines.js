// filepath: test_tier126_engines.js
const fs = require('fs');
const engines = [
  ['tier126_surgery_advanced_652_engine', ['surgical_case','trauma_surgery','emergent_surgery','complex_case','fetal_surgery']],
  ['tier126_anesthesia_653_engine', ['preop_assessment','anesthesia_induction','intraop_monitoring','emergence','regional_block']],
  ['tier126_pain_654_engine', ['pain_assessment','analgesic_admin','nerve_block','pca_pump','intrathecal']],
  ['tier126_orthotics_655_engine', ['splint','cast','bracing','prosthetic','orthotic']]
];
let pass = 0, fail = 0, bodyIdx = 0;
for (const [engName, fns] of engines) {
  const e = require('./' + engName);
  const f = e.funcs();
  for (const fn of fns) {
    const body = JSON.parse(fs.readFileSync(`C:\\tmp\\multi_body_${bodyIdx}.json`, 'utf8'));
    try {
      f[fn](body);
      console.log(`PASS ${engName}.${fn} (body ${bodyIdx})`);
      pass++;
    } catch (err) {
      console.log(`FAIL ${engName}.${fn} (body ${bodyIdx}): ${err.message}`);
      fail++;
    }
    bodyIdx++;
  }
}
console.log(`Engine self-test: PASS=${pass} FAIL=${fail}`);
process.exit(fail > 0 ? 1 : 0);