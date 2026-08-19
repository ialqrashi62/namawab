// filepath: test_tier121_engines.js
const fs = require('fs');
const engines = [
  ['tier121_pharm_advanced_632_engine', ['controlled_substance','compounded_sterile','radiopharmaceutical','biologic_therapy','specialty_med']],
  ['tier121_genomics_633_engine', ['genetic_test','variant_interpretation','pharmacogenomics','hereditary_cancer','prenatal_screening']],
  ['tier121_biomarkers_634_engine', ['tumor_marker','cardiac_biomarker','inflammatory_marker','infectious_marker','allergy_panel']],
  ['tier121_precision_med_635_engine', ['molecular_tumor_board','targeted_therapy','companion_dx','liquid_biopsy','minimal_residual']]
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