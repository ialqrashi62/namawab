// filepath: test_tier93_engines.js
const fs = require('fs');
const engines = [
  ['tier93_rheumatoid_488_engine', ['ra_assessment','ra_treatment','ra_monitoring','ra_imaging','ra_surgery']],
  ['tier93_spondyloarthropathy_489_engine', ['ankylosing_spondylitis','psoriatic_arthritis','ibd_arthritis','reactive_arthritis','enthesitis']],
  ['tier93_crystal_arthritis_490_engine', ['gout_acute','gout_chronic','cppd','basic_calcium_phosphate','crystal_synovial']],
  ['tier93_connective_tissue_491_engine', ['sle_diagnosis','ssc_diagnosis','sjs_diagnosis','myositis_diagnosis','overlap_syndromes']],
  ['tier93_vasculitis_492_engine', ['gca','takayasu','anca_vasculitis','polyarteritis','secondary_vasculitis']]
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
