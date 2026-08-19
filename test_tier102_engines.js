// filepath: test_tier102_engines.js
const fs = require('fs');
const engines = [
  ['tier102_surg_general_533_engine', ['hernia_repair','cholecystectomy','appendectomy','bowel_resection','soft_tissue']],
  ['tier102_surg_oncology_534_engine', ['cancer_staging','tumor_resection','lymph_node_dissection','recurrent_cancer','palliative_surgery']],
  ['tier102_surg_vascular_535_engine', ['aaa_repair','carotid_endarterectomy','bypass_graft','varicose_veins','dvt_treatment']],
  ['tier102_surg_trauma_536_engine', ['trauma_assessment','damage_control','resuscitation','penetrating_trauma','blunt_trauma']],
  ['tier102_surg_transplant_537_engine', ['transplant_evaluation','transplant_surgery','post_transplant','donor_workup','immunosuppression']]
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
