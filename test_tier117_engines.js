// filepath: test_tier117_engines.js
const fs = require('fs');
const engines = [
  ['tier117_workflow_615_engine', ['handoff_sbar','protocol_activation','order_set','rounding_list','discharge_checklist']],
  ['tier117_clinical_decision_617_engine', ['drug_interaction','renal_dose_alert','sepsis_alert','pressure_ulcer_alert','fall_alert']],
  ['tier117_quality_metrics_618_engine', ['core_measure','ami_performance','stroke_performance','vte_performance','patient_satisfaction']],
  ['tier117_credentialing_619_engine', ['privilege_request','privilege_renewal','peer_review','license_verification','credentialing_renewal']]
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