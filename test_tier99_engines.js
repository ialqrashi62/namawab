// filepath: test_tier99_engines.js
const fs = require('fs');
const engines = [
  ['tier99_icu_extended_518_engine', ['mechanical_ventilation','ards_management','septic_shock','icu_delirium','icu_nutrition']],
  ['tier99_ed_extended_519_engine', ['ed_triage','trauma_assessment','stroke_alert','overdose_toxicology','ed_discharge']],
  ['tier99_perioperative_520_engine', ['preanesthetic_eval','intraoperative_monitoring','pacu','postop_complications','enhanced_recovery']],
  ['tier99_rehab_521_engine', ['stroke_rehab','cardiac_rehab_phase2','pulmonary_rehab','joint_replacement','amputee_rehab']],
  ['tier99_oncology_extended_522_engine', ['tumor_board','molecular_profiling','clinical_trial','survivorship_followup','hospice_referral']]
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
