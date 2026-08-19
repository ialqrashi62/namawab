// filepath: test_tier117_engines.js
const fs = require('fs');
const engines = [
  ['tier117_workflow_615_engine', ['order_set','care_pathway','referral_management','handoff','shift_report']],
  ['tier117_capacity_616_engine', ['bed_management','staff_scheduling','equipment_tracking','room_utilization','resource_allocation']],
  ['tier117_documentation_617_engine', ['clinical_note','discharge_summary','procedure_note','consultation_note','progress_note']],
  ['tier117_decision_support_618_engine', ['clinical_alert','drug_interaction','preventive_care_alert','best_practice_alert','risk_score']],
  ['tier117_analytics_619_engine', ['dashboard','report','cohort_analysis','outcome_tracking','kpi_monitoring']]
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