// filepath: test_tier120_engines.js
const fs = require('fs');
const engines = [
  ['tier120_billing_628_engine', ['claim_submission','claim_status','payment_posting','denial_management','statement_generation']],
  ['tier120_coding_629_engine', ['icd10_coding','cpt_coding','hcpcs_coding','drg_assignment','coding_audit']],
  ['tier120_revenue_630_engine', ['revenue_cycle_kpi','contract_management','payer_mix','underpayment','writeoff']],
  ['tier120_patient_finance_631_engine', ['eligibility_check','prior_authorization','charity_care','payment_plan','patient_statement']]
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