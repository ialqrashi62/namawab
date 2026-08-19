// filepath: test_tier125_engines.js
const fs = require('fs');
const engines = [
  ['tier125_lab_advanced_648_engine', ['cbc_differential','metabolic_panel','coag_study','urinalysis','microalbumin']],
  ['tier125_pathology_649_engine', ['histology_report','cytology','frozen_section','immuno_stain','molecular_path']],
  ['tier125_microbiology_650_engine', ['culture_growth','gram_stain','sensitivity','parasitology','mycology']],
  ['tier125_transfusion_651_engine', ['type_screen','crossmatch','transfuse_unit','reaction_investigation','apheresis']]
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