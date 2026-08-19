// filepath: test_tier113_engines.js
const fs = require('fs');
const engines = [
  ['tier113_ob_extended_595_engine', ['lactation_consult','breastfeeding_assessment','nipple_pain','mastitis','low_milk_supply']],
  ['tier113_maternal_medicine_596_engine', ['preeclampsia_management','gestational_diabetes','thyroid_pregnancy','cardiac_pregnancy','antepartum_assessment']],
  ['tier113_reproductive_endocrine_597_engine', ['pcos','amenorrhea','hirsutism','menopause_eval','androgen_excess']],
  ['tier113_fertility_598_engine', ['fertility_workup','ovulation_tracking','iui_cycle','embryo_transfer','fertility_outcome']],
  ['tier113_gyne_oncology_extended_599_engine', ['tumor_marker','genetic_counseling','chemotherapy_cyc','radiation_planning','palliative_care_onc']]
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