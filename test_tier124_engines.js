// filepath: test_tier124_engines.js
const fs = require('fs');
const engines = [
  ['tier124_rad_advanced_644_engine', ['mri_advanced','ct_advanced','pet_imaging','mammography','bone_density']],
  ['tier124_cardio_imaging_645_engine', ['echo_complete','stress_test','cardiac_mri','holter','event_monitor']],
  ['tier124_endoscopy_646_engine', ['colonoscopy','egd','bronchoscopy','cystoscopy','laparoscopy']],
  ['tier124_ultrasound_647_engine', ['abdominal_us','vascular_us','obstetric_us','echo_us','msk_us']]
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