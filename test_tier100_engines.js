// filepath: test_tier100_engines.js
const fs = require('fs');
const engines = [
  ['tier100_obgyn_mfm_523_engine', ['prenatal_visit','high_risk_pregnancy','preeclampsia','gestational_diabetes_mgmt','delivery_summary']],
  ['tier100_obgyn_gyn_onc_524_engine', ['ovarian_cyst','cervical_cancer_screening','endometrial_cancer','ovarian_cancer_staging','gyn_chemotherapy']],
  ['tier100_obgyn_rei_525_engine', ['infertility_workup','ovulation_induction','ivf_cycle','icsi','recurrent_pregnancy_loss']],
  ['tier100_obgyn_menopause_526_engine', ['menopause_assessment','hrt_therapy','urogynecology','abnormal_uterine_bleeding','endometriosis']],
  ['tier100_obgyn_reproductive_527_engine', ['contraception_counseling','iud_insertion','sti_screening','pelvic_pain','gyne_surgery']]
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
