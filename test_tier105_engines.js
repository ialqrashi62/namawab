// filepath: test_tier105_engines.js
const fs = require('fs');
const engines = [
  ['tier105_scheduling_550_engine', ['appointment_booking','resource_allocation','waitlist','reminder','no_show']],
  ['tier105_billing_extended_551_engine', ['charge_capture','claim_submission','denial_management','payment_posting','patient_statement']],
  ['tier105_insurance_552_engine', ['eligibility_check','authorization','benefit_verification','referral','pre_certification']],
  ['tier105_administrative_553_engine', ['document_management','correspondence','task_management','inbox_message','notification']],
  ['tier105_communication_554_engine', ['secure_messaging','telehealth_video','patient_portal','care_team','patient_engagement']]
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