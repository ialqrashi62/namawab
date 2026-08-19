// filepath: test_tier132_engines.js
const fs = require('fs');
const engines = [
  ['tier132_gastro_676_engine', ['ercp','liver_biopsy','us_elastography','manometry','ct_enterography']],
  ['tier132_pulm_677_engine', ['pft','sleep_study','vent_weaning','tb_screening','oxygen_therapy']],
  ['tier132_endo_678_engine', ['diabetes_mgmt','thyroid','adrenal','reproductive_endocrine','bone_density']],
  ['tier132_rheum_679_engine', ['arthrocentesis','connective_tissue','dmards','rehab_assess','das28']]
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