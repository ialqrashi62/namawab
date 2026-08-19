// filepath: test_tier78_engines.js
const engines = [
  ['tier78_ortho_ext_413_ortho_trauma_engine', 413, 0, ['trauma_initial','fracture_reduction','fracture_orif','soft_tissue_injury','polytrauma']],
  ['tier78_ortho_ext_414_ortho_joint_engine', 414, 5, ['joint_replacement','arthroscopy','joint_injection','joint_aspiration','joint_clinic']],
  ['tier78_ortho_ext_415_ortho_spine_engine', 415, 10, ['spine_clinic','discectomy','spinal_fusion','spine_fracture','scoliosis']],
  ['tier78_ortho_ext_416_ortho_sports_engine', 416, 15, ['acl_reconstruction','rotator_cuff_repair','meniscus_repair','shoulder_impingement','sports_clearance']],
  ['tier78_ortho_ext_417_ortho_pediatric_engine', 417, 20, ['developmental_dysplasia','clubfoot','scoliosis_juvenile','slipped_capital_femoral','pediatric_fracture']]
];

let passed = 0, failed = 0;
for (const [engFile, engNum, baseIdx, eps] of engines) {
  const e = require('./' + engFile);
  const fs = e.funcs();
  for (let i = 0; i < eps.length; i++) {
    const bodyIdx = baseIdx + i;
    let body;
    try { body = JSON.parse(require('fs').readFileSync(`C:/tmp/ortho_body_${bodyIdx}.json`, 'utf8')); }
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
