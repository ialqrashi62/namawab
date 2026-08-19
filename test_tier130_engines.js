// filepath: test_tier130_engines.js
const fs = require('fs');
const engines = [
  ['tier130_pharm_admin_668_engine', ['order_entry','iv_admixture','patient_education_rx','med_reconciliation','inventory_check']],
  ['tier130_therapy_669_engine', ['pt_session','ot_session','st_session','rt_session','dialysis_session']],
  ['tier130_surg_sched_670_engine', ['block_time','pre_admission','booking','booking_cancel','or_utilization']],
  ['tier130_education_671_engine', ['chart_audit','staff_education','policy_review','staff_training','cme_credit']]
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