// filepath: test_tier98_engines.js
const fs = require('fs');
const engines = [
  ['tier98_cardio_acute_513_engine', ['stemi','nstemi','heart_failure','cardiogenic_shock','arrhythmia_acute']],
  ['tier98_cardio_imaging_514_engine', ['echocardiogram','cardiac_mri','cardiac_ct','stress_test','holter_monitoring']],
  ['tier98_cardio_intervention_515_engine', ['pci','cabg','device_implant','ablation','tavr']],
  ['tier98_cardio_electrophysiology_516_engine', ['pacemaker_followup','icd_followup','anticoagulation_cardio','lipid_management','cardiac_rehab']],
  ['tier98_cardio_valve_517_engine', ['aortic_stenosis','mitral_regurgitation','tricuspid_regurg','valve_surgery','endocarditis']]
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
