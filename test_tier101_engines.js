// filepath: test_tier101_engines.js
const fs = require('fs');
const engines = [
  ['tier101_peds_neonatal_528_engine', ['nicu_admission','respiratory_distress','neonatal_sepsis','feeding_growth','neonatal_jaundice']],
  ['tier101_peds_picu_529_engine', ['picu_admission','peds_septic_shock','status_asthmaticus','dka_pediatric','status_epilepticus']],
  ['tier101_peds_cardiology_530_engine', ['congenital_heart_disease','echocardiogram_peds','fetal_echo','peds_arrhythmia','chd_followup']],
  ['tier101_peds_pulmonology_531_engine', ['asthma_peds','cf_followup','bronchopulmonary_dysplasia','sleep_peds','peds_bronchoscopy']],
  ['tier101_peds_development_532_engine', ['developmental_screening','autism_screening','learning_disability','adhd_assessment','behavioral_assessment']]
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
