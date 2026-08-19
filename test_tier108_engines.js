// filepath: test_tier108_engines.js
const fs = require('fs');
const engines = [
  ['tier108_ct_advanced_566_engine', ['ct_cardiac','ct_pulmonary_angiogram','ct_perfusion','ct_enterography','ct_virtual_colonoscopy']],
  ['tier108_mri_advanced_567_engine', ['mri_brain','mri_spine','functional_mri','mr_angiography','mr_spectroscopy']],
  ['tier108_ultrasound_advanced_568_engine', ['echo_complete','vascular_duplex','point_of_care_us','elastography','contrast_echo']],
  ['tier108_imaging_ai_569_engine', ['ai_detection','image_segmentation','classification','computer_aided_diagnosis','radiomics']],
  ['tier108_imaging_quality_570_engine', ['accreditation','dose_monitoring','image_quality','report_turnaround','peer_review']]
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