// filepath: test_tier118_engines.js
const fs = require('fs');
const engines = [
  ['tier118_patient_experience_620_engine', ['patient_feedback','complaint_tracking','patient_advocate','patient_education','family_communication']],
  ['tier118_volunteer_services_621_engine', ['volunteer_assignment','volunteer_hours','gift_shop','chaplain_visit','wayfinding_assist']],
  ['tier118_social_services_622_engine', ['psychosocial_assessment','discharge_planning_social','abuse_screening','financial_counseling','community_resource']],
  ['tier118_interpreter_623_engine', ['interpreter_request','translation_document','health_literacy','cultural_assessment','patient_navigator']]
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