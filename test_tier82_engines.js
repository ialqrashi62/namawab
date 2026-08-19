// filepath: test_tier82_engines.js
const engines = [
  ['tier82_obgyn_ext_433_obgyn_antenatal_engine', 433, 0, ['antenatal_initial','antenatal_followup','high_risk_preg','rhesus_isoimmunization','multiples']],
  ['tier82_obgyn_ext_434_obgyn_gyne_engine', 434, 5, ['menstrual_disorder','infertility_eval','contraception_counseling','menopause','pelvic_pain']],
  ['tier82_obgyn_ext_435_obgyn_onc_engine', 435, 10, ['cervical_screening','ovarian_cyst','endometrial_cancer','cervical_cancer','brca_counseling']],
  ['tier82_obgyn_ext_436_obgyn_labor_engine', 436, 15, ['labor_admission','labor_monitoring','vaginal_delivery','cesarean_section','postpartum_care']],
  ['tier82_obgyn_ext_437_obgyn_repro_engine', 437, 20, ['ivf_cycle','iui_cycle','recurrent_pregnancy_loss','pcos_eval','endometriosis']]
];
let passed=0,failed=0;
for(const[engFile,_,baseIdx,eps]of engines){const e=require('./'+engFile);const fns=e.funcs();for(let i=0;i<eps.length;i++){const bodyIdx=baseIdx+i;let body;try{body=JSON.parse(require('fs').readFileSync(`C:/tmp/ob_body_${bodyIdx}.json`,'utf8'))}catch(err){console.log(`SKIP ${engFile}.${eps[i]}`);continue}try{fns[eps[i]](body);console.log(`OK  ${engFile}.${eps[i]}`);passed++}catch(err){console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);failed++}}}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed>0?1:0);
