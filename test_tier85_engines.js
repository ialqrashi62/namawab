// filepath: test_tier85_engines.js
const engines = [
  ['tier85_pain_ext_448_pain_acute_engine', 448, 0, ['acute_pain','ed_pain','trauma_pain','cancer_pain','post_op_pain_titrated']],
  ['tier85_pain_ext_449_pain_chronic_engine', 449, 5, ['chronic_pain','opioid_chronic','pain_clinic','neuropathic_pain','interventional_pain']],
  ['tier85_pain_ext_450_pain_procedures_engine', 450, 10, ['epidural','rfa','surgical_implant','joint_injection','trigger_point']],
  ['tier85_pain_ext_451_pain_rehab_engine', 451, 15, ['pt_ot','tens','biofeedback','work_hardening','functional_restoration']],
  ['tier85_pain_ext_452_pain_specialty_engine', 452, 20, ['headache_pain','pelvic_pain','cancer_pain_specialty','pediatric_pain','pain_psych']]
];
let passed=0,failed=0;
for(const[engFile,_,baseIdx,eps]of engines){const e=require('./'+engFile);const fns=e.funcs();for(let i=0;i<eps.length;i++){const bodyIdx=baseIdx+i;let body;try{body=JSON.parse(require('fs').readFileSync(`C:/tmp/pain_body_${bodyIdx}.json`,'utf8'))}catch(err){console.log(`SKIP ${engFile}.${eps[i]}`);continue}try{fns[eps[i]](body);console.log(`OK  ${engFile}.${eps[i]}`);passed++}catch(err){console.log(`FAIL ${engFile}.${eps[i]} (body ${bodyIdx}): ${err.message}`);failed++}}}
console.log(`\nEngine self-test: PASS=${passed} FAIL=${failed}`);
process.exit(failed>0?1:0);
