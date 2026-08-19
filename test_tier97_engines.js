// filepath: test_tier97_engines.js
const fs = require('fs');
const engines = [
  ['tier97_neph_acute_508_engine', ['aki_diagnosis','dialysis_initiation','ckd_staging','electrolyte_management','acid_base']],
  ['tier97_neph_glomerular_509_engine', ['glomerulonephritis','diabetic_nephropathy','polycystic_kidney','renal_transplant','renal_stones']],
  ['tier97_neph_vascular_510_engine', ['renovascular','htn_renal','cardiorenal','hepatorenal','obstructive_uropathy']],
  ['tier97_neph_dialysis_511_engine', ['hemodialysis','peritoneal_dialysis','vascular_access','anemia_ckd','mineral_bone_ckd']],
  ['tier97_neph_imaging_512_engine', ['renal_ultrasound','renal_ct','renal_biopsy','renal_nuclear','renal_angiography']]
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
