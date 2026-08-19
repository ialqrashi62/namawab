// filepath: test_tier116_engines.js
const fs = require('fs');
const engines = [
  ['tier116_pt_extended_610_engine', ['manual_therapy','therapeutic_exercise','gait_analysis','aquatic_therapy','work_hardening']],
  ['tier116_ot_extended_611_engine', ['adl_training','splinting','assistive_tech','cognitive_rehab','work_rehab']],
  ['tier116_st_voice_612_engine', ['articulation','language_therapy','voice_therapy','cognitive_communication','dysphagia']],
  ['tier116_rehab_engineering_613_engine', ['wheelchair_assessment','orthotic_fitting','prosthetic_assessment','adaptive_equipment','home_modifications']],
  ['tier116_specialty_rehab_614_engine', ['neuro_rehab','cardiac_rehab_phase1','pulmonary_rehab','burn_rehab','lymphedema']]
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