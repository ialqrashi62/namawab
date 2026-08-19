// filepath: test_tier107_engines.js
const fs = require('fs');
const engines = [
  ['tier107_nursing_assess_561_engine', ['vital_signs','pain_assessment','fall_risk','braden_scale','nursing_diagnosis']],
  ['tier107_nursing_med_admin_562_engine', ['medication_administration','barcode_scanning','iv_pump_programming','double_check_medication','medication_reconciliation']],
  ['tier107_wound_care_563_engine', ['wound_assessment','dressing_change','pressure_injury','ostomy_care','wound_healing']],
  ['tier107_iv_therapy_564_engine', ['iv_insertion','iv_maintenance','central_line','phlebotomy','infusion_reaction']],
  ['tier107_allied_health_565_engine', ['physical_therapy','occupational_therapy','speech_therapy','respiratory_therapy','dietary_consult']]
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