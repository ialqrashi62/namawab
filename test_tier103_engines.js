// filepath: test_tier103_engines.js
const fs = require('fs');
const engines = [
  ['tier103_pathology_538_engine', ['histology_review','cytology','frozen_section','molecular_path','autopsy']],
  ['tier103_radiology_extended_539_engine', ['ct_protocol','mri_protocol','interventional_radiology','contrast_reaction','image_guided_biopsy']],
  ['tier103_nuclear_medicine_540_engine', ['pet_ct','bone_scan','thyroid_scan','myocardial_perfusion','therapy_radionuclide']],
  ['tier103_lab_management_541_engine', ['specimen_collection','critical_value','lab_quality','turn_around_time','lab_error']],
  ['tier103_blood_bank_542_engine', ['type_and_cross','transfusion_reaction','plasma_exchange','platelet_transfusion','autologous_donation']]
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
