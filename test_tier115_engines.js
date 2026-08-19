// filepath: test_tier115_engines.js
const fs = require('fs');
const engines = [
  ['tier115_neurosurgery_605_engine', ['craniotomy','spine_fusion','tumor_resection','vp_shunt','cervical_decompression']],
  ['tier115_orthopedics_extended_606_engine', ['joint_replacement','arthroscopy','fracture_fixation','spinal_decompression','ligament_repair']],
  ['tier115_otolaryngology_607_engine', ['sinus_surgery','hearing_aid','cochlear_implant','tonsillectomy','thyroidectomy']],
  ['tier115_ophthalmology_608_engine', ['cataract_surgery','retinal_detachment','glaucoma_surgery','refractive_surgery','corneal_transplant']],
  ['tier115_dentistry_609_engine', ['extraction','root_canal','implant','orthodontic','periodontal']]
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