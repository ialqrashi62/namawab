// filepath: test_tier92_engines.js
const fs = require('fs');
const engines = [
  ['tier92_immunodeficiency_483_engine', ['primary_immunodeficiency','hiv_care','immunoglobulin_replacement','vaccine_immunodeficiency','autoimmune_screening']],
  ['tier92_allergy_clinical_484_engine', ['allergic_rhinitis','asthma_management','food_allergy','drug_allergy','anaphylaxis']],
  ['tier92_immunology_lab_485_engine', ['allergy_testing','lymphocyte_subsets','complement_levels','cytokine_panel','neutrophil_function']],
  ['tier92_immunotherapy_486_engine', ['allergen_immunotherapy','biologic_therapy','oral_immunotherapy','desensitization','immunosuppression']],
  ['tier92_autoimmune_487_engine', ['autoimmune_assessment','lupus_disease_activity','autoimmune_arthritis','vasculitis_assessment','connective_tissue']]
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
