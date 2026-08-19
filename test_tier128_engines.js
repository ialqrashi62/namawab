// filepath: test_tier128_engines.js
const fs = require('fs');
const engines = [
  ['tier128_womens_660_engine', ['prenatal_visit','postpartum','contraception','menopause','infertility']],
  ['tier128_maternal_661_engine', ['high_risk_pregnancy','gestational_diabetes','preeclampsia','nst','biophysical_profile']],
  ['tier128_pediatric_662_engine', ['well_child','immunization','newborn_screen','feeding','growth_chart']],
  ['tier128_neonatal_663_engine', ['nicu_admission','apgar','phototherapy','kangaroo_care','nicu_discharge']]
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