// filepath: test_tier104_engines.js
const fs = require('fs');
const engines = [
  ['tier104_quality_543_engine', ['accreditation','cms_metrics','value_based_care','patient_experience','hospital_scorecard']],
  ['tier104_compliance_544_engine', ['regulatory_compliance','audit_response','policy_management','training_compliance','incident_reporting']],
  ['tier104_epidemiology_545_engine', ['disease_surveillance','outbreak_investigation','vaccine_tracking','screening_program','registry_data']],
  ['tier104_public_health_546_engine', ['community_health','health_education','screening_program','environmental_health','maternal_child_health']],
  ['tier104_telemedicine_549_engine', ['tele_consult','remote_monitoring','store_and_forward','virtual_triage','tele_icu']],
  ['tier104_qi_547_engine', ['qi_project','clinical_audit','patient_safety','sentinel_event','quality_metrics']],
  ['tier104_research_548_engine', ['research_protocol','clinical_trial_enrollment','data_collection','manuscript_prep','irb_submission']]
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
