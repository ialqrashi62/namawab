// filepath: test_tier122_engines.js
const fs = require('fs');
const engines = [
  ['tier122_telehealth_636_engine', ['virtual_visit','remote_monitoring','tele_icu','tele_consult','digital_therapeutic']],
  ['tier122_devices_637_engine', ['implant_log','device_alert','wearable_sync','smart_pump','bedside_monitor']],
  ['tier122_mhealth_638_engine', ['patient_app','secure_message','patient_education_video','symptom_tracker','ai_chatbot']],
  ['tier122_rpm_639_engine', ['rpm_enrollment','reading_outlier','med_adherence','care_pathway','coaching']]
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