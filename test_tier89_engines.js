// filepath: test_tier89_engines.js
const fs = require('fs');
const path = require('path');
const engines = [
  ['tier89_oncology_chemo_468_engine', ['chemotherapy_regimen','cycle_count','dose_intensity','toxicity_assessment','efficacy_imaging']],
  ['tier89_oncology_radiation_469_engine', ['radiation_planning','dose_tracking','site_specific','radiation_toxicity','brachytherapy']],
  ['tier89_hematology_benign_470_engine', ['anemia_workup','iron_deficiency','hemolysis_workup','bone_marrow','anticoagulation']],
  ['tier89_oncology_support_471_engine', ['palliative_care','pain_management','psychosocial_support','goals_of_care','nutrition_support']],
  ['tier89_oncology_survivorship_472_engine', ['survivorship_plan','late_effects','screening_recurrence','lifestyle_counseling','followup_schedule']]
];
let pass = 0, fail = 0;
let bodyIdx = 0;
for (const [engName, fns] of engines) {
  const e = require('./' + engName);
  const f = e.funcs();
  for (const fn of fns) {
    const bodyPath = `C:\\tmp\\multi_body_${bodyIdx}.json`;
    const body = JSON.parse(fs.readFileSync(bodyPath, 'utf8'));
    try {
      const r = f[fn](body);
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
