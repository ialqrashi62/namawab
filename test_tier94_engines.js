// filepath: test_tier94_engines.js
const fs = require('fs');
const engines = [
  ['tier94_pulm_function_493_engine', ['spirometry','lung_volumes','dlco','six_min_walk','mip_mep']],
  ['tier94_pulm_sleep_494_engine', ['osa_assessment','cpap_titration','polysomnography','sleep_hygiene','narcolepsy']],
  ['tier94_pulm_interstitial_495_engine', ['ild_diagnosis','ipf_diagnosis','sarcoidosis','hypersensitivity_pneumonitis','connective_tissue_ild']],
  ['tier94_pulm_vascular_496_engine', ['pah_diagnosis','cteph','pulmonary_edema','pulmonary_embolism','pulmonary_hypertension']],
  ['tier94_pulm_pleural_497_engine', ['pleural_effusion','thoracentesis','chest_tube','pleurodesis','empyema']]
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
