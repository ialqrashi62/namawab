// filepath: test_tier109_engines.js
const fs = require('fs');
const engines = [
  ['tier109_pain_management_571_engine', ['pain_assessment','opioid_prescribing','non_opioid_treatment','interventional_pain','pain_followup']],
  ['tier109_palliative_care_572_engine', ['palliative_assessment','symptom_management','goals_of_care','hospice_referral','bereavement']],
  ['tier109_spine_care_573_engine', ['spine_assessment','conservative_treatment','spine_injection','spine_surgery','post_op_spine']],
  ['tier109_sports_medicine_574_engine', ['sports_assessment','injury_treatment','rehabilitation','return_to_play','concussion']],
  ['tier109_sleep_medicine_575_engine', ['sleep_assessment','polysomnography','cpap_titration','insomnia_treatment','sleep_followup']]
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