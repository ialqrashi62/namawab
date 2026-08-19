// filepath: test_tier131_engines.js
const fs = require('fs');
const engines = [
  ['tier131_workflow_advanced_672_engine', ['care_pathway','task_assignment','escalation','handoff','discharge_summary']],
  ['tier131_quality_advanced_673_engine', ['incident_tracking','complaint_mgmt','feedback_survey','qi_project','peer_review']],
  ['tier131_compliance_audit_674_engine', ['regulatory','audit_finding','corrective_action','risk_assessment','policy_attestation']],
  ['tier131_decision_support_675_engine', ['alert_drug','alert_allergy','alert_renal','alert_sepsis','alert_falls']]
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