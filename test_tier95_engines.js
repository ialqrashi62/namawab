// filepath: test_tier95_engines.js
const fs = require('fs');
const engines = [
  ['tier95_hepatology_viral_498_engine', ['hcv_assessment','hcv_treatment','hbv_assessment','hbv_treatment','hepatitis_vaccination']],
  ['tier95_hepatology_cirrhosis_499_engine', ['cirrhosis_assessment','ascites_management','hepatic_encephalopathy','spontaneous_bacterial_peritonitis','variceal_bleeding']],
  ['tier95_hepatology_liver_failure_500_engine', ['acute_liver_failure','decompensated_cirrhosis','transplant_evaluation','transplant_followup','liver_cancer']],
  ['tier95_hepatology_pediatric_501_engine', ['neonatal_hepatitis','biliary_atresia','pediatric_liver_transplant','pediatric_pf_icp','alpha_1_antitrypsin']],
  ['tier95_hepatology_metabolic_502_engine', ['nafld_assessment','nash_treatment','wilson_disease','hemochromatosis','autoimmune_hepatitis']]
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
