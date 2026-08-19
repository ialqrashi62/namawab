// filepath: test_tier111_engines.js
const fs = require('fs');
const engines = [
  ['tier111_cardiac_cath_585_engine', ['diagnostic_cath','intervention','pci','thrombectomy','structural']],
  ['tier111_cardiac_rehab_586_engine', ['enrollment','exercise_session','education','outcome_assessment','completion']],
  ['tier111_electrophysiology_587_engine', ['ablation','device_check','afib_management','syncope_workup','icd_followup']],
  ['tier111_dialysis_588_engine', ['hd_session','peritoneal_dialysis','dialysis_access','anemia_management','bone_mineral']],
  ['tier111_neuro_diagnostic_589_engine', ['eeg','eeg_monitoring','emg_ncs','evoked_potentials','lumbar_puncture']]
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