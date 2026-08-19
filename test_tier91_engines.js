// filepath: test_tier91_engines.js
const fs = require('fs');
const engines = [
  ['tier91_geriatric_assessment_478_engine', ['comprehensive_assessment','adl_iadl','cognitive_screening','functional_status','social_assessment']],
  ['tier91_geriatric_falls_479_engine', ['fall_risk','home_safety','balance_training','post_fall','fall_prevention']],
  ['tier91_geriatric_polypharmacy_480_engine', ['medication_reconciliation','beers_criteria','deprescribing','adherence','prescribing_principles']],
  ['tier91_geriatric_dementia_481_engine', ['dementia_diagnosis','bpsd','dementia_medications','caregiver_support','safety_assessment']],
  ['tier91_geriatric_palliative_482_engine', ['advance_care_planning','frailty_assessment','nursing_home_placement','hospice_eligibility','goals_care_old']]
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
