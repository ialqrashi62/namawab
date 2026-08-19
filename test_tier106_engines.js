// filepath: test_tier106_engines.js
const fs = require('fs');
const engines = [
  ['tier106_er_extended_555_engine', ['triage_protocol','fast_track','critical_care','observation','discharge_planning']],
  ['tier106_trauma_center_556_engine', ['trauma_team_activation','massive_transfusion','damage_control_surgery','icu_admission','rehab_referral']],
  ['tier106_disaster_557_engine', ['incident_command','triage_disaster','resource_surge','decontamination','evacuation']],
  ['tier106_poison_control_558_engine', ['exposure_assessment','antidote_administration','observation_period','follow_up_call','toxicology_screen']],
  ['tier106_pre_hospital_559_engine', ['ems_dispatch','field_triage','transport_decision','pre_hospital_care','handover']]
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