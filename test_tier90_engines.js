// filepath: test_tier90_engines.js
const fs = require('fs');
const engines = [
  ['tier90_genetics_cancer_473_engine', ['cancer_genetic_counseling','brca_counseling','lynch_syndrome','prenatal_genetics','carrier_screening']],
  ['tier90_genetics_rare_474_engine', ['rare_disease_workup','whole_exome','metabolic_genetics','newborn_screening','pharmacogenomics']],
  ['tier90_genetics_adult_475_engine', ['family_history','predictive_testing','cardiovascular_genetics','neurogenetics','genetic_followup']],
  ['tier90_genetics_counseling_476_engine', ['pretest_counseling','results_disclosure','psychosocial_support','cascade_screening','reproductive_counseling']],
  ['tier90_genetics_lab_477_engine', ['karyotype','microarray','variant_interpretation','fish_test','methylation_test']]
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
