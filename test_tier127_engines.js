// filepath: test_tier127_engines.js
const fs = require('fs');
const engines = [
  ['tier127_cardio_656_engine', ['ecg_full','pacemaker','icd_check','cardiac_rehab','chf_followup']],
  ['tier127_neuro_657_engine', ['stroke_scale','seizure','neuro_exam','eeg_report','lumbar_puncture']],
  ['tier127_oncology_658_engine', ['chemo_cycle','tumor_response','survivorship','palliative_care','hospice_eval']],
  ['tier127_dialysis_659_engine', ['hemodialysis','peritoneal','access_monitoring','transplant_workup','ckd_followup']]
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