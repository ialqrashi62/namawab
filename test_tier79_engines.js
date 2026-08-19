// filepath: test_tier79_engines.js
const engines = [
  ['tier79_ophth_ext_418_ophth_general_engine', 418, 0, ['vision_screening','refraction','iop_check','dilate_exam','routine_exam']],
  ['tier79_ophth_ext_419_ophth_retina_engine', 419, 5, ['diabetic_retinopathy','amd_management','retinal_detachment','intravitreal_injection','oct_scan']],
  ['tier79_ophth_ext_420_ophth_cataract_engine', 420, 10, ['cataract_eval','cataract_surgery','pre_op_assessment','post_op_care','yag_capsulotomy']],
  ['tier79_ophth_ext_421_ophth_glaucoma_engine', 421, 15, ['glaucoma_initial','visual_field','oct_rnfl','glaucoma_medication','glaucoma_surgery']],
  ['tier79_ophth_ext_422_ophth_pediatric_engine', 422, 20, ['pediatric_exam','amblyopia','strabismus','retinopathy_prematurity','pediatric_cataract']]
];

let passed = 0, failed = 0;
for (const [engFile, engNum, baseIdx, eps] of engines) {
  const e = require('./' + engFile);
  const fs = e.funcs();
  for (let i = 0; i < eps.length; i++) {
    const bodyIdx = baseIdx + i;
    let body;
    try { body = JSON.parse(require('fs').readFileSync(`C:/tmp/oph_body_${bodyIdx}.json`, 'utf8')); }
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
