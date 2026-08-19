// filepath: test_tier77_engines.js
const engines = [
  ['tier77_neuro_ext_408_neuro_stroke_engine', 408, 0, ['stroke_initial','stroke_thrombolysis','stroke_post_care','stroke_rehab','stroke_secondary_prevention']],
  ['tier77_neuro_ext_409_neuro_epilepsy_engine', 409, 5, ['epilepsy_initial','seizure_classification','aed_management','eeg_review','epilepsy_surgery_eval']],
  ['tier77_neuro_ext_410_neuro_movement_engine', 410, 10, ['movement_initial','parkinson_meds','dystonia_botox','tremor_workup','deep_brain_stimulation']],
  ['tier77_neuro_ext_411_neuro_neuromuscular_engine', 411, 15, ['neuropathy_workup','myasthenia_gravis','als_management','gbs_assessment','cnm_referral']],
  ['tier77_neuro_ext_412_neuro_headache_engine', 412, 20, ['headache_initial','migraine_prevention','cluster_headache','medication_overuse','botox_for_migraine']]
];

let passed = 0, failed = 0;
for (const [engFile, engNum, baseIdx, eps] of engines) {
  const e = require('./' + engFile);
  const fs = e.funcs();
  for (let i = 0; i < eps.length; i++) {
    const bodyIdx = baseIdx + i;
    let body;
    try { body = JSON.parse(require('fs').readFileSync(`C:/tmp/neuro_body_${bodyIdx}.json`, 'utf8')); }
    catch (err) { console.log(`SKIP ${engFile}.${eps[i]} (body ${bodyIdx} missing)`); continue; }
    try {
      fs[eps[i]](body);
      console.log(`OK  ${engFile}.${eps[i]}`);
      passed++;
    } catch (err) {
      console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);
      failed++;
    }
  }
}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed > 0 ? 1 : 0);
