// filepath: test_tier96_engines.js
const fs = require('fs');
const engines = [
  ['tier96_diabetes_t1dm_503_engine', ['t1dm_management','insulin_pump','cgm_review','dka_management','hypoglycemia']],
  ['tier96_diabetes_t2dm_504_engine', ['t2dm_management','oral_agents','injectable_therapy','diabetes_complications','gestational_diabetes']],
  ['tier96_thyroid_extended_505_engine', ['thyroid_nodule','thyroid_cancer','thyroid_surgery','rai_therapy','thyroid_eye']],
  ['tier96_adrenal_pituitary_506_engine', ['adrenal_incidentaloma','pheochromocytoma','cushings','pituitary_adenoma','adrenal_insufficiency']],
  ['tier96_bone_metabolic_507_engine', ['osteoporosis_screening','osteoporosis_treatment','hyperparathyroidism','pagets','vitamin_d']]
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
