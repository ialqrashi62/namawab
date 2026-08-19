// filepath: test_tier114_engines.js
const fs = require('fs');
const engines = [
  ['tier114_anxiety_600_engine', ['gad','panic_disorder','social_anxiety','phobia','separation_anxiety']],
  ['tier114_mood_601_engine', ['mdd','bipolar','dysthymia','seasonal_affective','mixed_features']],
  ['tier114_psychotic_602_engine', ['schizophrenia','schizoaffective','brief_psychotic','delusional','substance_induced_psychotic']],
  ['tier114_trauma_603_engine', ['ptsd','acute_stress','adjustment','complex_trauma','bereavement_reaction']],
  ['tier114_substance_use_604_engine', ['alcohol_use','opioid_use','stimulant_use','cannabis_use','sedative_use']]
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