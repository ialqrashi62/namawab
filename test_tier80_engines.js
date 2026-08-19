// filepath: test_tier80_engines.js
const engines = [
  ['tier80_ent_ext_423_ent_general_engine', 423, 0, ['ent_clinic','audiometry','hearing_aid','cochlear_impl','ent_referral']],
  ['tier80_ent_ext_424_ent_sinus_engine', 424, 5, ['sinusitis_eval','sinus_surgery','allergic_rhinitis','epistaxis','nasal_endoscopy']],
  ['tier80_ent_ext_425_ent_throat_engine', 425, 10, ['tonsillitis','tonsillectomy','obstructive_sleep_apnea','laryngitis_reflux','voice_therapy']],
  ['tier80_ent_ext_426_ent_head_neck_engine', 426, 15, ['thyroid_nodule','thyroidectomy','neck_mass','salivary_gland','head_neck_cancer']],
  ['tier80_ent_ext_427_ent_pediatric_engine', 427, 20, ['otitis_media','myringotomy','adenoidectomy','newborn_hearing','congenital_neck_mass']]
];

let passed = 0, failed = 0;
for (const [engFile, engNum, baseIdx, eps] of engines) {
  const e = require('./' + engFile);
  const fs = e.funcs();
  for (let i = 0; i < eps.length; i++) {
    const bodyIdx = baseIdx + i;
    let body;
    try { body = JSON.parse(require('fs').readFileSync(`C:/tmp/ent_body_${bodyIdx}.json`, 'utf8')); }
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
