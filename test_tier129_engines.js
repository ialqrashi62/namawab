// filepath: test_tier129_engines.js
const fs = require('fs');
const engines = [
  ['tier129_mental_664_engine', ['phq9','gad7','pcl5','crisis_eval','psychotherapy']],
  ['tier129_substance_665_engine', ['audit_c','dast','detox','naloxone','rehab_enroll']],
  ['tier129_icu_666_engine', ['vent_settings','sedation','vasopressor','fluid_balance','icu_consult']],
  ['tier129_ed_extended_667_engine', ['triage','trauma_assess','sepsis_bundle','stroke_protocol','ami_protocol']]
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