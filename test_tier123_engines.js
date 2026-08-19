// filepath: test_tier123_engines.js
const fs = require('fs');
const engines = [
  ['tier123_dental_640_engine', ['dental_exam','restorative','endodontic','periodontal','orthodontic']],
  ['tier123_wound_641_engine', ['wound_assessment','wound_dressing','wound_culture','debridement','wound_closure']],
  ['tier123_skin_642_engine', ['skin_biopsy','dermoscopy','lesion_excision','patch_test','cryotherapy']],
  ['tier123_eye_643_engine', ['visual_acuity','tonometry','fundoscopy','retinal_imaging','oct_scan']]
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